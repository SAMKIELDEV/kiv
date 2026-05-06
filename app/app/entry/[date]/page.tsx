"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { MOOD_EMOJIS, MOOD_LABELS, type Entry, type MoodValue } from "@/types";
import { formatDate } from "@/lib/utils";

export default function EntryDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = use(params);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [backHovered, setBackHovered] = useState(false);

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

  const backLink = (
    <Link
      href="/app/history"
      onMouseEnter={() => setBackHovered(true)}
      onMouseLeave={() => setBackHovered(false)}
      style={{
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 500,
        fontSize: "14px",
        color: backHovered ? "var(--text-primary)" : "var(--text-secondary)",
        textDecoration: "none",
        marginBottom: "32px",
        display: "inline-block",
        transition: "color 0.15s ease",
      }}
    >
      ← History
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
        {formatDate(entry.date)}
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
