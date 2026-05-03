import mongoose, { Schema, Model } from "mongoose";
import type { KivUser } from "@/types";

const UserSchema = new Schema<KivUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

export const User: Model<KivUser> =
  mongoose.models.User || mongoose.model<KivUser>("User", UserSchema);
