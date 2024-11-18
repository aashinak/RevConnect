import Redis from "ioredis";
import logger from "./logger";

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost", // Your Redis server's host, default is localhost
    port: parseInt(process.env.REDIS_PORT || "6379"), // Default Redis port is 6379
    password: process.env.REDIS_PASSWORD || "", // Optional: Password if Redis requires one
    db: 0, // Default Redis DB
    retryStrategy: (times: number) => {
        // Optional: Retry strategy in case of connection failure
        const delay = Math.min(times * 50, 2000); // Exponential backoff (max 2 seconds)
        return delay;
    },
});

redisClient.on("connect", () => {
    logger.info("Connected to Redis");
});

redisClient.on("error", (err) => {
    logger.error("Redis error:", err);
});

redisClient.on("close", () => {
    logger.info("Redis connection closed");
});

export default redisClient;