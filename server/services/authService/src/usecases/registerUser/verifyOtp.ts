import { UserRepository } from "../../repository/userRepository";
import { OtpRepository } from "../../repository/otpRepository";
import { ApiError } from "../../utils/ApiError";
import { OtpAuth } from "../../utils/hashOtp";
import logger from "../../utils/logger";
import redisClient from "../../utils/redis-client";

const userRepo = new UserRepository();
const otpRepo = new OtpRepository();
const otpAuth = new OtpAuth();

async function verifyOtp(otp: number, email: string) {
    // Retrieve user
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        logger.warn(`Email verification attempt for non-existing user: ${email}`);
        throw new ApiError(404, "User not found");
    }

    // Retrieve OTP and reason (Redis first, then fallback to database)
    const otpData = await redisClient.hgetall(`otp:${user._id}`);
    const storedOtp = otpData?.otp || (await otpRepo.findOtpByEmail(email))?.otp;
    const reason =
        otpData?.reason || (await otpRepo.findOtpByEmail(email))?.otpReason;

    if (!storedOtp || !reason) {
        logger.warn(`OTP not found for email: ${email}`);
        throw new ApiError(404, "OTP not found");
    }

    if (reason !== "email_verification") {
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

    // Update user's verification status
    const updatedUser = await userRepo.updateUserByEmail(email, {
        isVerified: true,
    });
    if (!updatedUser) {
        logger.error(`Failed to update verification status for user: ${email}`);
        throw new ApiError(500, "User verification update failed");
    }

    logger.info(`User verification successful for email: ${email}`);
    return { message: "OTP verification successful", user: updatedUser };
}

export default verifyOtp;
