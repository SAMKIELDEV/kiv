import mongoose, { Schema, Model } from "mongoose";
import type { Entry } from "@/types";

const EntrySchema = new Schema<Entry>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    mood: { type: Number, required: true, min: 1, max: 5 },
    prompt: { type: String, required: true },
    promptResponse: { type: String, default: null },
    note: { type: String, default: null },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// One entry per user per day — enforced at DB level
EntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export const EntryModel: Model<Entry> =
  mongoose.models.Entry || mongoose.model<Entry>("Entry", EntrySchema);
