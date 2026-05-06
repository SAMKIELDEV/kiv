"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { Loader2, ChevronLeft } from "lucide-react";
import { MOOD_EMOJIS, MOOD_LABELS, type Entry, type MoodValue } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

export default function EntryDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchEntry = useCallback(async () => {
    try {
      const res = await fetch(`/api/entries/${date}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setEntry(data);
      }
    } catch {
      // No console.log
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchEntry();
  }, [fetchEntry]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={20} className="text-text-secondary animate-spin" />
      </div>
    );
  }

  const backLink = (
    <Link
      href="/app/history"
      className="flex items-center gap-1.5 font-medium text-[14px] text-text-secondary hover:text-text-primary transition-colors mb-8 no-underline group"
    >
      <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      History
    </Link>
  );

  if (notFound || !entry) {
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
          No entry for this date.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {backLink}

      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: "20px",
          color: "var(--text-secondary)",
          marginBottom: "24px",
        }}
      >
        {formatDate(entry.date)} at {formatTime(entry.createdAt)}
      </h1>

      <span
        style={{
          fontSize: "48px",
          display: "block",
          marginBottom: "24px",
          lineHeight: 1,
        }}
        role="img"
        aria-label={MOOD_LABELS[entry.mood as MoodValue]}
      >
        {MOOD_EMOJIS[entry.mood as MoodValue]}
      </span>

      {entry.factors && entry.factors.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
          {entry.factors.map((f: string) => (
            <span
              key={f}
              style={{
                padding: "2px 10px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-primary)",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      )}

      {entry.promptResponse && (
        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "13px",
              fontStyle: "italic",
              color: "var(--text-secondary)",
              marginBottom: "6px",
            }}
          >
            {entry.prompt}
          </p>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              color: "var(--text-primary)",
              lineHeight: 1.65,
            }}
          >
            {entry.promptResponse}
          </p>
        </div>
      )}

      {entry.note && (
        <div>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "8px",
            }}
          >
            Note
          </p>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "16px",
              color: "var(--text-primary)",
              lineHeight: 1.65,
              whiteSpace: "pre-wrap",
            }}
          >
            {entry.note}
          </p>
        </div>
      )}

      {!entry.promptResponse && !entry.note && (
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            fontStyle: "italic",
            color: "var(--text-secondary)",
          }}
        >
          No additional notes for this day.
        </p>
      )}
    </div>
  );
}
