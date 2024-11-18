import "dotenv/config";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import logger from "./utils/logger";
import router from "./routes/authRoutes";
import errorHandler from "./middlewares/errorHandler";
import limiter from "./middlewares/rateLimiter";

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// log formating
const morganFormat: string = ":method :url :status :response-time ms";
app.use(
    morgan(morganFormat, {
        stream: {
            write: (message) => {
                const logObject = {
                    method: message.split(" ")[0],
                    url: message.split(" ")[1],
                    status: message.split(" ")[2],
                    responseTime: message.split(" ")[3],
                };
                logger.info(JSON.stringify(logObject));
            },
        },
    })
);

// Apply the rate limiter to all requests
app.use(limiter);

// router
app.use("/api/v1/auth", router);

// errorHandling middleware
app.use(errorHandler);

export default app;
