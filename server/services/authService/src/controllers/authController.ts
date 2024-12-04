// authController.ts

import { NextFunction, Request, Response } from "express";
import registerUser from "../usecases/registerUser/registerUser";
import { ApiError } from "../utils/ApiError";
import { ValidationError, validationResult } from "express-validator";
import cleanUpAvatar from "../utils/cleanUpAvatar";
import logger from "../utils/logger";
import loginUser from "../usecases/loginUser/loginUser";
import logoutUser from "../usecases/logoutUser";
import verifyOtp from "../usecases/registerUser/verifyOtp";
import ResendOtp from "../usecases/registerUser/resendOtp";
import forgotPasswordOtpRequest from "../usecases/forgotPassword/forgotPasswordOtpRequest";
import forgotPasswordVerifyOtp from "../usecases/forgotPassword/forgotPasswordVerifyOtp";
import regenerateRefreshToken from "../usecases/regenRefreshToken/regenRefreshToken";
import loginWithGoogle from "../usecases/loginUser/loginWithGoogle";
import validationErrorHandler from "../utils/validationErrorHandler";

const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    const avatar = req.file?.path;
    if (!errors.isEmpty()) {
        logger.warn(
            `Validation error ::: ${errors.array().map((error) => error.msg)}`
        );
        if (avatar) {
            cleanUpAvatar(avatar as string);
        }

        throw new ApiError(
            400,
            "Validation Error",
            errors.array().map((error) => error.msg)
        );
    }

    const { name, email, password, username } = req.body;

    // if (!avatar) {
    //     throw new ApiError(400, "Avatar file is required");
    // }
    const user = await registerUser(
        name,
        username,
        email,
        password,
        avatar
    );
    if (!user) {
        logger.error(`User registration for email ${email}`);
        throw new ApiError(500, "User registration failed");
    }

    res.status(201).json({
        message: "User created successfully",
        success: true,
    });
};

const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const { email, password } = req.body;
    const { user, tokens } = await loginUser(email, password);
    const sanitizedUser = {
        _id: user?._id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
    };
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
        message: "Log in successfull",
        user: sanitizedUser,
        accessToken: tokens.accessToken,
        success: true,
    });
};

const loginWithGoogleId = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const { tokenId } = req.body;
    const { updatedUser, refreshToken, accessToken } =
        await loginWithGoogle(tokenId);
    const sanitizedUser = {
        _id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        avatar: updatedUser?.avatar,
    };

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
        message: "Log in successfull",
        user: sanitizedUser,
        accessToken,
        success: true,
    });
};

const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const { refreshToken } = req.cookies;
    const returnMessage = await logoutUser(refreshToken);
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
    });
    res.status(200).json({ message: returnMessage.message, success: true });
};

const verifyUserOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const { otp, email } = req.body;
    await verifyOtp(otp, email);
    res.status(200).json({ message: "Otp verified", success: true });
};

const resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const { email } = req.body;
    const response = await ResendOtp(email);
    res.status(200).json({ message: response.message, success: true });
};

const forgotPasswordRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const { email } = req.body;
    const response = await forgotPasswordOtpRequest(email);
    res.status(200).json({ message: response.message, success: true });
};

const forgotPasswordVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const { otp, email, password } = req.body;
    const response = await forgotPasswordVerifyOtp(otp, email, password);
    res.status(200).json({ message: response.message, success: true });
};

const regenerateRefreshAndAccessTokens = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        validationErrorHandler(errors.array());
    }

    const refreshToken = req.cookies.refreshToken;

    const tokens = await regenerateRefreshToken(refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
        accessToken: tokens.accessToken,
        success: true,
    });
};

export {
    register,
    login,
    logout,
    verifyUserOtp,
    resendOtp,
    forgotPasswordRequest,
    forgotPasswordVerification,
    regenerateRefreshAndAccessTokens,
    loginWithGoogleId,
};
