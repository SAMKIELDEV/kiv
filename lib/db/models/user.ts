import mongoose, { Schema, Model } from "mongoose";
import type { KivUser } from "@/types";

const UserSchema = new Schema<KivUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    reminderTime: { type: String },
    reminderTimezone: { type: String },
    reminderChannels: {
      push: { type: Boolean },
      email: { type: Boolean },
    },
    lastNotifiedDate: { type: String },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

export const User: Model<KivUser> =
  mongoose.models.User || mongoose.model<KivUser>("User", UserSchema);
