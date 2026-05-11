import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SubscriptionModel } from "@/lib/db/models/subscription";
import { User } from "@/lib/db/models/user";
import { requireAuth, isAuthError } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { subscription } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription" },
        { status: 400 }
      );
    }

    await connectDB();

    await SubscriptionModel.findOneAndUpdate(
      { userId: auth.userId, "subscription.endpoint": subscription.endpoint },
      { userId: auth.userId, subscription },
      { upsert: true, new: true }
    );

    await User.findOneAndUpdate(
      { userId: auth.userId },
      {
        $set: { "reminderChannels.push": true },
        $setOnInsert: {
          userId: auth.userId,
          name: auth.name,
          email: auth.email,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/notifications/subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const { endpoint } = await request.json();

    await connectDB();

    await SubscriptionModel.deleteOne({
      userId: auth.userId,
      "subscription.endpoint": endpoint,
    });

    const remaining = await SubscriptionModel.countDocuments({ userId: auth.userId });
    if (remaining === 0) {
      await User.updateOne(
        { userId: auth.userId },
        { $set: { "reminderChannels.push": false } }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notifications/subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
