import { Document, Types } from 'mongoose';

export default interface IUserPreference extends Document {
  userId: Types.ObjectId;
  preferences: { [key: string]: any };
  visibility: string;
}
