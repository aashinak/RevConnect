import IUser from "../../entities/IUser";
import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import auth from "../../utils/fireBaseProvider";
import logger from "../../utils/logger";
import { TokenService } from "../../utils/tokenService";

const userRepo = new UserRepository();
const tokenGenerateService = new TokenService();

async function loginWithGoogle(idToken: string) {
    // Decode the Google ID token to get user details
    let decodedInfo;
    try {
        // Verify the ID token
        decodedInfo = await auth.verifyIdToken(idToken);
    } catch (error: any) {
        if (
            error.code === "auth/invalid-id-token" ||
            error.message.includes("does not correspond to a known public key")
        ) {
            logger.warn(`Invalid or expired ID token: ${error.message}`);
            // You can return or throw a specific error, prompting the client to refresh the token
            throw new ApiError(
                400,
                "The token is invalid or expired, please refresh the token."
            );
        }
        // Catch any other errors that may occur
        logger.error(`Error verifying token: ${error.message}`);
        throw new Error("Failed to verify ID token.");
    }

    // Check if the user already exists in the database
    const existingUser = await userRepo.findUserByEmail(
        decodedInfo.email as string
    );

    if (existingUser) {
        // Case 1: User already exists and registered with Google
        if (existingUser.provider === "google") {
            // Generate and store access and refresh tokens
            const refreshToken =
                await tokenGenerateService.generateRefreshToken(
                    existingUser._id as string
                );
            const accessToken = await tokenGenerateService.generateAccessToken(
                existingUser._id as string
            );

            // Update the user's refresh token in the database
            const updatedUser = await userRepo.updateUser(
                existingUser._id as string,
                { refreshToken }
            );

            // Return updated user with tokens
            return { updatedUser, refreshToken, accessToken };
        }

        // Case 2: User exists but is registered with a different provider (e.g., email/password)
        logger.warn(`Login attempt for email user: ${decodedInfo.email}`);
        throw new ApiError(400, "Use your email and password to log in");
    } else {
        // Case 3: User does not exist in the system. Offer to create a new account
        logger.info(
            `Creating new user with Google login: ${decodedInfo.email}`
        );

        const newUser: IUser = {
            username: decodedInfo.email.split('@')[0],
            email: decodedInfo.email,
            name: decodedInfo.name || decodedInfo.email, // Default name is email if not provided
            avatar: decodedInfo.picture || "", // Default avatar if not provided
            provider: "google", // Mark user as registered with Google
            role: "user", // Default role
            isVerified: true,
        };

        // Save the new user in the database
        const savedUser = await userRepo.saveUser(newUser);

        // Generate and store access and refresh tokens
        const refreshToken = await tokenGenerateService.generateRefreshToken(
            savedUser?._id as string
        );
        const accessToken = await tokenGenerateService.generateAccessToken(
            savedUser?._id as string
        );

        // Return the newly created user with tokens
        return { updatedUser:savedUser, refreshToken, accessToken };
    }
}

export default loginWithGoogle;
