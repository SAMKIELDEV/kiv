import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EntryModel } from "@/lib/db/models/entry";
import { requireAuth, isAuthError } from "@/lib/auth";
import type { StreakData } from "@/types";

// GET /api/entries/streak — compute current + longest streak
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();

    const entries = await EntryModel.find({ userId: auth.userId })
      .select("date")
      .sort({ date: -1 })
      .lean();

    const streak = computeStreak(entries.map((e) => e.date));
    console.log("Streak computed:", streak);
    return NextResponse.json(streak);
  } catch (error) {
    console.error("GET /api/entries/streak error:", error);
    return NextResponse.json(
      { error: "Failed to compute streak" },
      { status: 500 }
    );
  }
}

function computeStreak(dates: string[]): StreakData {
  if (dates.length === 0) return { current: 0, longest: 0 };

  // Dates are sorted desc — most recent first
  const dateSet = new Set(dates);
  const sortedDates = [...dateSet].sort().reverse();

  // Current streak — count consecutive days from today backwards
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = 0;
  const checkDate = new Date(today);

  // Check if today or yesterday has an entry (allow checking in later)
  const todayStr = formatDateStr(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateStr(yesterday);

  if (dateSet.has(todayStr)) {
    // Start counting from today
    while (dateSet.has(formatDateStr(checkDate))) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (dateSet.has(yesterdayStr)) {
    // Haven't checked in today yet — streak still alive, count from yesterday
    checkDate.setDate(checkDate.getDate() - 1);
    while (dateSet.has(formatDateStr(checkDate))) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Longest streak — scan all dates
  let longest = 0;
  let tempStreak = 1;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const curr = new Date(sortedDates[i] + "T00:00:00");
    const next = new Date(sortedDates[i + 1] + "T00:00:00");
    const diffDays =
      (curr.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);

  // Current could be the longest
  longest = Math.max(longest, current);

  return { current, longest };
}

function formatDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}
