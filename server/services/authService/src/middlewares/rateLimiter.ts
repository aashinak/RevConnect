import rateLimit from "express-rate-limit";
import logger from "../utils/logger";

// Create a rate limiter
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 1 minutes
    max: 5, // Limit each IP to 8 requests per windowMs
    handler: (req, res) => {
        logger.warn(`Too many requests detected from IP ::: ${req.ip}`);
        res.status(429).json({
            status: "error",
            message: "Too many requests, please try again later.",
            // limit: 2, // Optional: provide the limit
        });
    },
});

export default limiter;
