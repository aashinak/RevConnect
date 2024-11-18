import { UserRepository } from "../repository/userRepository";
import { TokenService } from "../utils/tokenService";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger"; // Assuming a logger utility is configured

const userRepo = new UserRepository();
const tokenVerificationService = new TokenService();

async function logoutUser(refreshToken: string) {
    // Verify the provided refresh token
    let decodedToken;
    try {
        decodedToken =
            await tokenVerificationService.verifyRefreshToken(refreshToken);
    } catch (error: any) {
        logger.warn(`Invalid or expired refresh token ::: ${error.message}`);
        throw new ApiError(401, "Invalid or expired refresh token");
    }

    logger.info(`Token verified for user ID: ${decodedToken.id}`);

    // Remove the refresh token from the user's record
    const isTokenRemoved = await userRepo.removeRefreshToken(decodedToken.id);
    if (!isTokenRemoved) {
        logger.error(
            `Failed to remove refresh token for user ID: ${decodedToken.id}`
        );
        throw new ApiError(500, "Failed to remove refresh token");
    }

    logger.info(`User ID: ${decodedToken.id} logged out successfully`);
    return { message: "User logged out successfully" };
}

export default logoutUser;
