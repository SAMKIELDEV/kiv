import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { entries } from "@/lib/db/schema";
import { requireAuth, isAuthError } from "@/lib/auth";
import { computeStreak } from "@/lib/utils/streak";
import { eq, desc } from "drizzle-orm";

// GET /api/entries/streak — compute current + longest streak
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const entryDates = await db
      .select({ date: entries.date })
      .from(entries)
      .where(eq(entries.userId, auth.userId))
      .orderBy(desc(entries.date));

    const streak = computeStreak(entryDates.map((e) => e.date));
    return NextResponse.json(streak);
  } catch (error) {
    console.error("GET /api/entries/streak error:", error);
    return NextResponse.json(
      { error: "Failed to compute streak" },
      { status: 500 }
    );
  }
}
