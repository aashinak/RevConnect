import mongoose, { Schema } from "mongoose";
import { IAudioChannel } from "../entities/IAudioChannel";

const AudioChannelSchema: Schema = new Schema<IAudioChannel>(
  {
    groupChat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isActive: { type: Boolean, default: true }, // Default active status is true
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create the AudioChannel model
export const AudioChannel = mongoose.model<IAudioChannel>(
  "AudioChannel",
  AudioChannelSchema
);

export default AudioChannel;
