import mongoose, { Schema } from "mongoose";
import { IMessage } from "../entities/IMessage";

const MessageSchema: Schema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    content: { type: String, default: null }, // The content field for text messages
    media: { type: String, default: null }, // The media field for media-based messages (images, audio, etc.)
    type: {
      type: String,
      enum: ["text", "image", "audio", "video"],
      default: "text",
    }, // Type of the message
    isRead: { type: Boolean, default: false }, // Whether the message is read or not
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create the Message model
export const Message = mongoose.model<IMessage>("Message", MessageSchema);

export default Message;
