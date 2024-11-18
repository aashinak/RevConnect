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

const router = Router();

// Route for user registration with avatar upload
router.post(
    "/register",
    upload.single("avatar"),
    userValidationRules(),
    asyncHandler(register)
);

router.post("/login", userLoginValidationRules(), asyncHandler(login));

router.post(
    "/loginWithGoogle",
    googleLoginValidationRules(),
    asyncHandler(loginWithGoogleId)
);

router.post("/logout", refreshTokenValidationRules(), asyncHandler(logout));

router.post(
    "/verifyOtp",
    otpEmailValidationRules(),
    asyncHandler(verifyUserOtp)
);
router.post("/resendOtp", emailValidationRules(), asyncHandler(resendOtp));
router.post(
    "/forgotPasswordOtpReq",
    emailValidationRules(),
    asyncHandler(forgotPasswordRequest)
);
router.post(
    "/forgotPasswordVerification",
    otpEmailPasswordValidationRules(),
    asyncHandler(forgotPasswordVerification)
);
router.post(
    "/regenerateToken",
    refreshTokenValidationRules(),
    asyncHandler(regenerateRefreshAndAccessTokens)
);

// Simple ping route for health check
router.get("/ping", (req: Request, res: Response) => {
    res.status(200).json({ message: "pong!!!" });
});

export default router;
