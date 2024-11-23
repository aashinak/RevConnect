import { Model } from "mongoose";
import IUserRelationship from "../entities/IUserRelationship";
import logger from "../utils/logger";
import { ApiError } from "../utils/ApiError";
import { IUserRelationshipRepository } from "./Interfaces/IUserRelationshipRepository";
import UserRelationshipModel from "../models/userRelationshipModel";

export class UserRelationshipRepository implements IUserRelationshipRepository {
  private userRelationshipModel: Model<IUserRelationship>;

  constructor() {
    this.userRelationshipModel = UserRelationshipModel;
  }

  async followUser(userId: string, targetUserId: string): Promise<void> {
    try {
      // Add the follower to the target user's list
      await this.userRelationshipModel.findOneAndUpdate(
        { userId: targetUserId },
        {
          $addToSet: {
            followers: { followerId: userId, followedAt: new Date() },
          },
          $inc: { followersCount: 1 },
        },
        { upsert: true, new: true }
      );

      // Add the target user to the following list of the user
      await this.userRelationshipModel.findOneAndUpdate(
        { userId },
        {
          $addToSet: {
            following: { followingId: targetUserId, followedAt: new Date() },
          },
          $inc: { followingCount: 1 },
        },
        { upsert: true, new: true }
      );
    } catch (error: any) {
      logger.error(`Failed to follow user ${targetUserId}: ${error.message}`);
      throw new ApiError(500, `Failed to follow user ${targetUserId}`);
    }
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<void> {
    try {
      // Remove the follower from the target user's list
      await this.userRelationshipModel.findOneAndUpdate(
        { userId: targetUserId },
        {
          $pull: { followers: { followerId: userId } },
          $inc: { followersCount: -1 },
        }
      );

      // Remove the target user from the following list of the user
      await this.userRelationshipModel.findOneAndUpdate(
        { userId },
        {
          $pull: { following: { followingId: targetUserId } },
          $inc: { followingCount: -1 },
        }
      );
    } catch (error: any) {
      logger.error(`Failed to unfollow user ${targetUserId}: ${error.message}`);
      throw new ApiError(500, `Failed to unfollow user ${targetUserId}`);
    }
  }

  async getFollowers(userId: string): Promise<IUserRelationship | null> {
    try {
      return await this.userRelationshipModel
        .findOne({ userId })
        .select("followers")
        .exec();
    } catch (error: any) {
      logger.error(
        `Failed to fetch followers for user ${userId}: ${error.message}`
      );
      throw new ApiError(500, `Failed to fetch followers for user ${userId}`);
    }
  }

  async getFollowing(userId: string): Promise<IUserRelationship | null> {
    try {
      return await this.userRelationshipModel
        .findOne({ userId })
        .select("following")
        .exec();
    } catch (error: any) {
      logger.error(
        `Failed to fetch following for user ${userId}: ${error.message}`
      );
      throw new ApiError(500, `Failed to fetch following for user ${userId}`);
    }
  }

  async getCounts(
    userId: string
  ): Promise<{ followersCount: number; followingCount: number }> {
    try {
      const userRelationship = await this.userRelationshipModel
        .findOne({ userId })
        .select("followersCount followingCount")
        .exec();
      if (!userRelationship) {
        throw new ApiError(
          404,
          `User relationship not found for user ${userId}`
        );
      }
      return {
        followersCount: userRelationship.followersCount,
        followingCount: userRelationship.followingCount,
      };
    } catch (error: any) {
      logger.error(
        `Failed to fetch counts for user ${userId}: ${error.message}`
      );
      throw new ApiError(500, `Failed to fetch counts for user ${userId}`);
    }
  }
}
