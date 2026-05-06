import mongoose, { Schema, Model } from "mongoose";

export interface ISubscription {
  userId: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  createdAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, index: true },
    subscription: {
      endpoint: { type: String, required: true },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
    },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

// One subscription per user (or device, but let's keep it simple for now)
SubscriptionSchema.index({ userId: 1, "subscription.endpoint": 1 }, { unique: true });

export const SubscriptionModel: Model<ISubscription> =
  mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
