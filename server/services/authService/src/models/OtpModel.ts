import { Model, model, Schema } from "mongoose";
import { IOtp } from "../entities/IOtp";
const otpSchema: Schema<IOtp> = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },

    otp: { type: String, required: true }, // Store hashed OTP

    otpReason: {
        type: String,
        required: true,
        enum: ["password_reset", "email_verification"],
    },
    otpCreatedAt: {
        type: Date,
        default: Date.now,
        expires: 300, // OTP will expire after 5 minutes (300 seconds)
    },
});

export const Otp: Model<IOtp> = model<IOtp>("Otp", otpSchema);
