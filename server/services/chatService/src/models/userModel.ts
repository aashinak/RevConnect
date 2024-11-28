import mongoose, { Schema, Document } from "mongoose";
import IUser from "../entities/IUser";

// Mongoose Schema for User
const UserSchema: Schema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },
    contacts: [
      {
        contactId: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Create the User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
