import webpush from "web-push";
import { SubscriptionModel } from "@/lib/db/models/subscription";

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

  const subscriptions = await SubscriptionModel.find({ userId });
  if (subscriptions.length === 0) {
    return { attempted: 0, succeeded: 0, failed: 0 };
  }

  const body = JSON.stringify(payload);

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
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
