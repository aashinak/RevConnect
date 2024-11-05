import { Model, model, Schema } from "mongoose";
import IUser from "../entities/IUser";

// User Schema Definition
const userSchema: Schema<IUser> = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String }, // Optional for Google login
  googleId: { type: String }, // Optional for users who sign in with Google
  role: { type: String, default: "user", enum: ["user", "admin"] }, // Role management
  avatar: { type: String, default: "https://example.com/default-avatar.png" }, // Avatar with default value
  refreshToken: { type: String }, // Required field for refresh tokens
  isVerified: { type: Boolean, default: false }, // Email verification status
}, {
  timestamps: true, // Automatically creates 'createdAt' and 'updatedAt'
});

// Create User model
const User: Model<IUser> = model<IUser>("User", userSchema);
export default User
