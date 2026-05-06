"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { getGreeting, getTodayDateString, formatDate } from "@/lib/utils";
import { getTodaysPrompt } from "@/lib/prompts";
import { MOOD_EMOJIS, MOOD_LABELS, FACTORS, type MoodValue, type Entry, type StreakData } from "@/types";
import { NotificationToggle } from "@/components/NotificationToggle";
import { NotificationTest } from "@/components/NotificationTest";

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 0",
        }}
      >
        <Loader2 size={20} style={{ color: "var(--text-secondary)" }} className="animate-spin" />
      </div>
    );
  }

  const moods: MoodValue[] = [1, 2, 3, 4, 5];

  const baseTextarea: React.CSSProperties = {
    width: "100%",
    backgroundColor: "var(--surface)",
    border: "1.5px solid var(--border)",
    borderRadius: "10px",
    padding: "12px 16px",
    color: "var(--text-primary)",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "15px",
    resize: "vertical",
    outline: "none",
    transition: "border-color 0.15s ease",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "32px",
          color: "var(--text-primary)",
          letterSpacing: "-0.5px",
          marginBottom: "4px",
          lineHeight: 1.1,
        }}
      >
        {getGreeting(userName || "there")}
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          marginBottom: "28px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "6px 14px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--text-primary)",
          }}
        >
          🔥 {streak ? streak.current : "—"} day streak
        </span>
        <span
          style={{
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "6px 14px",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--text-secondary)",
          }}
        >
          🏆 Best: {streak ? streak.longest : "—"}
        </span>
      </div>

      <div
        style={{
          height: "1px",
          backgroundColor: "var(--border)",
          marginBottom: "28px",
        }}
      />

      {todayEntry ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              color: "var(--accent)",
            }}
          >
            ✓ Checked in today
          </p>

          <div
            style={{
              marginTop: "20px",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "20px 24px",
            }}
          >
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginBottom: "12px",
              }}
            >
              {formatDate(todayEntry.date)}
            </p>

            <span
              style={{
                fontSize: "36px",
                display: "block",
                marginBottom: "16px",
                lineHeight: 1,
              }}
              role="img"
              aria-label={MOOD_LABELS[todayEntry.mood as MoodValue]}
            >
              {MOOD_EMOJIS[todayEntry.mood as MoodValue]}
            </span>

            {todayEntry.factors && todayEntry.factors.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                {todayEntry.factors.map((f: string) => (
                  <span
                    key={f}
                    style={{
                      padding: "2px 10px",
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
            )}

            {todayEntry.promptResponse && (
              <div style={{ marginBottom: "12px" }}>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontStyle: "italic",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  {todayEntry.prompt}
                </p>
                <p
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "15px",
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                  }}
                >
                  {todayEntry.promptResponse}
                </p>
              </div>
            )}

            {todayEntry.note && (
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "15px",
                  color: "var(--text-primary)",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {todayEntry.note}
              </p>
            )}
          </div>

          <Link
            href="/app/history"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--accent)",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "20px",
            }}
          >
            View history →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              fontSize: "13px",
              color: "var(--text-secondary)",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            How are you feeling today?
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "8px",
              width: "100%",
            }}
          >
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
                  style={{
                    backgroundColor: selected
                      ? "rgba(196, 149, 106, 0.12)"
                      : "var(--surface)",
                    border: `1.5px solid ${
                      selected
                        ? "var(--accent)"
                        : hovered
                          ? "var(--text-secondary)"
                          : "var(--border)"
                    }`,
                    borderRadius: "12px",
                    aspectRatio: "1 / 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    padding: 0,
                  }}
                >
                  <span role="img" aria-label={MOOD_LABELS[m]}>
                    {MOOD_EMOJIS[m]}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: "32px" }}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 500,
                fontSize: "13px",
                color: "var(--text-secondary)",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              What influenced your mood?
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {FACTORS.map((f) => {
                const selected = selectedFactors.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleFactor(f)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      fontWeight: 500,
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      backgroundColor: selected ? "var(--accent)" : "var(--surface)",
                      color: selected ? "white" : "var(--text-secondary)",
                      borderColor: selected ? "var(--accent)" : "var(--border)",
                    }}
                    onMouseEnter={(e) => {
                      if (!selected) e.currentTarget.style.borderColor = "var(--text-secondary)";
                    }}
                    onMouseLeave={(e) => {
                      if (!selected) e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginTop: "32px", display: "flex", flexDirection: "column" }}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}
            >
              {todaysPrompt}
            </p>
            <textarea
              value={promptResponse}
              onChange={(e) => setPromptResponse(e.target.value)}
              onFocus={() => setPromptFocused(true)}
              onBlur={() => setPromptFocused(false)}
              style={{
                ...baseTextarea,
                minHeight: "88px",
                borderColor: promptFocused ? "var(--accent)" : "var(--border)",
              }}
            />
          </div>

          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column" }}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "8px",
              }}
            >
              Anything else?
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onFocus={() => setNoteFocused(true)}
              onBlur={() => setNoteFocused(false)}
              style={{
                ...baseTextarea,
                minHeight: "100px",
                borderColor: noteFocused ? "var(--accent)" : "var(--border)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.opacity = "0.88";
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.opacity = "1";
            }}
            style={{
              width: "100%",
              marginTop: "32px",
              backgroundColor: "var(--accent)",
              color: "#FFFFFF",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              padding: "14px",
              borderRadius: "10px",
              border: "none",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.6 : 1,
              transition: "opacity 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Check in →"
            )}
          </button>
        </form>
      )}

      <NotificationToggle />
      <NotificationTest />
    </div>
  );
}
