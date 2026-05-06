import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SubscriptionModel } from "@/lib/db/models/subscription";
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

    // Upsert the subscription
    await SubscriptionModel.findOneAndUpdate(
      { userId: auth.userId, "subscription.endpoint": subscription.endpoint },
      { userId: auth.userId, subscription },
      { upsert: true, new: true }
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notifications/subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
