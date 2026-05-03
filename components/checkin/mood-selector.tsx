"use client";

import { motion } from "framer-motion";
import { MOOD_EMOJIS, MOOD_LABELS, type MoodValue } from "@/types";
import { cn } from "@/lib/utils";

interface MoodSelectorProps {
  value: MoodValue | null;
  onChange: (mood: MoodValue) => void;
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const moods: MoodValue[] = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm text-text-secondary font-medium">
        How are you feeling?
      </label>
      <div className="flex gap-3">
        {moods.map((mood) => (
          <motion.button
            key={mood}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(mood)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-3 rounded-[var(--radius-lg)] border transition-all duration-200 cursor-pointer flex-1",
              value === mood
                ? "bg-accent/10 border-accent/40 shadow-[0_0_12px_rgba(232,255,71,0.1)]"
                : "bg-surface border-border hover:border-border/80 hover:bg-surface-hover"
            )}
          >
            <span className="text-2xl" role="img" aria-label={MOOD_LABELS[mood]}>
              {MOOD_EMOJIS[mood]}
            </span>
            <span
              className={cn(
                "text-xs font-medium transition-colors",
                value === mood ? "text-accent" : "text-text-muted"
              )}
            >
              {MOOD_LABELS[mood]}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
