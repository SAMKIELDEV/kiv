import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EntryModel } from "@/lib/db/models/entry";
import { requireAuth, isAuthError } from "@/lib/auth";
import { getTodayDateString } from "@/lib/utils";

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

    await connectDB();

    const today = getTodayDateString();

    const existing = await EntryModel.findOne({
      userId: auth.userId,
      date: today,
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already checked in today" },
        { status: 409 }
      );
    }

    const entry = await EntryModel.create({
      userId: auth.userId,
      date: today,
      mood,
      prompt: typeof prompt === "string" ? prompt : "",
      promptResponse: typeof promptResponse === "string" ? promptResponse : "",
      note: typeof note === "string" && note.length > 0 ? note : null,
      factors: Array.isArray(factors) ? factors : [],
    });

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
    await connectDB();

    const entries = await EntryModel.find({ userId: auth.userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET /api/entries error:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
