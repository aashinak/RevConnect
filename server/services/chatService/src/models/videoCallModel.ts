import mongoose, { Schema } from "mongoose";
import { IVideoCall } from "../entities/IVideoCall";

const VideoCallSchema: Schema = new Schema<IVideoCall>(
  {
    caller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: false }, // For individual call
    groupChat: { type: Schema.Types.ObjectId, ref: "Chat", default: null }, // For group call, null for individual
    type: { type: String, enum: ["video"], required: true }, // Call type (video)
    status: {
      type: String,
      enum: ["ringing", "accepted", "rejected", "missed"],
      required: true,
    },
    startTime: { type: Date, default: null },
    endTime: { type: Date, default: null },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create the VideoCall model
export const VideoCall = mongoose.model<IVideoCall>(
  "VideoCall",
  VideoCallSchema
);

export default VideoCall;
