import { Document, Types } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId; // Reference to the User who sent the message
  chat: Types.ObjectId; // Reference to the Chat where the message was sent
  content: string | null; // Content of the message (could be text, could be null for media messages)
  media: string | null; // URL of uploaded media (can be null for text messages)
  type: "text" | "image" | "audio" | "video"; // Type of message (text, image, audio, or video)
  isRead: boolean; // Indicates whether the message has been read
  createdAt?: Date; // Timestamp when the message was created
}