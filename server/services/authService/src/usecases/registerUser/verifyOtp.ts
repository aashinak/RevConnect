import { OtpRepository } from "../../repository/otpRepository";
import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import { OtpAuth } from "../../utils/hashOtp";
import logger from "../../utils/logger";

const otpRepo = new OtpRepository();
const userRepo = new UserRepository();
const otpAuth = new OtpAuth();

async function verifyOtp(otp: number, email: string) {
    // Retrieve stored OTP document by email
    const storeOtpDoc = await otpRepo.findOtpByEmail(email);
    if (!storeOtpDoc) {
        throw new ApiError(404, `OTP not found for email ${email}`);
    }
    if (storeOtpDoc.otpReason !== "email_verification") {
        logger.warn(
            `OTP for email ${email} is not valid for email verification`
        );
        throw new ApiError(400, "Invalid OTP for email verification");
    }
    // Compare the provided OTP with the hashed OTP in the database
    const isOtpVerified = await otpAuth.compareOtp(otp, storeOtpDoc.otp);
    if (!isOtpVerified) {
        throw new ApiError(400, "Invalid OTP");
    }

    // OTP verified successfully; delete it from database
    await otpRepo.deleteOtp(email);

    // Update user's verification status
    const updatedUser = await userRepo.updateUserByEmail(email, {
        isVerified: true,
    });
    if (!updatedUser) {
        throw new ApiError(500, "User verification update failed");
    }

    // Log success and return the updated user document
    logger.info(`OTP verified and user ${email} updated successfully`);
    return updatedUser;
}

export default verifyOtp;
