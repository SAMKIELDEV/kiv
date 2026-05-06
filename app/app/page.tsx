"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getGreeting, getTodayDateString, formatDate } from "@/lib/utils";
import { getTodaysPrompt } from "@/lib/prompts";
import { MOOD_EMOJIS, MOOD_LABELS, FACTORS, type MoodValue, type Entry, type StreakData } from "@/types";

export default function DashboardPage() {
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const [mood, setMood] = useState<MoodValue | null>(null);
  const [hoveredMood, setHoveredMood] = useState<MoodValue | null>(null);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [promptResponse, setPromptResponse] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [promptFocused, setPromptFocused] = useState(false);
  const [noteFocused, setNoteFocused] = useState(false);

  const todaysPrompt = getTodaysPrompt();

  const fetchData = useCallback(async () => {
    try {
      const today = getTodayDateString();
      const [entryRes, streakRes] = await Promise.all([
        fetch(`/api/entries/${today}`),
        fetch("/api/entries/streak"),
      ]);

      if (entryRes.ok) {
        const entry = await entryRes.json();
        setTodayEntry(entry);
      }

      if (streakRes.ok) {
        const data = await streakRes.json();
        setStreak(data);
      }

      const userScript = document.getElementById("user-data");
      if (userScript) {
        const user = JSON.parse(userScript.textContent || "{}");
        setUserName(user.name || "");
      }
    } catch {
      // Error handling without console.log
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) {
      toast.error("Select a mood to check in");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          factors: selectedFactors,
          prompt: todaysPrompt,
          promptResponse: promptResponse.trim() || null,
          note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to check in");
      }

      const entry = await res.json();
      setTodayEntry(entry);

      fetch("/api/entries/streak")
        .then((r) => r.json())
        .then(setStreak)
        .catch(() => {});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="text-text-secondary animate-spin" />
      </div>
    );
  }

  const moods: MoodValue[] = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col w-full font-sans">
      <h1 className="font-extrabold text-[32px] text-text-primary tracking-tight mb-1 leading-tight">
        {getGreeting(userName || "there")}
      </h1>

      <div className="flex flex-row gap-2 mb-7 mt-3 flex-wrap">
        <span className="bg-surface border border-border rounded-full px-3.5 py-1.5 text-[13px] font-semibold text-text-primary">
          🔥 {streak ? streak.current : "—"} day streak
        </span>
        <span className="bg-surface border border-border rounded-full px-3.5 py-1.5 text-[13px] font-normal text-text-secondary">
          🏆 Best: {streak ? streak.longest : "—"}
        </span>
      </div>

      <div className="h-[1px] bg-border mb-7" />

      {todayEntry ? (
        <div className="flex flex-col">
          <p className="font-semibold text-[15px] text-accent">
            ✓ Checked in today
          </p>

          <div className="mt-5 bg-surface border border-border rounded-[14px] p-5 sm:p-6">
            <p className="text-[13px] font-medium text-text-secondary mb-3">
              {formatDate(todayEntry.date)}
            </p>

            <span
              className="text-[36px] block mb-4 leading-none"
              role="img"
              aria-label={MOOD_LABELS[todayEntry.mood as MoodValue]}
            >
              {MOOD_EMOJIS[todayEntry.mood as MoodValue]}
            </span>

            {todayEntry.factors && todayEntry.factors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {todayEntry.factors.map((f: string) => (
                  <span
                    key={f}
                    className="px-2.5 py-0.5 bg-bg border border-border rounded-full text-[12px] font-medium text-text-primary"
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {todayEntry.promptResponse && (
              <div className="mb-3">
                <p className="italic text-[13px] text-text-secondary mb-1.5">
                  {todayEntry.prompt}
                </p>
                <p className="text-[15px] text-text-primary leading-relaxed">
                  {todayEntry.promptResponse}
                </p>
              </div>
            )}

            {todayEntry.note && (
              <p className="text-[15px] text-text-primary leading-relaxed whitespace-pre-wrap">
                {todayEntry.note}
              </p>
            )}
          </div>

          <Link
            href="/app/history"
            className="font-semibold text-[14px] text-accent no-underline inline-block mt-5 hover:opacity-80 transition-opacity"
          >
            View history →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col">
          <p className="font-medium text-[13px] text-text-secondary tracking-wider uppercase mb-4">
            How are you feeling today?
          </p>

          <div className="grid grid-cols-5 gap-2 w-full">
            {moods.map((m) => {
              const selected = mood === m;
              const hovered = hoveredMood === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  onMouseEnter={() => setHoveredMood(m)}
                  onMouseLeave={() => setHoveredMood(null)}
                  aria-label={MOOD_LABELS[m]}
                  className={`
                    aspect-square flex items-center justify-center text-[28px] cursor-pointer transition-all duration-150 p-0 rounded-xl border-[1.5px]
                    ${selected ? 'bg-accent/10 border-accent' : 'bg-surface border-border'}
                    ${hovered && !selected ? 'border-text-secondary' : ''}
                  `}
                >
                  <span role="img" aria-label={MOOD_LABELS[m]}>
                    {MOOD_EMOJIS[m]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8">
            <p className="font-medium text-[13px] text-text-secondary tracking-wider uppercase mb-4">
              What influenced your mood?
            </p>
            <div className="flex flex-wrap gap-2">
              {FACTORS.map((f) => {
                const selected = selectedFactors.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFactor(f)}
                    className={`
                      px-4 py-2 rounded-full text-[13px] font-medium border transition-all duration-150
                      ${
                        selected
                          ? "bg-accent text-white border-accent"
                          : "bg-surface text-text-secondary border-border hover:border-text-secondary"
                      }
                    `}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <p className="italic font-normal text-[14px] text-text-secondary mb-2">
              {todaysPrompt}
            </p>
            <textarea
              value={promptResponse}
              onChange={(e) => setPromptResponse(e.target.value)}
              onFocus={() => setPromptFocused(true)}
              onBlur={() => setPromptFocused(false)}
              className={`
                w-full bg-surface border-[1.5px] rounded-[10px] px-4 py-3 text-text-primary text-[15px] resize-y outline-none transition-colors min-h-[88px]
                ${promptFocused ? 'border-accent' : 'border-border'}
              `}
            />
          </div>

          <div className="mt-6 flex flex-col">
            <p className="text-[13px] text-text-secondary mb-2">
              Anything else?
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onFocus={() => setNoteFocused(true)}
              onBlur={() => setNoteFocused(false)}
              className={`
                w-full bg-surface border-[1.5px] rounded-[10px] px-4 py-3 text-text-primary text-[15px] resize-y outline-none transition-colors min-h-[100px]
                ${noteFocused ? 'border-accent' : 'border-border'}
              `}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`
              w-full mt-8 bg-accent text-white font-bold text-[15px] py-3.5 rounded-[10px] border-none flex items-center justify-center gap-2 transition-opacity
              ${submitting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-90'}
            `}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Check in →"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
