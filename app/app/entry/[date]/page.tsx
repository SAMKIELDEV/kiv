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
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-[18px] text-text-secondary">No entry for this date</p>
        <a
          href="/app/history"
          className="inline-flex items-center gap-1.5 text-[14px] text-accent font-[600]"
        >
          ← Back to history
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <a
        href="/app/history"
        className="inline-flex items-center gap-1.5 text-[14px] text-text-secondary hover:text-text-primary transition-colors w-fit mb-[32px]"
      >
        ← History
      </a>

      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <span className="text-[12px] text-text-secondary">
            {formatDate(entry.date)}
          </span>
          <h1 className="text-[28px] font-[800] text-text-primary tracking-tight">
            {MOOD_EMOJIS[entry.mood as MoodValue]} Checked in
          </h1>
        </div>

        <div className="flex flex-col gap-10">
          {entry.promptResponse && (
            <div className="flex flex-col gap-2">
              <p className="text-[14px] text-text-secondary italic font-[400]">
                {entry.prompt}
              </p>
              <p className="text-[18px] text-text-primary leading-relaxed font-[400]">
                {entry.promptResponse}
              </p>
            </div>
          )}

          {entry.note && (
            <div className="flex flex-col gap-2">
              <p className="text-[18px] text-text-primary leading-relaxed whitespace-pre-wrap font-[400]">
                {entry.note}
              </p>
            </div>
          )}

          {!entry.promptResponse && !entry.note && (
            <div className="pt-8">
              <p className="text-[15px] text-text-secondary italic font-[400]">
                Just a mood check-in.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

