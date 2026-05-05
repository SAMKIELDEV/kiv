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
      className="bg-surface border border-border rounded-[12px] padding-[20px] flex flex-col gap-[20px]"
      style={{ padding: '20px' }}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[12px] text-text-secondary">
          {formatDate(entry.date)}
        </span>
        <span className="text-[36px] leading-tight">
          {MOOD_EMOJIS[entry.mood as MoodValue]}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {entry.promptResponse && (
          <div className="flex flex-col gap-1">
            <p className="text-[14px] text-text-secondary italic font-[400]">
              {entry.prompt}
            </p>
            <p className="text-[15px] text-text-primary leading-relaxed font-[400]">
              {entry.promptResponse}
            </p>
          </div>
        )}

        {entry.note && (
          <div className="flex flex-col gap-1">
            <p className="text-[15px] text-text-primary leading-relaxed font-[400]">
              {entry.note}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

