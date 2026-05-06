import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models/user";
import { EntryModel } from "@/lib/db/models/entry";
import { requireAuth, isAuthError } from "@/lib/auth";

// GET /api/me — get cached user info
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();

    // Upsert user cache from JWT data
    const user = await User.findOneAndUpdate(
      { userId: auth.userId },
      {
        $set: { name: auth.name, email: auth.email },
        $setOnInsert: { userId: auth.userId },
      },
      { upsert: true, new: true, lean: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// DELETE /api/me — delete all user data from Kiv DB
export async function DELETE(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    await connectDB();

    await Promise.all([
      EntryModel.deleteMany({ userId: auth.userId }),
      User.deleteOne({ userId: auth.userId }),
    ]);

    return NextResponse.json({ message: "All Kiv data deleted" });
  } catch (error) {
    console.error("DELETE /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
