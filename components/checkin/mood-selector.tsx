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
    <div className="flex gap-3 sm:gap-4 w-full">
      {moods.map((mood) => (
        <motion.button
          key={mood}
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(mood)}
          className={cn(
            "flex items-center justify-center aspect-square rounded-[var(--radius-sm)] border transition-all duration-200 cursor-pointer flex-1",
            value === mood
              ? "bg-accent/10 border-accent"
              : "bg-surface-raised border-border hover:border-border/80 hover:-translate-y-1"
          )}
        >
          <span className="text-3xl sm:text-4xl" role="img" aria-label={MOOD_LABELS[mood]}>
            {MOOD_EMOJIS[mood]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}
