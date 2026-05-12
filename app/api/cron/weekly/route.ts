// Called by external cron (cron-job.org) every Sunday at 18:00 UTC
// Authorization: Bearer <CRON_SECRET>
// CRON_SECRET is set in Vercel environment variables

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models/user";
import { EntryModel } from "@/lib/db/models/entry";
import {
  sendWeeklySummaryEmail,
  type WeeklySummaryData,
} from "@/lib/notifications/email";
import { computeStreak } from "@/lib/utils/streak";
import { MOOD_EMOJIS, type MoodValue } from "@/types";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function dateToYMD(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatRangeLabel(monday: Date, sunday: Date): string {
  const m = `${MONTH_LABELS[monday.getUTCMonth()]} ${monday.getUTCDate()}`;
  const s = `${MONTH_LABELS[sunday.getUTCMonth()]} ${sunday.getUTCDate()}`;
  return `${m} to ${s}`;
}

function getPastWeekRange(now: Date): { monday: Date; sunday: Date; days: string[] } {
  // "Past 7 days (Mon–Sun)" — the week that just ended.
  // When run on Sunday at 18:00 UTC, today IS the Sunday of the reporting week.
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dow = today.getUTCDay(); // 0=Sun
  const sunday = new Date(today);
  if (dow !== 0) {
    // Roll back to most recent Sunday
    sunday.setUTCDate(today.getUTCDate() - dow);
  }
  const monday = new Date(sunday);
  monday.setUTCDate(sunday.getUTCDate() - 6);

  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setUTCDate(monday.getUTCDate() + i);
    days.push(dateToYMD(d));
  }
  return { monday, sunday, days };
}

function pickRandomFeatured(texts: string[]): string | null {
  if (texts.length === 0) return null;
  return texts[Math.floor(Math.random() * texts.length)];
}

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
    await connectDB();

    const { monday, sunday, days } = getPastWeekRange(new Date());
    const rangeLabel = formatRangeLabel(monday, sunday);
    const weekDateSet = new Set(days);

    const users = await User.find({}).lean();

    let sent = 0;
    let skipped = 0;

    for (const user of users) {
      if (!user.email) {
        skipped += 1;
        continue;
      }

      const weekEntries = await EntryModel.find({
        userId: user.userId,
        date: { $in: days },
      })
        .select("date mood note promptResponse")
        .lean();

      if (weekEntries.length === 0) {
        skipped += 1;
        continue;
      }

      const checkIns = weekEntries.length;
      const moodSum = weekEntries.reduce((s, e) => s + e.mood, 0);
      const averageMood = Math.round((moodSum / checkIns) * 10) / 10;
      const averageMoodEmoji =
        MOOD_EMOJIS[(Math.round(averageMood) as MoodValue) || 3] || "🙂";

      // Best mood day — highest mood, ties broken by earliest in the week
      let bestEntry = weekEntries[0];
      for (const e of weekEntries) {
        if (e.mood > bestEntry.mood) bestEntry = e;
      }
      const bestDayDate = new Date(`${bestEntry.date}T00:00:00Z`);
      const bestDayLabel = `${DAY_LABELS[bestDayDate.getUTCDay()]} · ${MONTH_LABELS[bestDayDate.getUTCMonth()]} ${bestDayDate.getUTCDate()}`;

      // Featured text — random non-empty note or promptResponse
      const candidates: string[] = [];
      for (const e of weekEntries) {
        if (typeof e.note === "string" && e.note.trim().length > 0) {
          candidates.push(e.note.trim());
        }
        if (
          typeof e.promptResponse === "string" &&
          e.promptResponse.trim().length > 0
        ) {
          candidates.push(e.promptResponse.trim());
        }
      }
      const featuredText = pickRandomFeatured(candidates);

      // Current streak — full history
      const allEntries = await EntryModel.find({ userId: user.userId })
        .select("date")
        .lean();
      const streak = computeStreak(allEntries.map((e) => e.date));

      const checkedInDates = new Set(weekEntries.map((e) => e.date));
      let missedDays = 0;
      for (const d of weekDateSet) {
        if (!checkedInDates.has(d)) missedDays += 1;
      }
      const perfectWeek = missedDays === 0 && checkIns >= 7;

      const data: WeeklySummaryData = {
        rangeLabel,
        checkIns,
        averageMood,
        averageMoodEmoji,
        currentStreak: streak.current,
        bestDayLabel,
        featuredText,
        missedDays,
        perfectWeek,
      };

      try {
        await sendWeeklySummaryEmail(user.email, data);
        sent += 1;
      } catch (err) {
        console.error(`Weekly summary failed for ${user.userId}:`, err);
        skipped += 1;
      }
    }

    return NextResponse.json({ sent, skipped });
  } catch (error) {
    console.error("POST /api/cron/weekly error:", error);
    return NextResponse.json({ error: "Cron run failed" }, { status: 500 });
  }
}
