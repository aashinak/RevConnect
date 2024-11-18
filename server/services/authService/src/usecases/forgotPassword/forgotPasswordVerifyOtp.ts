import { OtpRepository } from "../../repository/otpRepository";
import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import { OtpAuth } from "../../utils/hashOtp";
import { hashService } from "../../utils/hashService";
import logger from "../../utils/logger";

const otpRepo = new OtpRepository();
const userRepo = new UserRepository();
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

    // Retrieve stored OTP document by email
    const storeOtpDoc = await otpRepo.findOtpByEmail(email);
    if (!storeOtpDoc) {
        throw new ApiError(404, `OTP not found for email ${email}`);
    }

    // Check OTP reason
    if (storeOtpDoc.otpReason !== "password_reset") {
        logger.warn(`OTP for email ${email} is not valid for password reset`);
        throw new ApiError(400, "Invalid OTP");
    }

    // Compare the provided OTP with the hashed OTP in the database
    const isOtpVerified = await otpAuth.compareOtp(otp, storeOtpDoc.otp);
    if (!isOtpVerified) {
        throw new ApiError(400, "Invalid OTP");
    }

    // OTP verified successfully; delete it from database
    await otpRepo.deleteOtp(email);

    // remove existing refreshToken
    await userRepo.removeRefreshToken(user._id as string)
    
    // Hash the new password and update it
    const hashedNewPassword = await hashPassword.hashPassword(password);
    await userRepo.updateUserByEmail(email, { password: hashedNewPassword });


    // Log success and return a response
    logger.info(`OTP verified and password updated for email: ${email}`);
    return { message: "OTP verification and password recovery successful" };
}

export default forgotPasswordVerifyOtp;
