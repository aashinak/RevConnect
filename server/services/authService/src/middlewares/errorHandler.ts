import { Request, Response, NextFunction } from 'express';

// Assuming `err` has the same structure as the ApiError class
interface ApiError extends Error {
    statusCode?: number;
    errors?: string[]; // Add this if you want to include validation errors
}

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is set
    const message = err.message || "Internal Server Error";

    

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
        ...(err.errors && { errors: err.errors }), // Include errors if present
    });
};

export default errorHandler;
