import { Router, Request, Response } from "express";
import upload from "../utils/multer"; // Ensure this path is correct
import {
    forgotPasswordRequest,
    forgotPasswordVerification,
    login,
    loginWithGoogleId,
    logout,
    regenerateRefreshAndAccessTokens,
    register,
    resendOtp,
    verifyUserOtp,
} from "../controllers/authController";
import asyncHandler from "../utils/asyncHandler";
import { userValidationRules } from "../validators/userValidator";
import { userLoginValidationRules } from "../validators/userLoginValidator";
import { googleLoginValidationRules } from "../validators/loginWithGoogleValidator";
import { refreshTokenValidationRules } from "../validators/refreshTokenValidator";
import { otpEmailValidationRules } from "../validators/otpEmailValidator";
import { emailValidationRules } from "../validators/emailValidator";
import { otpEmailPasswordValidationRules } from "../validators/otpEmailPasswordValidator";
import { createRateLimiter } from "../middlewares/rateLimiter";

const router = Router();

// Route for user registration with avatar upload
router.post(
    "/register",
    createRateLimiter({ max: 5 }),
    upload.single("avatar"),
    userValidationRules(),
    asyncHandler(register)
);

router.post(
    "/login",
    createRateLimiter({ max: 8 }),
    userLoginValidationRules(),
    asyncHandler(login)
);

router.post(
    "/loginWithGoogle",
    createRateLimiter({ max: 8 }),
    googleLoginValidationRules(),
    asyncHandler(loginWithGoogleId)
);

router.post(
    "/logout",
    createRateLimiter({ max: 5 }),
    refreshTokenValidationRules(),
    asyncHandler(logout)
);

router.post(
    "/verifyOtp",
    createRateLimiter({ max: 5 }),

    otpEmailValidationRules(),
    asyncHandler(verifyUserOtp)
);
router.post(
    "/resendOtp",
    createRateLimiter({ max: 3 }),
    emailValidationRules(),
    asyncHandler(resendOtp)
);
router.post(
    "/forgotPasswordOtpReq",
    createRateLimiter({ max: 5 }),
    emailValidationRules(),
    asyncHandler(forgotPasswordRequest)
);
router.post(
    "/forgotPasswordVerification",
    createRateLimiter({ max: 5 }),
    otpEmailPasswordValidationRules(),
    asyncHandler(forgotPasswordVerification)
);
router.post(
    "/regenerateToken",
    createRateLimiter({ max: 20 }),
    refreshTokenValidationRules(),
    asyncHandler(regenerateRefreshAndAccessTokens)
);

// Simple ping route for health check
router.get("/ping", (req: Request, res: Response) => {
    res.status(200).json({ message: "pong!!!" });
});

export default router;
