import mongoose, { Schema } from "mongoose";
import { IChat } from "../entities/IChat";

const ChatSchema: Schema = new Schema<IChat>(
  {
    isGroupChat: { type: Boolean, default: false },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupName: { type: String, default: null },
    groupAvatar: { type: String, default: null },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);

// Create the Chat model
export const Chat = mongoose.model<IChat>("Chat", ChatSchema);

export default Chat;
