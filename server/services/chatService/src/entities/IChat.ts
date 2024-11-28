import { Document, Types } from "mongoose";

export interface IChat extends Document {
  isGroupChat: boolean; // Indicates whether the chat is a group chat or one-on-one
  participants: Types.ObjectId[]; // Array of user IDs participating in the chat
  groupName?: string | null; // Group name for group chats
  groupAvatar?: string | null; // Avatar for the group
  lastMessage?: Types.ObjectId | null; // Reference to the last message in the chat
  createdAt?: Date; // Timestamp of when the chat was created
  updatedAt?: Date; // Timestamp of when the chat was last updated
}
