"use client";

import { useEffect, useState, useCallback, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
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
    } catch (error) {
      console.error("Failed to fetch entry:", error);
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
        <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse" />
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg text-text-secondary">No entry for this date</p>
        <a
          href="/app/history"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to history
        </a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6 animate-fade-in"
    >
      <a
        href="/app/history"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to history
      </a>

      <div className="flex flex-col gap-6 p-6 bg-surface border border-border rounded-[var(--radius-lg)]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            {formatDate(entry.date)}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-3xl">
              {MOOD_EMOJIS[entry.mood as MoodValue]}
            </span>
            <span className="text-sm text-text-secondary">
              {MOOD_LABELS[entry.mood as MoodValue]}
            </span>
          </div>
        </div>

        {/* Prompt response */}
        {entry.promptResponse && (
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
              {entry.prompt}
            </p>
            <p className="text-sm text-text-primary leading-relaxed">
              {entry.promptResponse}
            </p>
          </div>
        )}

        {/* Note */}
        {entry.note && (
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            <p className="text-xs text-text-muted font-medium uppercase tracking-wider">
              Note
            </p>
            <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
              {entry.note}
            </p>
          </div>
        )}

        {/* Empty state if no prompt response or note */}
        {!entry.promptResponse && !entry.note && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-text-muted italic">
              Just a mood check-in — sometimes that&apos;s enough.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
