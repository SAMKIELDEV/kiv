"use client";

import { Entry, MOOD_EMOJIS, type MoodValue } from "@/types";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface TodayEntryProps {
  entry: Entry;
}

export default function TodayEntry({ entry }: TodayEntryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl">{MOOD_EMOJIS[entry.mood as MoodValue]}</span>
        <span className="text-sm font-semibold text-text-primary tracking-wide uppercase">
          {formatDate(entry.date)}
        </span>
      </div>

      <div className="flex flex-col gap-6 pl-2">
        {entry.promptResponse && (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-text-secondary italic font-body">{entry.prompt}</p>
            <p className="text-base text-text-primary leading-relaxed font-body">
              {entry.promptResponse}
            </p>
          </div>
        )}

        {entry.note && (
          <div className="flex flex-col gap-2">
            <p className="text-base text-text-primary leading-relaxed font-body">
              {entry.note}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
