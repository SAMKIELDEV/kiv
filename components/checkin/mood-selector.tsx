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
    <div className="grid grid-cols-5 gap-[12px] w-full">
      {moods.map((mood) => (
        <motion.button
          key={mood}
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(mood)}
          className={cn(
            "flex items-center justify-center aspect-square rounded-[12px] border transition-all duration-150 cursor-pointer w-full text-[28px]",
            value === mood
              ? "bg-accent/15 border-accent"
              : "bg-surface border-border hover:border-text-secondary"
          )}
        >
          <span role="img" aria-label={MOOD_LABELS[mood]}>
            {MOOD_EMOJIS[mood]}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

