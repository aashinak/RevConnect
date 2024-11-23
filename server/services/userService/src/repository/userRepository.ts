import { Model } from "mongoose";
import { UserModel } from "../models/userModel";
import IUser from "../entities/IUser";
import logger from "../utils/logger";
import { IUserRepository } from "./Interfaces/IUserRepository";
import { ApiError } from "../utils/ApiError";

export class UserRepository implements IUserRepository {
  private userModel: Model<IUser>;

  constructor() {
    this.userModel = UserModel;
  }

  async createUser(user: IUser): Promise<IUser> {
    try {
      const newUser = new this.userModel(user);
      return await newUser.save();
    } catch (error: any) {
      logger.error(`Failed to create user: ${error.message}`);
      throw new ApiError(500, `Failed to create user: ${error.message}`);
    }
  }

  async findUserById(userId: string): Promise<Partial<IUser> | IUser | null> {
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) return null;
      return user
    } catch (error: any) {
      logger.error(`Failed to find user by ID ${userId}: ${error.message}`);
      throw new ApiError(500, `Failed to find user by ID ${userId}`);
    }
  }

  async findUserByEmail(email: string): Promise<Partial<IUser> | IUser | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec();
      if (!user) return null;
      return user.toObject();  // Return the full user object by default
    } catch (error: any) {
      logger.error(`Failed to find user by email ${email}: ${error.message}`);
      throw new ApiError(500, `Failed to find user by email ${email}`);
    }
  }

  async updateUserById(
    userId: string,
    userUpdate: Partial<IUser>
  ): Promise<Partial<IUser> | IUser | null> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(userId, { $set: userUpdate }, { new: true })
        .exec();
      if (!updatedUser) {
        throw new ApiError(404, `User not found with ID ${userId}`);
      }
      return updatedUser
    } catch (error: any) {
      logger.error(`Failed to update user by ID ${userId}: ${error.message}`);
      throw new ApiError(500, `Failed to update user by ID ${userId}`);
    }
  }

  async updateUserByEmail(
    email: string,
    userUpdate: Partial<IUser>
  ): Promise<Partial<IUser> | IUser | null> {
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate({ email }, { $set: userUpdate }, { new: true })
        .exec();
      if (!updatedUser) {
        throw new ApiError(404, `User not found with email ${email}`);
      }
      return updatedUser
    } catch (error: any) {
      logger.error(`Failed to update user by email ${email}: ${error.message}`);
      throw new ApiError(500, `Failed to update user by email ${email}`);
    }
  }

  async deleteUserById(userId: string): Promise<Partial<IUser> | null> {
    try {
      const deletedUser = await this.userModel.findByIdAndDelete(userId).exec();
      if (!deletedUser) {
        throw new ApiError(404, `User not found with ID ${userId}`);
      }
      return deletedUser
    } catch (error: any) {
      logger.error(`Failed to delete user by ID ${userId}: ${error.message}`);
      throw new ApiError(500, `Failed to delete user by ID ${userId}`);
    }
  }

  async findOneAndUpdate(
    constraints: Partial<IUser>,
    userUpdate: Partial<IUser>
  ): Promise<Partial<IUser> | IUser | null> {
    try {
      const updatedUser = await this.userModel
        .findOneAndUpdate(constraints, { $set: userUpdate }, { new: true })
        .exec();
      if (!updatedUser) {
        throw new ApiError(404, `User not found with specified constraints`);
      }
      return updatedUser
    } catch (error: any) {
      logger.error(`Failed to update user: ${error.message}`);
      throw new ApiError(500, `Failed to update user`);
    }
  }
}
