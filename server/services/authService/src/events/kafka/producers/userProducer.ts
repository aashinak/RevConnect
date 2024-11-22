import { producer } from "../../../config/kafka/kafkaConfig";
import logger from "../../../utils/logger";

interface UserCreatedEvent {
    eventType: "USER_CREATED";
    data: {
        userId: string;
        name: string;
        email: string;
        avatar: string;
    };
}

const userProducer = async (data: UserCreatedEvent["data"]): Promise<void> => {
    const eventPayload = {
        eventType: "USER_CREATED",
        data,
    };

    try {
        logger.info("Initiating Kafka producer process ::: authService ::: userProducer");

        logger.info("Connecting to Kafka producer...");
        await producer.connect();
        logger.info("Kafka producer connected successfully.");

        logger.info("Preparing to send message to Kafka topic...", {
            topic: "user-events",
            partitionKey: "USER_CREATED",
            payload: eventPayload,
        });

        await producer.send({
            topic: "user-events",
            messages: [
                {
                    value: JSON.stringify(eventPayload),
                },
            ],
        });

        logger.info("Message successfully sent to Kafka topic ::: authService ::: userProducer", {
            topic: "user-events",
            eventType: "USER_CREATED",
            userId: data.userId,
            payloadSize: JSON.stringify(eventPayload).length,
        });
    } catch (error: any) {
        logger.error("Error occurred while producing message to Kafka ::: authService ::: userProducer", {
            errorMessage: error.message,
            stackTrace: error.stack,
            topic: "user-events",
            eventPayload,
        });
        throw error; // Re-throw the error for the caller to handle
    } finally {
        try {
            logger.info("Disconnecting Kafka producer...");
            await producer.disconnect();
            logger.info("Kafka producer disconnected successfully.");
        } catch (disconnectError: any) {
            logger.error("Error disconnecting Kafka producer ::: authService ::: userProducer", {
                errorMessage: disconnectError.message,
                stackTrace: disconnectError.stack,
            });
        }
    }
};

export default userProducer;
