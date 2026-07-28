import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { entries } from "@/lib/db/schema";
import { requireAuth, isAuthError } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

// GET /api/entries/[date] — get a single entry by date
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string }> }
) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  const { date } = await params;

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD" },
      { status: 400 }
    );
  }

  try {
    const [entry] = await db
      .select()
      .from(entries)
      .where(and(eq(entries.userId, auth.userId), eq(entries.date, date)))
      .limit(1);

    if (!entry) {
      return NextResponse.json(
        { error: "Entry not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("GET /api/entries/[date] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entry" },
      { status: 500 }
    );
  }
}
