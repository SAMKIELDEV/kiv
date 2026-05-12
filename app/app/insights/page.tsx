"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { MOOD_EMOJIS, type MoodValue } from "@/types";

interface MoodTrendPoint {
  date: string;
  mood: number;
}

interface MoodByDay {
  day: number;
  label: string;
  average: number | null;
}

interface InsightsResponse {
  totalEntries: number;
  currentStreak: number;
  averageMood: number;
  moodTrend: MoodTrendPoint[];
  moodByDayOfWeek: MoodByDay[];
  topMood: number;
  longestStreak: number;
}

const MOOD_COLORS: Record<MoodValue, string> = {
  1: "#E05C5C",
  2: "#E09B5C",
  3: "#C4956A",
  4: "#7AB87A",
  5: "#4A9E6B",
};

const INSIGHTS_MOOD_LABELS: Record<MoodValue, string> = {
  1: "Struggling",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

function moodColor(mood: number): string {
  if (mood >= 1 && mood <= 5) return MOOD_COLORS[mood as MoodValue];
  return "var(--border)";
}

function formatTrendDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/insights");
        if (!res.ok) {
          if (!cancelled) setError(true);
          return;
        }
        const json: InsightsResponse = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const backLink = (
    <Link
      href="/app"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        color: "var(--text-secondary)",
        textDecoration: "none",
        marginBottom: "32px",
      }}
    >
      <ChevronLeft size={16} />
      Back
    </Link>
  );

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {backLink}

        {/* h1: "Insights" — fontSize 32, mb 8 */}
        <Skeleton
          className="rounded-md"
          style={{ height: "30px", width: "140px", marginBottom: "10px" }}
        />
        {/* subtitle p — fontSize 14, mb 28 */}
        <Skeleton
          className="rounded-md"
          style={{ height: "14px", width: "280px", marginBottom: "28px" }}
        />

        {/* 4 stat cards — 2x2 grid, gap 12, mb 36 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
            marginBottom: "36px",
          }}
        >
          {[1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              style={{ height: "88px", borderRadius: "14px" }}
            />
          ))}
        </div>

        {/* Top mood callout — emoji + 2-line text, ~76px tall, mb 36 */}
        <Skeleton
          style={{
            height: "84px",
            borderRadius: "14px",
            marginBottom: "36px",
          }}
        />

        {/* Section: Mood trend — title (16) + subtitle (13) + chart card (200) */}
        <div style={{ marginBottom: "36px" }}>
          <Skeleton
            className="rounded-md"
            style={{ height: "16px", width: "140px", marginBottom: "6px" }}
          />
          <Skeleton
            className="rounded-md"
            style={{ height: "13px", width: "100px", marginBottom: "14px" }}
          />
          <Skeleton style={{ height: "200px", borderRadius: "14px" }} />
        </div>

        {/* Section: Mood by day of week */}
        <div>
          <Skeleton
            className="rounded-md"
            style={{ height: "16px", width: "180px", marginBottom: "6px" }}
          />
          <Skeleton
            className="rounded-md"
            style={{ height: "13px", width: "160px", marginBottom: "14px" }}
          />
          <Skeleton style={{ height: "220px", borderRadius: "14px" }} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {backLink}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            color: "var(--text-secondary)",
            fontStyle: "italic",
          }}
        >
          Couldn&apos;t load insights right now. Try again in a moment.
        </p>
      </div>
    );
  }

  if (data.totalEntries < 3) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {backLink}
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 800,
            fontSize: "32px",
            letterSpacing: "-0.5px",
            marginBottom: "12px",
            lineHeight: 1.1,
            color: "var(--text-primary)",
          }}
        >
          Insights
        </h1>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "15px",
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          Not enough data yet — keep checking in.
        </p>
      </div>
    );
  }

  const trendMaxBars = 30;
  const trend = data.moodTrend.slice(-trendMaxBars);
  const hasTopMood = data.topMood >= 1 && data.topMood <= 5;
  const topMoodValue: MoodValue = hasTopMood
    ? (data.topMood as MoodValue)
    : 3;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {backLink}

      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "32px",
          letterSpacing: "-0.5px",
          marginBottom: "8px",
          lineHeight: 1.1,
          color: "var(--text-primary)",
        }}
      >
        Insights
      </h1>
      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "14px",
          color: "var(--text-secondary)",
          marginBottom: "28px",
        }}
      >
        Patterns from every check-in you&apos;ve made.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginBottom: "36px",
        }}
      >
        <StatCard label="Total entries" value={data.totalEntries.toString()} />
        <StatCard label="Current streak" value={`${data.currentStreak}`} suffix="days" />
        <StatCard label="Longest streak" value={`${data.longestStreak}`} suffix="days" />
        <StatCard label="Average mood" value={data.averageMood.toFixed(1)} suffix="/ 5" />
      </div>

      {hasTopMood && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            padding: "20px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            marginBottom: "36px",
          }}
        >
          <span style={{ fontSize: "40px", lineHeight: 1 }} role="img" aria-hidden>
            {MOOD_EMOJIS[topMoodValue]}
          </span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                marginBottom: "4px",
              }}
            >
              Top mood
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              Your most frequent mood is{" "}
              <span style={{ color: moodColor(topMoodValue) }}>
                {INSIGHTS_MOOD_LABELS[topMoodValue]}
              </span>
              .
            </span>
          </div>
        </div>
      )}

      <Section title="Mood trend" subtitle="Last 30 days">
        {trend.length === 0 ? (
          <EmptyHint>No check-ins in the last 30 days.</EmptyHint>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: "4px",
              height: "160px",
              padding: "8px 0",
            }}
          >
            {trend.map((p) => {
              const heightPct = (p.mood / 5) * 100;
              return (
                <div
                  key={p.date}
                  title={`${formatTrendDate(p.date)} · ${p.mood}/5`}
                  style={{
                    flex: 1,
                    minWidth: "6px",
                    height: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${heightPct}%`,
                      backgroundColor: moodColor(p.mood),
                      borderRadius: "4px",
                      transition: "opacity 0.15s ease",
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <Section title="Mood by day of week" subtitle="Average mood, Sun–Sat">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "8px",
            alignItems: "end",
            height: "180px",
            paddingBottom: "8px",
          }}
        >
          {data.moodByDayOfWeek.map((d) => {
            const has = d.average !== null;
            const heightPct = has ? (Math.max(d.average ?? 0, 0.2) / 5) * 100 : 6;
            const color = has ? moodColor(Math.round(d.average ?? 0)) : "var(--border)";
            return (
              <div
                key={d.day}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  height: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "32px",
                      height: `${heightPct}%`,
                      backgroundColor: color,
                      opacity: has ? 1 : 0.4,
                      borderRadius: "6px",
                    }}
                  />
                </div>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  {d.label}
                </span>
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: has ? "var(--text-primary)" : "var(--text-secondary)",
                  }}
                >
                  {has ? (d.average ?? 0).toFixed(1) : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  suffix?: string;
}

function StatCard({ label, value, suffix }: StatCardProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "14px",
        padding: "16px 18px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "11px",
          fontWeight: 700,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "26px",
          color: "var(--text-primary)",
          letterSpacing: "-0.3px",
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
        }}
      >
        {value}
        {suffix && (
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--text-secondary)",
            }}
          >
            {suffix}
          </span>
        )}
      </span>
    </div>
  );
}

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, children }: SectionProps) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <div style={{ marginBottom: "14px" }}>
        <h2
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--text-primary)",
            marginBottom: "2px",
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              color: "var(--text-secondary)",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      <div
        style={{
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "14px",
          padding: "20px",
        }}
      >
        {children}
      </div>
    </section>
  );
}

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontSize: "13px",
        color: "var(--text-secondary)",
        fontStyle: "italic",
      }}
    >
      {children}
    </p>
  );
}
