import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAuth, isAuthError } from "@/lib/auth";
import { sendPushToUser } from "@/lib/notifications/push";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();

    const result = await sendPushToUser(auth.userId, {
      title: "Kiv Test Notification",
      body: "This is a test to confirm your reminders are working! 🌿",
    });

    if (result.attempted === 0) {
      return NextResponse.json({ error: "No subscriptions found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("POST /api/notifications/test error:", error);
    const message = error instanceof Error ? error.message : "Failed to send";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
