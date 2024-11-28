import { Router, Request, Response } from "express";
// import { isAuthenticated } from "../middlewares/authMiddleware";
// import asyncHandler from "../utils/asyncHandler";


const router = Router();
// router.use(isAuthenticated);

// Simple ping route for health check
router.get("/ping", (req: Request, res: Response) => {
  res.status(200).json({ message: "pong!!! from chatService" });
});

// router.get("/getCurrentUser", asyncHandler(getUserProfile));
// router.patch("/updateUser", asyncHandler(updateUser));

// router.get("/followers", asyncHandler(getFollowersList));
// router.get("/following", asyncHandler(getFollowingList));
// router.patch("/follow/:targetUserId", asyncHandler(followUser));
// router.delete("/unfollow/:targetUserId", asyncHandler(unfollowUser));

export default router;
