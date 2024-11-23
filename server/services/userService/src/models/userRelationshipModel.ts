import mongoose, { Schema, Document } from "mongoose";
import IUserRelationship from "../entities/IUserRelationship";

const UserRelationshipSchema: Schema<IUserRelationship> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    followers: [
      {
        followerId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        followedAt: { type: Date, default: Date.now },
      },
    ],
    following: [
      {
        followingId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        followedAt: { type: Date, default: Date.now },
      },
    ],
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const UserRelationshipModel = mongoose.model<IUserRelationship>(
  "UserRelationship",
  UserRelationshipSchema
);

export default UserRelationshipModel;
