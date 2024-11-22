import mongoose, { Schema } from "mongoose";
import IUserPreference from "../entities/IUserPreference";

const UserPreferenceSchema: Schema<IUserPreference> = new Schema<IUserPreference>({
  userId: { type: Schema.Types.ObjectId, required: true },
  preferences: { type: Object, default: {} },
  visibility: {
    type: String,
    required: true,
    enum: ["public", "private"],
    default: "public",
  },
});

const UserPreferenceModel = mongoose.model<IUserPreference>(
  "UserSettings",
  UserPreferenceSchema
);

export default UserPreferenceModel;
