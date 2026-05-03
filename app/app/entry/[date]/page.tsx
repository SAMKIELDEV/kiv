"use client";

import { useEffect, useState, useCallback, use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { MOOD_EMOJIS, type Entry, type MoodValue } from "@/types";
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
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-lg text-text-secondary">No entry for this date</p>
        <a
          href="/app/history"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:brightness-110"
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
      className="flex flex-col gap-10 animate-fade-in max-w-[480px] mx-auto w-full pt-4"
    >
      <a
        href="/app/history"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> History
      </a>

      <div className="flex flex-col gap-12 text-center">
        {/* Header */}
        <div className="flex flex-col items-center gap-6">
          <span className="text-7xl">
            {MOOD_EMOJIS[entry.mood as MoodValue]}
          </span>
          <h1 className="text-3xl sm:text-[40px] font-extrabold text-text-primary tracking-tight font-heading">
            {formatDate(entry.date)}
          </h1>
        </div>

        <div className="flex flex-col gap-10 text-left">
          {/* Prompt response */}
          {entry.promptResponse && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-text-secondary italic font-body">
                {entry.prompt}
              </p>
              <p className="text-lg text-text-primary leading-relaxed font-body">
                {entry.promptResponse}
              </p>
            </div>
          )}

          {/* Note */}
          {entry.note && (
            <div className="flex flex-col gap-3">
              <p className="text-lg text-text-primary leading-relaxed whitespace-pre-wrap font-body">
                {entry.note}
              </p>
            </div>
          )}

          {/* Empty state if no prompt response or note */}
          {!entry.promptResponse && !entry.note && (
            <div className="text-center pt-8">
              <p className="text-base text-text-secondary italic font-body">
                Just a mood check-in.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
