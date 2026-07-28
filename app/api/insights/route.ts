import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { entries as entriesTable } from "@/lib/db/schema";
import { requireAuth, isAuthError } from "@/lib/auth";
import { computeStreak } from "@/lib/utils/streak";
import type { MoodValue } from "@/types";
import { eq, asc } from "drizzle-orm";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface MoodTrendPoint {
  date: string;
  mood: number;
}

interface MoodByDay {
  day: number;
  label: string;
  average: number | null;
}

export interface InsightsResponse {
  totalEntries: number;
  currentStreak: number;
  averageMood: number;
  moodTrend: MoodTrendPoint[];
  moodByDayOfWeek: MoodByDay[];
  topMood: number;
  longestStreak: number;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

function dayOfWeekFromDateStr(dateStr: string): number {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

// GET /api/insights — aggregate stats for the authenticated user
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const userEntries = await db
      .select({ date: entriesTable.date, mood: entriesTable.mood })
      .from(entriesTable)
      .where(eq(entriesTable.userId, auth.userId))
      .orderBy(asc(entriesTable.date));

    const totalEntries = userEntries.length;

    const streak = computeStreak(userEntries.map((e) => e.date));

    const averageMood =
      totalEntries === 0
        ? 0
        : round1(userEntries.reduce((sum, e) => sum + e.mood, 0) / totalEntries);

    // Mood trend — last 30 days, one entry per day that exists
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const cutoff = new Date(today);
    cutoff.setUTCDate(cutoff.getUTCDate() - 29);
    const cutoffStr = cutoff.toISOString().split("T")[0];

    const moodTrend: MoodTrendPoint[] = userEntries
      .filter((e) => e.date >= cutoffStr)
      .map((e) => ({ date: e.date, mood: e.mood }));

    // Mood by day of week
    const buckets: { sum: number; count: number }[] = Array.from(
      { length: 7 },
      () => ({ sum: 0, count: 0 })
    );
    for (const e of userEntries) {
      const dow = dayOfWeekFromDateStr(e.date);
      buckets[dow].sum += e.mood;
      buckets[dow].count += 1;
    }
    const moodByDayOfWeek: MoodByDay[] = buckets.map((b, i) => ({
      day: i,
      label: DAY_LABELS[i],
      average: b.count === 0 ? null : round1(b.sum / b.count),
    }));

    // Top mood — most frequent value, ties broken by higher value
    const counts: Record<MoodValue, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const e of userEntries) {
      counts[e.mood as MoodValue] += 1;
    }
    let topMood = 0;
    let topCount = -1;
    ([5, 4, 3, 2, 1] as MoodValue[]).forEach((m) => {
      if (counts[m] > topCount) {
        topCount = counts[m];
        topMood = m;
      }
    });
    if (topCount === 0) topMood = 0;

    const body: InsightsResponse = {
      totalEntries,
      currentStreak: streak.current,
      averageMood,
      moodTrend,
      moodByDayOfWeek,
      topMood,
      longestStreak: streak.longest,
    };

    return NextResponse.json(body);
  } catch (error) {
    console.error("GET /api/insights error:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
