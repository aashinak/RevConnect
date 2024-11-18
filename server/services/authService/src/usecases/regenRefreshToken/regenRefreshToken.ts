import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import logger from "../../utils/logger";
import { TokenService } from "../../utils/tokenService";

const userRepo = new UserRepository();
const tokenGenerateService = new TokenService();

async function regenerateRefreshToken(
    oldRefreshToken: string
): Promise<{ refreshToken: string; accessToken: string }> {
    const payload =
        await tokenGenerateService.verifyRefreshToken(oldRefreshToken);

    // Extract user ID from the payload
    const userId = payload.id;
    if (!userId) {
        throw new ApiError(400, "Invalid refresh token");
    }

    // Fetch the user from the database
    const user = await userRepo.findUserById(userId);
    if (!user) {
        logger.warn(
            `Refresh token regeneration attempt for non-existing user: ${userId}`
        );
        throw new ApiError(404, "User not found");
    }

    // Ensure the old refresh token matches the stored token
    if (user.refreshToken !== oldRefreshToken) {
        logger.warn(`Mismatched refresh token for user: ${userId}`);
        throw new ApiError(403, "Invalid refresh token");
    }

    const newRefreshToken = await tokenGenerateService.generateRefreshToken(
        user._id as string
    );
    const newAccessToken = await tokenGenerateService.generateAccessToken(
        user._id as string
    );

    // Update the user's refresh token in the database
    await userRepo.findOneandUpdate(
        { _id: user._id, refreshToken: oldRefreshToken },
        { refreshToken: newRefreshToken }
    );

    // Return the new refresh token
    logger.info(`Refresh token regenerated for user: ${userId}`);
    return { refreshToken: newRefreshToken, accessToken: newAccessToken };
}

export default regenerateRefreshToken;
