import { NextFunction, Request, Response, RequestHandler } from "express";

const asyncHandler = (requestHandler: RequestHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch(next);
    };
};

export default asyncHandler;