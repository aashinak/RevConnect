import IUserRelationship from "../../entities/IUserRelationship";

export interface IUserRelationshipRepository {
    followUser(userId: string, targetUserId: string): Promise<void>;
    unfollowUser(userId: string, targetUserId: string): Promise<void>;
    getFollowers(userId: string): Promise<IUserRelationship | null>;
    getFollowing(userId: string): Promise<IUserRelationship | null>;
    getCounts(userId: string): Promise<{ followersCount: number; followingCount: number }>;
  }
  