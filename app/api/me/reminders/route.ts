import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models/user";
import { requireAuth, isAuthError } from "@/lib/auth";
import { isValidTimezone } from "@/lib/utils/time";
import type { ReminderChannels } from "@/types";

const TIME_REGEX = /^\d{2}:\d{2}$/;

interface PatchBody {
  reminderTime?: unknown;
  reminderTimezone?: unknown;
  reminderChannels?: unknown;
}

function isChannels(value: unknown): value is ReminderChannels {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.push === "boolean" && typeof v.email === "boolean";
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { reminderTime, reminderTimezone, reminderChannels } = body;

  if (typeof reminderTime !== "string" || !TIME_REGEX.test(reminderTime)) {
    return NextResponse.json(
      { error: "reminderTime must be in HH:MM format" },
      { status: 400 }
    );
  }

  const [hh, mm] = reminderTime.split(":").map((s) => parseInt(s, 10));
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    return NextResponse.json({ error: "reminderTime out of range" }, { status: 400 });
  }

  if (typeof reminderTimezone !== "string" || reminderTimezone.length === 0) {
    return NextResponse.json(
      { error: "reminderTimezone must be a non-empty string" },
      { status: 400 }
    );
  }

  if (!isValidTimezone(reminderTimezone)) {
    return NextResponse.json({ error: "Invalid IANA timezone" }, { status: 400 });
  }

  if (!isChannels(reminderChannels)) {
    return NextResponse.json(
      { error: "reminderChannels must be { push: boolean, email: boolean }" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    await User.findOneAndUpdate(
      { userId: auth.userId },
      {
        $set: {
          reminderTime,
          reminderTimezone,
          reminderChannels,
        },
        $setOnInsert: {
          userId: auth.userId,
          name: auth.name,
          email: auth.email,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/me/reminders error:", error);
    return NextResponse.json({ error: "Failed to update reminders" }, { status: 500 });
  }
}
