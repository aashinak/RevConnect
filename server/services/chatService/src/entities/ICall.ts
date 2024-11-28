import { Document, Types } from "mongoose";

export interface ICall extends Document {
    caller: Types.ObjectId; // Reference to the User who is calling
    receiver: Types.ObjectId; // Reference to the User being called
    type: "audio" | "video"; // Type of call (audio or video)
    status: "ringing" | "accepted" | "rejected" | "missed"; // Status of the call
    startTime?: Date; // Timestamp for when the call started
    endTime?: Date; // Timestamp for when the call ended
    groupChat?: Types.ObjectId | null; // Reference to the Chat (if this is a group call)
    createdAt?: Date; // Timestamp when the call record was created
  }