import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { connectDB } from "@/lib/db";
import { EntryModel } from "@/lib/db/models/entry";
import { requireAuth, isAuthError } from "@/lib/auth";
import { MOOD_LABELS } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (isAuthError(auth)) return auth;

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "AI is not configured" }, { status: 501 });
  }

  try {
    await connectDB();

    // Get entries from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split("T")[0];

    const entries = await EntryModel.find({
      userId: auth.userId,
      date: { $gte: dateStr },
    }).sort({ date: 1 });

    if (entries.length < 3) {
      return NextResponse.json({
        reflection: "You need at least 3 entries this week for an AI reflection. Keep journaling! 🌿",
        insufficient: true
      });
    }

    const entrySummary = entries.map(e => ({
      date: e.date,
      mood: MOOD_LABELS[e.mood as keyof typeof MOOD_LABELS],
      factors: e.factors?.join(", ") || "none",
      note: e.note || ""
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an empathetic, insightful, and minimalist mental health assistant. Your goal is to provide a brief (3-4 sentences), dont sound like a robot, be natural, high-impact reflection on a user's week based on their mood logs and factors. Be encouraging but grounded. Do not use generic advice. Focus on patterns or subtle wins."
        },
        {
          role: "user",
          content: `Here are my journal entries for the past week: ${JSON.stringify(entrySummary)}. Please provide a short reflection on my week.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 256,
    });

    const reflection = completion.choices[0]?.message?.content || "Could not generate reflection.";

    return NextResponse.json({ reflection });
  } catch (error) {
    console.error("GET /api/reflections/weekly error:", error);
    return NextResponse.json({ error: "Failed to generate reflection" }, { status: 500 });
  }
}
