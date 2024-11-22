import { producer } from "../../../config/kafka/kafkaConfig";
import Logger from "../../../utils/logger";

const DLQ_TOPIC = 'user-events-dlq'; // Define your DLQ topic

const dlqProducer = async (message: any) => {
  try {
    await producer.send({
      topic: DLQ_TOPIC,
      messages: [
        {
          key: message.key?.toString(),
          value: message.value,
        },
      ],
    });

    Logger.info("Message moved to DLQ", { rawMessage: message.value?.toString() });
  } catch (error: any) {
    Logger.error("Failed to send message to DLQ", {
      error: error.message,
      stack: error.stack,
      rawMessage: message.value?.toString(),
    });
  }
};
export default dlqProducer