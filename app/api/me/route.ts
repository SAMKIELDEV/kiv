import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, entries } from "@/lib/db/schema";
import { requireAuth, isAuthError } from "@/lib/auth";
import { eq } from "drizzle-orm";

// GET /api/me — get cached user info
export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  try {
    // Upsert user cache from JWT data
    const [user] = await db
      .insert(users)
      .values({
        userId: auth.userId,
        name: auth.name,
        email: auth.email,
      })
      .onConflictDoUpdate({
        target: users.userId,
        set: { name: auth.name, email: auth.email },
      })
      .returning();

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
    await db.transaction(async (tx) => {
      await tx.delete(entries).where(eq(entries.userId, auth.userId));
      await tx.delete(users).where(eq(users.userId, auth.userId));
    });

    return NextResponse.json({ message: "All Kiv data deleted" });
  } catch (error) {
    console.error("DELETE /api/me error:", error);
    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 500 }
    );
  }
}
