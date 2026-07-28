/**
 * POST /api/cron/reminders
 *
 * This route is called by an external cron service (e.g. cron-job.org).
 * It should be called every 15 minutes — the reminder time picker is in
 * 15-minute increments, so a 15-minute cadence is the minimum granularity
 * needed to ever match a user's preferred time.
 *
 * The caller must pass `Authorization: Bearer <CRON_SECRET>` in the
 * request header. The `CRON_SECRET` value is set in Vercel environment
 * variables and must match exactly.
 *
 * NOT wired into vercel.json on purpose — Vercel Hobby cron is daily-only.
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, entries } from "@/lib/db/schema";
import { sendPushToUser } from "@/lib/notifications/push";
import { sendReminderEmail } from "@/lib/notifications/email";
import { getLocalNowInTZ } from "@/lib/utils/time";
import {
  DEFAULT_REMINDER_TIME,
  DEFAULT_REMINDER_TZ,
} from "@/types";
import { eq, and, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    console.error("CRON_SECRET not configured");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const candidates = await db
      .select()
      .from(users)
      .where(
        sql`(${users.reminderChannels}->>'push')::boolean = true OR (${users.reminderChannels}->>'email')::boolean = true`
      );

    let notified = 0;

    for (const user of candidates) {
      const tz = user.reminderTimezone || DEFAULT_REMINDER_TZ;
      const time = user.reminderTime || DEFAULT_REMINDER_TIME;
      const channels = user.reminderChannels || { push: false, email: false };

      let localNow;
      try {
        localNow = getLocalNowInTZ(tz);
      } catch (err) {
        console.error(`Bad timezone for user ${user.userId}: ${tz}`, err);
        continue;
      }

      if (localNow.time !== time) continue;
      if (user.lastNotifiedDate === localNow.date) continue;

      const [existingEntry] = await db
        .select({ id: entries.id })
        .from(entries)
        .where(and(eq(entries.userId, user.userId), eq(entries.date, localNow.date)))
        .limit(1);

      if (existingEntry) continue;

      let didSend = false;

      if (channels.push) {
        try {
          const result = await sendPushToUser(user.userId, {
            title: "How are you feeling today?",
            body: "Your daily Kiv check-in is waiting. 🌿",
          });
          if (result.succeeded > 0) didSend = true;
        } catch (err) {
          console.error(`Push failed for ${user.userId}:`, err);
        }
      }

      if (channels.email && user.email) {
        try {
          await sendReminderEmail(user.email);
          didSend = true;
        } catch (err) {
          console.error(`Email failed for ${user.userId}:`, err);
        }
      }

      if (didSend) {
        await db
          .update(users)
          .set({ lastNotifiedDate: localNow.date })
          .where(eq(users.userId, user.userId));
        notified += 1;
      }
    }

    return NextResponse.json({ notified });
  } catch (error) {
    console.error("POST /api/cron/reminders error:", error);
    return NextResponse.json({ error: "Cron run failed" }, { status: 500 });
  }
}
