import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { EntryModel } from "@/lib/db/models/entry";
import { requireAuth, isAuthError } from "@/lib/auth";

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
    await connectDB();

    const entry = await EntryModel.findOne({
      userId: auth.userId,
      date,
    }).lean();

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
