import { Document, Types } from "mongoose";

export interface IVideoCall extends Document {
  caller: Types.ObjectId; // Reference to the User who initiated the call
  receiver: Types.ObjectId; // Reference to the User who receives the call (individual call)
  groupChat: Types.ObjectId | null; // Reference to the Chat (group chat) if it's a group video call
  type: "video"; // Type of call (video)
  status: "ringing" | "accepted" | "rejected" | "missed"; // Call status
  startTime?: Date; // Timestamp when the call started
  endTime?: Date; // Timestamp when the call ended
}
