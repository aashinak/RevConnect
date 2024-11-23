import  { Schema, Document } from "mongoose";

interface IUserRelationship extends Document {
  userId: Schema.Types.ObjectId; // The user whose relationships are being tracked
  followers: { followerId: Schema.Types.ObjectId; followedAt: Date }[]; // List of followers
  following: { followingId: Schema.Types.ObjectId; followedAt: Date }[]; // List of users this user follows
  followersCount: number; // Total number of followers
  followingCount: number; // Total number of followings
}

export default IUserRelationship