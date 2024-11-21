import { OtpRepository } from "../../repository/otpRepository";
import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import { OtpAuth } from "../../utils/hashOtp";
import { hashService } from "../../utils/hashService";
import logger from "../../utils/logger";
import redisClient from "../../config/redis/redis-client";

const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const otpAuth = new OtpAuth();
const hashPassword = new hashService();

async function forgotPasswordVerifyOtp(
    otp: number,
    email: string,
    password: string
) {
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        logger.warn(`Password reset attempt for non-existing user: ${email}`);
        throw new ApiError(404, "User not found");
    }
    if (!user.isVerified) {
        logger.warn(`Password reset attempt for non-verified user: ${email}`);
        throw new ApiError(400, "User not verified");
    }

    // Retrieve OTP and reason (Redis first, then fallback to database)
    const otpData = await redisClient.hgetall(`otp:${user._id}`);
    const storedOtp =
        otpData?.otp || (await otpRepo.findOtpByEmail(email))?.otp;
    const reason =
        otpData?.reason || (await otpRepo.findOtpByEmail(email))?.otpReason;

    if (!storedOtp || !reason) {
        logger.warn(`OTP not found for email ${email}`);
        throw new ApiError(404, "OTP not found");
    }

    if (reason !== "password_reset") {
        logger.warn(`Invalid OTP reason for email: ${email}`);
        throw new ApiError(400, "Invalid OTP");
    }

    // Verify OTP
    const isOtpVerified = await otpAuth.compareOtp(otp, storedOtp);
    if (!isOtpVerified) {
        logger.warn(`Invalid OTP provided for email: ${email}`);
        throw new ApiError(400, "Invalid OTP");
    }

    // Clean up OTP from Redis or database
    await redisClient.del(`otp:${user._id}`);
    await otpRepo.deleteOtp(email);

    // Remove existing refreshToken
    await userRepo.removeRefreshToken(user._id as string);

    // Hash the new password and update it
    const hashedNewPassword = await hashPassword.hashPassword(password);
    await userRepo.updateUserByEmail(email, { password: hashedNewPassword });

    logger.info(`Password updated successfully for email: ${email}`);
    return { message: "OTP verification and password recovery successful" };
}

export default forgotPasswordVerifyOtp;
