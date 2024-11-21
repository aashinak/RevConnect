import { OtpRepository } from "../../repository/otpRepository";
import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import sendMail from "../../utils/emailService";
import generateOtp from "../../utils/generateOtp";
import { OtpAuth } from "../../utils/hashOtp";
import emailFormat from "../../utils/otpEmailFormat";
import logger from "../../utils/logger";
import redisClient from "../../config/redis/redis-client";

const otpRepo = new OtpRepository();
const userRepo = new UserRepository();
const otpAuth = new OtpAuth();

async function ResendOtp(email: string) {
    // Validate the user's existence
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if user is already verified
    if (user.isVerified) {
        throw new ApiError(400, "User already verified");
    }

    if (user.provider !== "email") {
        throw new ApiError(400, "Kindly login with google");
    }

    // Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = await otpAuth.hashOtp(otp);

    // Store OTP in the database
    const storedOtp = await otpRepo.saveOtp(
        email,
        hashedOtp,
        "email_verification"
    );
    if (!storedOtp) {
        logger.error(`Failed to store OTP for email: ${email}`);
        throw new ApiError(500, "Failed to store OTP");
    }

    // Prepare email content
    const htmlEmailFormat = emailFormat(
        otp,
        user.name as string,
        "User verification"
    );
    const mail = {
        subject: "OTP Verification",
        html: htmlEmailFormat,
        to: email,
    };

    // Send verification email
    const isEmailSent = await sendMail(mail);
    if (!isEmailSent) {
        logger.error(`Failed to send OTP email to ${email}`);
        throw new ApiError(500, "Failed to send OTP email");
    }

    await redisClient.del(`otp:${user._id}`);
    // Store OTP and reason in Redis hash
    const otpData = {
        otp: hashedOtp,
        reason: "email_verification",
    };

    await redisClient.hset(`otp:${user._id}`, otpData);
    await redisClient.expire(`otp:${user._id}`, 300); // Expire in 5 minutes

    return { message: "OTP resent successfully" }; // Return success message
}

export default ResendOtp;
