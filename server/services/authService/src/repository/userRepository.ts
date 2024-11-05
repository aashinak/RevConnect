import { Model } from "mongoose";
import { IUserRepository } from "./interface/IUserRepository";
import IUser from "../entities/IUser";
import User from "../models/userModel";
import logger from "../utils/logger"; // Import your logger
import { ApiError } from "../utils/ApiError";

export class UserRepository implements IUserRepository {
  private userModel: Model<IUser>;

  constructor() {
    this.userModel = User;
  }

  async saveUser(user: IUser): Promise<IUser | null> {
    try {
      const newUser = new this.userModel(user);
      return await newUser.save();
    } catch (error: any) {
      logger.error(`Failed to save user: ${error.message}`);
      throw new ApiError(500, `Failed to save user: ${error.message}`)
    }
  }

  async findUserById(userId: string): Promise<IUser | null> {
    try {
      return await this.userModel.findById(userId).exec();
    } catch (error: any) {
      logger.error(`Failed to find user by ID ${userId}: ${error.message}`);
      return null; // or throw an AppError if you implement it later
    }
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error: any) {
      logger.error(`Failed to find user by email ${email}: ${error.message}`);
      return null; // or throw an AppError if you implement it later
    }
  }

  async findUserByGoogleId(googleId: string): Promise<IUser | null> {
    try {
      return await this.userModel.findOne({ googleId }).exec();
    } catch (error: any) {
      logger.error(`Failed to find user by Google ID ${googleId}: ${error.message}`);
      return null; // or throw an AppError if you implement it later
    }
  }

  async updateUser(userId: string, userUpdate: Partial<IUser>): Promise<IUser | null> {
    try {
      return await this.userModel.findByIdAndUpdate(userId, userUpdate, {
        new: true, // return the updated user document
      }).exec();
    } catch (error: any) {
      logger.error(`Failed to update user with ID ${userId}: ${error.message}`);
      return null; // or throw an AppError if you implement it later
    }
  }
}
