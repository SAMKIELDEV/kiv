"use client";

import { Entry, MOOD_EMOJIS, type MoodValue } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

interface TodayEntryProps {
  entry: Entry;
}

export function TodayEntry({ entry }: TodayEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 p-6 bg-surface border border-border rounded-[var(--radius-lg)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-muted" />
          <span className="text-sm text-text-secondary">
            {formatDate(entry.date)}
          </span>
        </div>
        <span className="text-2xl">{MOOD_EMOJIS[entry.mood as MoodValue]}</span>
      </div>

      {entry.promptResponse && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-text-muted font-medium">{entry.prompt}</p>
          <p className="text-sm text-text-primary leading-relaxed">
            {entry.promptResponse}
          </p>
        </div>
      )}

      {entry.note && (
        <div className="flex flex-col gap-1.5">
          <p className="text-xs text-text-muted font-medium">Note</p>
          <p className="text-sm text-text-primary leading-relaxed">
            {entry.note}
          </p>
        </div>
      )}
    </motion.div>
  );
}
