import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import { connectDB } from "@/lib/db";
import { SubscriptionModel } from "@/lib/db/models/subscription";
import { requireAuth, isAuthError } from "@/lib/auth";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL || "mailto:admin@samkiel.tech",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();
    const subscriptions = await SubscriptionModel.find({ userId: auth.userId });

    if (subscriptions.length === 0) {
      return NextResponse.json({ error: "No subscriptions found" }, { status: 404 });
    }

    const payload = JSON.stringify({
      title: "Kiv Test Notification",
      body: "This is a test to confirm your reminders are working! 🌿",
    });

    const results = await Promise.allSettled(
      subscriptions.map((sub) =>
        webpush.sendNotification(sub.subscription as any, payload)
      )
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("POST /api/notifications/test error:", error);
    return NextResponse.json({ error: "Failed to send test notification" }, { status: 500 });
  }
}
