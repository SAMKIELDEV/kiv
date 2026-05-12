import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EntryModel } from "@/lib/db/models/entry";
import { requireAuth, isAuthError } from "@/lib/auth";
import { computeStreak } from "@/lib/utils/streak";

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
    return NextResponse.json(streak);
  } catch (error) {
    console.error("GET /api/entries/streak error:", error);
    return NextResponse.json(
      { error: "Failed to compute streak" },
      { status: 500 }
    );
  }
}
