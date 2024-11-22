import logger from "../../utils/logger";
import  userConsumer  from "./consumers/userConsumer";

const startConsumers = async () => {
  try {
    logger.info("Initializing all Kafka consumers...");
    // Start multiple consumers concurrently
    await Promise.all([userConsumer(), ]);
    logger.info("All Kafka consumers are running.");
  } catch (error: any) {
    logger.error("Error while initializing Kafka consumers", { error: error.message });
    process.exit(1); // Exit process if consumers fail to start
  }
};

export default startConsumers
