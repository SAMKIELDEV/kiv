import webpush from "web-push";
import { db } from "@/lib/db";
import { subscriptions as subscriptionsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface PushPayload {
  title: string;
  body: string;
}

export interface PushResult {
  attempted: number;
  succeeded: number;
  failed: number;
}

let vapidConfigured = false;

function ensureVapidConfigured(): void {
  if (vapidConfigured) return;

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey) throw new Error("Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY");
  if (!privateKey) throw new Error("Missing VAPID_PRIVATE_KEY");

  webpush.setVapidDetails(
    process.env.VAPID_EMAIL || "mailto:admin@samkiel.tech",
    publicKey,
    privateKey
  );

  vapidConfigured = true;
}

export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<PushResult> {
  ensureVapidConfigured();

  const userSubs = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId));

  if (userSubs.length === 0) {
    return { attempted: 0, succeeded: 0, failed: 0 };
  }

  const body = JSON.stringify(payload);

  const results = await Promise.allSettled(
    userSubs.map((sub) =>
      webpush.sendNotification(sub.subscription, body)
    )
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  return {
    attempted: results.length,
    succeeded,
    failed: results.length - succeeded,
  };
}
