"use client";

import { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { Loader2, ChevronLeft } from "lucide-react";
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
      <div className="flex flex-col w-full font-sans">
        {backLink}
        <p className="text-[14px] text-text-secondary italic">
          No entry for this date.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full font-sans pb-20">
      {backLink}

      <h1 className="font-bold text-[20px] text-text-secondary mb-6">
        {formatDate(entry.date)}
      </h1>

      <span
        className="text-[48px] block mb-6 leading-none"
        role="img"
        aria-label={MOOD_LABELS[entry.mood as MoodValue]}
      >
        {MOOD_EMOJIS[entry.mood as MoodValue]}
      </span>

      {entry.factors && entry.factors.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {entry.factors.map((f: string) => (
            <span
              key={f}
              className="px-3 py-1 bg-surface border border-border rounded-full text-[13px] font-medium text-text-primary"
            >
              {f}
            </span>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {entry.promptResponse && (
          <div>
            <p className="italic text-[13px] text-text-secondary mb-1.5">
              {entry.prompt}
            </p>
            <p className="text-[16px] text-text-primary leading-relaxed">
              {entry.promptResponse}
            </p>
          </div>
        )}

        {entry.note && (
          <div>
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-widest mb-2">
              Note
            </p>
            <p className="text-[16px] text-text-primary leading-relaxed whitespace-pre-wrap">
              {entry.note}
            </p>
          </div>
        )}

        {!entry.promptResponse && !entry.note && (
          <p className="text-[14px] text-text-secondary italic">
            No additional notes for this day.
          </p>
        )}
      </div>
    </div>
  );
}
