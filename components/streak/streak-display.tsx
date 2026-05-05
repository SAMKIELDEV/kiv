"use client";

import { motion } from "framer-motion";
import type { StreakData } from "@/types";

interface StreakDisplayProps {
  streak: StreakData | null;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="flex flex-row gap-[10px]">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 px-[16px] py-[8px] bg-surface border border-border rounded-[8px]"
      >
        <span className="text-[14px] font-[600] text-text-primary">
          🔥 {streak ? streak.current : "0"} day streak
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 px-[16px] py-[8px] bg-surface border border-border rounded-[8px]"
      >
        <span className="text-[14px] font-[400] text-text-secondary">
          🏆 Best: {streak ? streak.longest : "0"}
        </span>
      </motion.div>
    </div>
  );
}

