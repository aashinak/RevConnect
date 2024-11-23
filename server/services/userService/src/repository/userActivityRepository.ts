import { Model } from "mongoose";
import { UserActivityModel } from "../models/userActivityModel";
import IUserActivity from "../entities/IUserActivity";
import logger from "../utils/logger";
import { ApiError } from "../utils/ApiError";
import { IUserActivityRepository } from "./Interfaces/IUserActivity";

export class UserActivityRepository implements IUserActivityRepository {
  private userActivityModel: Model<IUserActivity>;

  constructor() {
    this.userActivityModel = UserActivityModel;
  }

  async createActivity(
    userId: string,
    action: string,
    timestamp: Date
  ): Promise<IUserActivity> {
    try {
      const newActivity = new this.userActivityModel({
        userId,
        actions: [{ action, timestamp }],
      });
      return await newActivity.save();
    } catch (error: any) {
      logger.error(
        `Failed to create activity for userId ${userId}: ${error.message}`
      );
      throw new ApiError(
        500,
        `Failed to create activity for userId ${userId}: ${error.message}`
      );
    }
  }

  async getUserActivity(userId: string): Promise<IUserActivity | null> {
    try {
      const activity = await this.userActivityModel.findOne({ userId }).exec();
      if (!activity) return null;
      return activity;
    } catch (error: any) {
      logger.error(
        `Failed to get activity for userId ${userId}: ${error.message}`
      );
      throw new ApiError(500, `Failed to get activity for userId ${userId}`);
    }
  }

  async updateUserActivity(
    userId: string,
    action: string,
    timestamp: Date
  ): Promise<IUserActivity | null> {
    try {
      const activity = await this.userActivityModel.findOne({ userId }).exec();
      if (!activity) {
        throw new ApiError(404, `No activity found for userId ${userId}`);
      }
      activity.actions.push({ action, timestamp });
      return await activity.save();
    } catch (error: any) {
      logger.error(
        `Failed to update activity for userId ${userId}: ${error.message}`
      );
      throw new ApiError(500, `Failed to update activity for userId ${userId}`);
    }
  }

  async deleteUserActivity(userId: string): Promise<IUserActivity | null> {
    try {
      const deletedActivity = await this.userActivityModel
        .findOneAndDelete({ userId })
        .exec();
      if (!deletedActivity) {
        throw new ApiError(404, `No activity found for userId ${userId}`);
      }
      return deletedActivity;
    } catch (error: any) {
      logger.error(
        `Failed to delete activity for userId ${userId}: ${error.message}`
      );
      throw new ApiError(500, `Failed to delete activity for userId ${userId}`);
    }
  }
}



// const userActivityRepo = new UserActivityRepository();

// // Example to create a new user activity
// await userActivityRepo.createActivity(userId, "Logged In", new Date());

// // Example to get a user's activity
// const activity = await userActivityRepo.getUserActivity(userId);

// // Example to update a user's activity
// await userActivityRepo.updateUserActivity(userId, "Viewed Profile", new Date());

// // Example to delete a user's activity
// await userActivityRepo.deleteUserActivity(userId);
