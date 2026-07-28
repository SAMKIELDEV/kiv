import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { entries as entriesTable } from "@/lib/db/schema";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getTodayDateString } from "@/lib/utils";
import { eq, and, desc } from "drizzle-orm";

// POST /api/entries — create today's entry
export async function POST(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const body = await request.json();
    const { mood, prompt, promptResponse, note, factors } = body;

    if (!mood || mood < 1 || mood > 5) {
      return NextResponse.json(
        { error: "Mood must be between 1 and 5" },
        { status: 400 }
      );
    }

    const today = getTodayDateString();

    const [existing] = await db
      .select()
      .from(entriesTable)
      .where(and(eq(entriesTable.userId, auth.userId), eq(entriesTable.date, today)))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 409 }
      );
    }

    const [entry] = await db
      .insert(entriesTable)
      .values({
        userId: auth.userId,
        date: today,
        mood,
        prompt: typeof prompt === "string" ? prompt : "",
        promptResponse: typeof promptResponse === "string" ? promptResponse : "",
        note: typeof note === "string" && note.length > 0 ? note : null,
        factors: Array.isArray(factors) ? factors : [],
      })
      .returning();

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/entries error:", error);
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 }
    );
  }
}

// GET /api/entries — get all entries for authenticated user
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    const entriesList = await db
      .select()
      .from(entriesTable)
      .where(eq(entriesTable.userId, auth.userId))
      .orderBy(desc(entriesTable.date));

    return NextResponse.json(entriesList);
  } catch (error) {
    console.error("GET /api/entries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
