import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { subscriptions, users } from "@/lib/db/schema";
import { requireAuth, isAuthError } from "@/lib/auth";
import { eq, and, count } from "drizzle-orm";

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

    // Upsert subscription
    await db
      .insert(subscriptions)
      .values({
        userId: auth.userId,
        subscription,
      })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: { subscription },
      });

    // Update user reminderChannels.push to true
    const [existing] = await db
      .select({ reminderChannels: users.reminderChannels })
      .from(users)
      .where(eq(users.userId, auth.userId))
      .limit(1);

    const mergedChannels = existing?.reminderChannels || {};
    mergedChannels.push = true;

    await db
      .insert(users)
      .values({
        userId: auth.userId,
        name: auth.name,
        email: auth.email,
        reminderChannels: mergedChannels,
      })
      .onConflictDoUpdate({
        target: users.userId,
        set: { reminderChannels: mergedChannels },
      });

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

    await db
      .delete(subscriptions)
      .where(and(eq(subscriptions.userId, auth.userId)));

    const [{ value }] = await db
      .select({ value: count() })
      .from(subscriptions)
      .where(eq(subscriptions.userId, auth.userId));

    if (value === 0) {
      const [existing] = await db
        .select({ reminderChannels: users.reminderChannels })
        .from(users)
        .where(eq(users.userId, auth.userId))
        .limit(1);

      if (existing) {
        const mergedChannels = existing.reminderChannels || {};
        mergedChannels.push = false;

        await db
          .update(users)
          .set({ reminderChannels: mergedChannels })
          .where(eq(users.userId, auth.userId));
      }
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
