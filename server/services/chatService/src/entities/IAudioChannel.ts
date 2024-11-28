import { Document, Types } from "mongoose";

export interface IAudioChannel extends Document {
  groupChat: Types.ObjectId; // Reference to the Chat (group chat)
  participants: Types.ObjectId[]; // Array of participants (users) in the audio channel
  isActive: boolean; // Indicates if the audio channel is active
  createdAt?: Date; // Timestamp when the audio channel was created
}
