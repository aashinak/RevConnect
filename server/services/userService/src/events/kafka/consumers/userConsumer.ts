// userConsumer.ts
import { consumer } from "../../../config/kafka/kafkaConfig";
import userCreateHandler from "../../../usecases/kafka/userEvents/userCreate";
import Logger from "../../../utils/logger"; 
import dlqProducer from "../producers/dlqProducer";

// Retry logic with exponential backoff
const retryWithBackoff = async (action: Function, retries = 3, delay = 1000): Promise<void> => {
  try {
    await action();
  } catch (error) {
    if (retries === 0) throw error;
    Logger.warn(`Retrying after failure, attempts left: ${retries}`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(action, retries - 1, delay * 2); // Exponential backoff
  }
};

const userConsumer = async () => {
  try {
    Logger.info("Connecting Kafka consumer...");
    await consumer.connect();
    Logger.info("Subscribing to topic: user-events...");
    await consumer.subscribe({ topic: 'user-events', fromBeginning: true });

    Logger.info("Consumer is now running...");
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        Logger.debug("Received message from Kafka", {
          topic,
          partition,
          offset: message.offset,
          key: message.key?.toString(),
          timestamp: message.timestamp,
        });

        try {
          const rawValue = message.value?.toString();
          if (!rawValue) {
            Logger.warn("Received empty message value", { partition });
            return;
          }

          const { eventType, data } = JSON.parse(rawValue);

          if (eventType === 'USER_CREATED') {
            Logger.info("Processing USER_CREATED event", { userId: data?.userId });

            // Retry logic for processing the event
            await retryWithBackoff(async () => {
              // Simulate processing the message (e.g., update user in the database)
              await userCreateHandler(data); // update logic goes here
            });
          } 
        } catch (error: any) {
          Logger.error("Failed to process message", {
            error: error.message,
            stack: error.stack,
            rawMessage: message.value?.toString(),
          });

          // Move failed message to Dead Letter Queue (DLQ) after retries are exhausted
          await dlqProducer(message); // Send to DLQ using the external DLQ service
        }
      },
    });
  } catch (error: any) {
    Logger.error("Error starting Kafka consumer", {
      error: error.message,
      stack: error.stack,
    });
  }
};

// // Simulate user update processing
// const processUserUpdate = async (data: any) => {
//   // Simulate possible failure
//   if (Math.random() < 0.5) {
//     throw new Error("Simulated processing failure"); // Simulate a failure for demonstration
//   }
//   Logger.info("User update successful", data);
// };

export default userConsumer;