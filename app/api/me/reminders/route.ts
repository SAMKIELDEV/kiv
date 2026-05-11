import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models/user";
import { requireAuth, isAuthError } from "@/lib/auth";
import { isValidTimezone } from "@/lib/utils/time";

const TIME_REGEX = /^\d{2}:\d{2}$/;

interface PartialChannels {
  push?: boolean;
  email?: boolean;
}

interface PatchBody {
  reminderTime?: unknown;
  reminderTimezone?: unknown;
  reminderChannels?: unknown;
}

function parseChannels(value: unknown): PartialChannels | null {
  if (typeof value !== "object" || value === null) return null;
  const v = value as Record<string, unknown>;
  const out: PartialChannels = {};
  if ("push" in v) {
    if (typeof v.push !== "boolean") return null;
    out.push = v.push;
  }
  if ("email" in v) {
    if (typeof v.email !== "boolean") return null;
    out.email = v.email;
  }
  return out;
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

  const channels = parseChannels(reminderChannels);
  if (channels === null) {
    return NextResponse.json(
      { error: "reminderChannels keys must be booleans when present" },
      { status: 400 }
    );
  }

  try {
    await connectDB();

    const set: Record<string, unknown> = {
      reminderTime,
      reminderTimezone,
    };
    if (channels.push !== undefined) set["reminderChannels.push"] = channels.push;
    if (channels.email !== undefined) set["reminderChannels.email"] = channels.email;

    await User.findOneAndUpdate(
      { userId: auth.userId },
      {
        $set: set,
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
