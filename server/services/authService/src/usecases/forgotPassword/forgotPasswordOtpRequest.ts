import { OtpRepository } from "../../repository/otpRepository";
import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import sendMail from "../../utils/emailService";
import generateOtp from "../../utils/generateOtp";
import { OtpAuth } from "../../utils/hashOtp";
import logger from "../../utils/logger";
import emailFormat from "../../utils/otpEmailFormat";

const otpRepo = new OtpRepository();
const userRepo = new UserRepository();
const otpAuth = new OtpAuth();

async function forgotPasswordOtpRequest(email: string) {
    // Step 1: Check if the user exists
    const user = await userRepo.findUserByEmail(email);
    if (!user) {
        logger.warn(`Password reset attempt for non-existing user: ${email}`);
        throw new ApiError(404, "User not found");
    }
    if (!user.isVerified) {
        logger.warn(`Password reset attempt for non-verified user: ${email}`);
        throw new ApiError(400, "User not verified");
    }
    if (user.provider !== "email") {
        logger.warn(`Password reset attempt for google user: ${email}`);
        throw new ApiError(400, "Kindly select signin with google option");
    }

    // Step 2: Generate and hash the OTP
    const otp = generateOtp(); // Generate an OTP or a reset token
    const hashedOtp = await otpAuth.hashOtp(otp);

    // Step 3: Store OTP in the database
    const storedOtp = await otpRepo.saveOtp(email, hashedOtp, "password_reset"); // Associate OTP with email
    if (!storedOtp) {
        logger.error(`Failed to store OTP for email: ${email}`);
        throw new ApiError(500, "Failed to store OTP");
    }

    // Step 4: Prepare the email content
    const htmlEmailFormat = emailFormat(
        otp,
        user.name,
        "Password reset request"
    ); // Use forgot password email format
    const mail = {
        subject: "Password Reset Request",
        html: htmlEmailFormat,
        to: email,
    };

    // Step 5: Send the email with reset instructions
    const isEmailSent = await sendMail(mail);
    if (!isEmailSent) {
        logger.error(`Failed to send password reset email to: ${email}`);
        throw new ApiError(500, "Failed to send password reset email");
    }

    logger.info(`Password reset instructions sent successfully to: ${email}`);
    return { message: "Password reset instructions sent successfully" };
}

export default forgotPasswordOtpRequest;
