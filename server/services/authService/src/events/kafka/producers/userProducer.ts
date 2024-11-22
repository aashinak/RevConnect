import { producer } from "../../../config/kafka/kafkaConfig";
import logger from "../../../utils/logger";

interface UserCreatedEvent {
    eventType: "USER_CREATED"; // Enforces the specific event type
    data: {
        userId: string;
        name: string;
        email: string;
        avatar: string;
    };
}

const userProducer = async (event: UserCreatedEvent): Promise<void> => {
    logger.info(
        "Attempting to produce a message ::: authService ::: userProducer",
        {
            eventType: event.eventType,
            userId: event.data.userId,
        }
    );

    try {
        logger.debug("Connecting to Kafka producer...");
        await producer.connect();

        logger.debug("Sending message to topic: user-events", {
            topic: "user-events",
            partitionKey: "USER_CREATED",
            eventPayload: event,
        });

        await producer.send({
            topic: "user-events",
            messages: [
                {
                    key: "USER_CREATED", // Use the key provided as partition key
                    value: JSON.stringify(event), // Serialize the event with type safety
                },
            ],
        });

        logger.info(
            "Message sent successfully! ::: authService ::: userProducer",
            {
                topic: "user-events",
                eventType: event.eventType,
                userId: event.data.userId,
            }
        );
    } catch (error: any) {
        logger.error(
            "Error while producing message to Kafka ::: authService ::: userProducer",
            {
                error: error.message,
                stack: error.stack,
                eventPayload: event,
            }
        );
    } finally {
        try {
            logger.debug("Disconnecting Kafka producer...");
            await producer.disconnect();
            logger.info("Kafka producer disconnected successfully.");
        } catch (disconnectError: any) {
            logger.error("Error disconnecting Kafka producer", {
                error: disconnectError.message,
                stack: disconnectError.stack,
            });
        }
    }
};

export default userProducer;
