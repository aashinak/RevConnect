import { Router, Request, Response } from "express";

const router = Router();


// Simple ping route for health check
router.get("/ping", (req: Request, res: Response) => {
    res.status(200).json({ message: "pong!!! from userService" });
});

export default router;