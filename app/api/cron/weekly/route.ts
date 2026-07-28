// Called by external cron (cron-job.org) every Sunday at 18:00 UTC
// Authorization: Bearer <CRON_SECRET>
// CRON_SECRET is set in Vercel environment variables

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users as usersTable, entries as entriesTable } from "@/lib/db/schema";
import {
  sendWeeklySummaryEmail,
  type WeeklySummaryData,
} from "@/lib/notifications/email";
import { computeStreak } from "@/lib/utils/streak";
import { MOOD_EMOJIS, type MoodValue } from "@/types";
import { eq, inArray, desc } from "drizzle-orm";

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
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const dow = today.getUTCDay(); // 0=Sun
  const sunday = new Date(today);
  if (dow !== 0) {
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
    const { monday, sunday, days } = getPastWeekRange(new Date());
    const rangeLabel = formatRangeLabel(monday, sunday);
    const weekDateSet = new Set(days);

    const allUsers = await db.select().from(usersTable);

    let sent = 0;
    let skipped = 0;

    for (const user of allUsers) {
      if (!user.email) {
        skipped += 1;
        continue;
      }

      const userEntries = await db
        .select({
          date: entriesTable.date,
          mood: entriesTable.mood,
          note: entriesTable.note,
          promptResponse: entriesTable.promptResponse,
        })
        .from(entriesTable)
        .where(
          eq(entriesTable.userId, user.userId)
        );

      const filteredWeekEntries = userEntries.filter((e) => days.includes(e.date));

      if (filteredWeekEntries.length === 0) {
        skipped += 1;
        continue;
      }

      const checkIns = filteredWeekEntries.length;
      const moodSum = filteredWeekEntries.reduce((s, e) => s + e.mood, 0);
      const averageMood = Math.round((moodSum / checkIns) * 10) / 10;
      const averageMoodEmoji =
        MOOD_EMOJIS[(Math.round(averageMood) as MoodValue) || 3] || "🙂";

      let bestEntry = filteredWeekEntries[0];
      for (const e of filteredWeekEntries) {
        if (e.mood > bestEntry.mood) bestEntry = e;
      }
      const bestDayDate = new Date(`${bestEntry.date}T00:00:00Z`);
      const bestDayLabel = `${DAY_LABELS[bestDayDate.getUTCDay()]} · ${MONTH_LABELS[bestDayDate.getUTCMonth()]} ${bestDayDate.getUTCDate()}`;

      const candidates: string[] = [];
      for (const e of filteredWeekEntries) {
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

      const streak = computeStreak(userEntries.map((e) => e.date));

      const checkedInDates = new Set(filteredWeekEntries.map((e) => e.date));
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
