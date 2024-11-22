import app from "./app";
import connectDb from "./config/database/dbConfig";
import startConsumers from "./events/kafka/consumerRunner";
import logger from "./utils/logger";

const port = process.env.PORT || 9000;

connectDb().then(() => {
    startConsumers()
    app.listen(port, () => {
        logger.info(`Server running at port ${port} 🚀`);
    });
});
