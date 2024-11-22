import mongoose, { Schema } from "mongoose";
import  IUserActivity  from "../entities/IUserActivity";

const UserActivitySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastLogin: { type: Date },
    actions: [
      {
        action: { type: String, required: true },
        timestamp: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const UserActivityModel = mongoose.model<IUserActivity>(
  "UserActivity",
  UserActivitySchema
);
