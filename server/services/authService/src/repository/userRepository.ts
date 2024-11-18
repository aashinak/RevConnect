import { Document, Model } from "mongoose";
import { IUserRepository } from "./interface/IUserRepository";
import IUser from "../entities/IUser";
import User from "../models/userModel";
import logger from "../utils/logger";
import { ApiError } from "../utils/ApiError";

export class UserRepository implements IUserRepository {
    private userModel: Model<IUser>;

    constructor() {
        this.userModel = User;
    }

    async saveUser(user: IUser): Promise<IUser> {
        try {
            const newUser = new this.userModel(user);
            return await newUser.save();
        } catch (error: any) {
            logger.error(`Failed to save user: ${error.message}`);
            throw new ApiError(500, `Failed to save user: ${error.message}`);
        }
    }

    async findUserById(userId: string): Promise<IUser | null> {
        try {
            const user = await this.userModel.findById(userId).exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (error: any) {
            logger.error(
                `Failed to find user by ID ${userId}: ${error.message}`
            );
            throw new ApiError(500, `Failed to find user by ID ${userId}`);
        }
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        try {
            const user = await this.userModel.findOne({ email }).exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (error: any) {
            logger.error(
                `Failed to find user by email ${email}: ${error.message}`
            );
            throw new ApiError(500, `Failed to find user by email ${email}`);
        }
    }

    async findUserByGoogleId(googleId: string): Promise<IUser | null> {
        try {
            const user = await this.userModel.findOne({ googleId }).exec();
            if (!user) {
                return null;
            }
            return user;
        } catch (error: any) {
            logger.error(
                `Failed to find user by Google ID ${googleId}: ${error.message}`
            );
            throw new ApiError(
                500,
                `Failed to find user by Google ID ${googleId}`
            );
        }
    }

    async updateUser(
        userId: string,
        userUpdate: Partial<IUser>
    ): Promise<IUser> {
        try {
            const updatedUser = await this.userModel
                .findByIdAndUpdate(userId, userUpdate, { new: true })
                .exec();
            if (!updatedUser) {
                throw new ApiError(404, `User not found with ID ${userId}`);
            }
            return updatedUser;
        } catch (error: any) {
            logger.error(
                `Failed to update user with ID ${userId}: ${error.message}`
            );
            throw new ApiError(500, `Failed to update user with ID ${userId}`);
        }
    }

    async updateUserByEmail(
        email: string,
        userUpdate: Partial<IUser>
    ): Promise<IUser> {
        try {
            const updatedUser = await this.userModel
                .findOneAndUpdate(
                    { email },
                    { $set: userUpdate },
                    { new: true }
                )
                .exec();
            if (!updatedUser) {
                throw new ApiError(404, `User not found with email ${email}`);
            }
            return updatedUser;
        } catch (error: any) {
            logger.error(
                `Failed to update user with email ${email}: ${error.message}`
            );
            throw new ApiError(
                500,
                `Failed to update user with email ${email}`
            );
        }
    }

    async removeRefreshToken(userId: string): Promise<IUser> {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $unset: { refreshToken: 1 } },
                { new: true }
            ).exec();
            if (!updatedUser) {
                throw new ApiError(404, `User not found with ID ${userId}`);
            }
            logger.info(`Refresh token removed for user with ID ${userId}`);
            return updatedUser;
        } catch (error: any) {
            logger.error(
                `Failed to remove refreshToken for user with ID ${userId}: ${error.message}`
            );
            throw new ApiError(500, "Failed to remove refresh token");
        }
    }

    async findOneandUpdate(
        constraints: Partial<IUser>,
        userUpdate: Partial<IUser>
    ): Promise<IUser> {
        try {
            const updatedUser = await User.findOneAndUpdate(
                constraints,
                { $set: userUpdate },
                { new: true }
            ).exec();
            if (!updatedUser) {
                throw new ApiError(
                    404,
                    "User not found with the specified constraints"
                );
            }
            return updatedUser;
        } catch (error: any) {
            logger.error(`Failed to update user: ${error.message}`);
            throw new ApiError(500, "Failed to update user");
        }
    }
}
