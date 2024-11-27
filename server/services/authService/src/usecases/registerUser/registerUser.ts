import IUser from "../../entities/IUser";
import { OtpRepository } from "../../repository/otpRepository";
import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import cleanUpAvatar from "../../utils/cleanUpAvatar";
import uploadToCloudinary from "../../utils/cloudinary";
import emailFormat from "../../utils/otpEmailFormat";
import sendMail from "../../utils/emailService";
import generateOtp from "../../utils/generateOtp";
import { OtpAuth } from "../../utils/hashOtp";
import { hashService } from "../../utils/hashService";
import logger from "../../utils/logger";
import fs from "fs/promises";
import redisClient from "../../config/redis/redis-client";
import userProducer from "../../events/kafka/producers/userProducer";

const userRepo = new UserRepository();
const hashPassword = new hashService();
const hashOtp = new OtpAuth();
const otpRepo = new OtpRepository();

async function registerUser(
    name: string,
    email: string,
    password: string,
    avatarLocalPath?: string
) {
    const key = `user:registration:log:${email}`;
    const initUser = await redisClient.get(key);
    if (initUser) {
        await cleanUpAvatar(avatarLocalPath as string);
        logger.info(`Log exists for user ${email}`);
        throw new ApiError(400, "Frequent call on registration");
    }
    const value = "User registration initiated";
    const expiration = 20;
    redisClient.set(key, value, "EX", expiration);
    // Check if user already exists
    const existingUser = await userRepo.findUserByEmail(email);
    if (existingUser) {
        if (avatarLocalPath) {
            await cleanUpAvatar(avatarLocalPath);
        }
        logger.warn(`User with email ${email} already exists`);
        throw new ApiError(400, `User with email ${email} already exists`);
    }

    // Upload avatar to Cloudinary
    let uploadedAvatar;
    if (avatarLocalPath) {
        try {
            uploadedAvatar = await uploadToCloudinary(
                avatarLocalPath,
                "userAvatar"
            );
        } catch (error: any) {
            await cleanUpAvatar(avatarLocalPath);
            logger.error(
                `Failed to upload avatar for ${email}: ${error.message}`
            );
            throw new ApiError(500, "Failed to upload avatar");
        }
    }

    // Hash password
    const hashedPassword = await hashPassword.hashPassword(password);

    // Generate and hash OTP
    const otp = generateOtp();
    const hashedOtp = await hashOtp.hashOtp(otp);

    // Prepare email content
    const htmlEmailFormat = emailFormat(otp, name, "User verification");
    const mail = {
        subject: "OTP Verification",
        html: htmlEmailFormat,
        to: email,
    };

    // Save OTP to database
    await otpRepo.saveOtp(email, hashedOtp, "email_verification");

    // Send verification email
    const isEmailSent = await sendMail(mail);
    if (!isEmailSent) {
        if (avatarLocalPath) {
            await cleanUpAvatar(avatarLocalPath);
        }
        logger.error(`Failed to send email to ${email}`);
        throw new ApiError(500, "Failed to send verification email");
    }

    // Create and save new user
    const newUser: IUser = {
        name,
        email,
        provider: "email",
        password: hashedPassword,
        role: "user",
        avatar: uploadedAvatar?.url,
    };

    const savedUser = await userRepo.saveUser(newUser);
    if (uploadedAvatar && avatarLocalPath) await cleanUpAvatar(avatarLocalPath);

    const producerData = {
        userId: savedUser._id as string,
        name: savedUser.name,
        email: savedUser.email,
        avatar: savedUser.avatar as string,
    };
    await userProducer(producerData);

    const otpData = {
        otp: hashedOtp,
        reason: "email_verification",
    };

    // Store OTP and reason in Redis hash
    await redisClient.hset(`otp:${savedUser._id}`, otpData);
    await redisClient.expire(`otp:${savedUser._id}`, 300); // Expire in 5 minutes

    return savedUser;
}

export default registerUser;
