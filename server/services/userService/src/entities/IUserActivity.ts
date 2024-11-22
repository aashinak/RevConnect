import { Document } from 'mongoose';

export default interface IUserActivity extends Document {
  userId: string;
  lastLogin?: Date;
  actions: { action: string; timestamp: Date }[];
}
