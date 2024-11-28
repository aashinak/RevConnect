import mongoose, { Schema } from "mongoose";
import { ICall } from "../entities/ICall";

const CallSchema: Schema = new Schema<ICall>(
    {
      caller: { type: Schema.Types.ObjectId, ref: "User", required: true },
      receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
      type: { type: String, enum: ["audio", "video"], required: true },
      status: { type: String, enum: ["ringing", "accepted", "rejected", "missed"], required: true },
      startTime: { type: Date },
      endTime: { type: Date },
      groupChat: { type: Schema.Types.ObjectId, ref: "Chat", default: null },
    },
    {
      timestamps: true,
    }
  );
  
  // Create the Call model
  export const Call = mongoose.model<ICall>("Call", CallSchema);
  
  export default Call;