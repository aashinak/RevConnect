import { Model, model, Schema } from "mongoose";
import IUser from "../entities/IUser";

// User Schema Definition
const userSchema: Schema<IUser> = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        username: { type: String, required: true, trim: true, unique: true },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: { type: String }, // Optional for Google login
        googleId: { type: String }, // Optional for users who sign in with Google
        role: { type: String, default: "user", enum: ["user", "admin"] }, // Role management
        provider: { type: String, required: true, enum: ["google", "email"] }, // Role management
        avatar: {
            type: String,
            default:
                "https://res.cloudinary.com/debbyomhm/image/upload/v1732688985/userAvatar/ucg4wqxtulvj6yamehhs.png",
        }, // Avatar with default value
        refreshToken: { type: String }, // Required field for refresh tokens
        isVerified: { type: Boolean, default: false }, // Email verification status
        isBlocked: { type: Boolean, default: false },
    },
    {
        timestamps: true, // Automatically creates 'createdAt' and 'updatedAt'
    }
);

// Create User model
const User: Model<IUser> = model<IUser>("User", userSchema);
export default User;
