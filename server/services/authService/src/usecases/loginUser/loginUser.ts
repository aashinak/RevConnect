import { UserRepository } from "../../repository/userRepository";
import { ApiError } from "../../utils/ApiError";
import { hashService } from "../../utils/hashService";
import { TokenService } from "../../utils/tokenService";

const userRepo = new UserRepository();
const hashPasswordService = new hashService();
const tokenGenerateService = new TokenService();

async function loginUser(email: string, password: string) {
    // Check if the user exists
    const existingUser = await userRepo.findUserByEmail(email);
    if (!existingUser) {
        throw new ApiError(404, "User doesn't exist");
    }

    // Check if the user is verified
    if (!existingUser.isVerified) {
        throw new ApiError(400, "User not verified");
    }

    // Ensure the user is using email/password login
    if (existingUser.provider !== "email") {
        throw new ApiError(400, "Please sign in with Google");
    }

    // Verify the password
    const isPasswordVerified = await hashPasswordService.comparePassword(
        password,
        existingUser.password as string
    );

    if (!isPasswordVerified) {
        throw new ApiError(400, "Invalid password");
    }

    // Create and store access and refresh tokens
    const refreshToken = await tokenGenerateService.generateRefreshToken(
        existingUser._id as string
    );
    const accessToken = await tokenGenerateService.generateAccessToken(
        existingUser._id as string
    );

    // Update user with the new refresh token
    const updatedUser = await userRepo.updateUser(existingUser._id as string, {
        refreshToken,
    });

    // Return user and tokens
    return {
        user: updatedUser,
        tokens: {
            accessToken,
            refreshToken,
        },
    };
}

export default loginUser;
