import mongoose, { Schema } from "mongoose";
import IUser from "../entities/IUser";

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    avatar: { type: String },
    bio: { type: String },
    gender: { type: String, enum: ["Male", "Female"] },
  },
  { timestamps: true }
);

UserSchema.methods.getPublicProfile = function () {
  const { userId, name, avatar, bio } = this;
  return { userId, name, avatar, bio };
};

export const UserModel = mongoose.model<IUser>("User", UserSchema);
