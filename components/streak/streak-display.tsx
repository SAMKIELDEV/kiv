"use client";

import { motion } from "framer-motion";
import { Flame, Trophy } from "lucide-react";
import type { StreakData } from "@/types";

interface StreakDisplayProps {
  streak: StreakData | null;
}

export function StreakDisplay({ streak }: StreakDisplayProps) {
  return (
    <div className="flex flex-row gap-[12px]">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 px-[20px] py-[12px] bg-[#111111] border border-[#222222] rounded-[12px]"
      >
        <Flame className="w-4 h-4 text-accent" />
        <div className="flex flex-col">
          <span className="text-xs text-text-muted font-medium">Streak</span>
          <span className="text-lg font-bold text-text-primary leading-tight">
            {streak ? streak.current : "—"}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 px-[20px] py-[12px] bg-[#111111] border border-[#222222] rounded-[12px]"
      >
        <Trophy className="w-4 h-4 text-text-muted" />
        <div className="flex flex-col">
          <span className="text-xs text-text-muted font-medium">Best</span>
          <span className="text-lg font-bold text-text-primary leading-tight">
            {streak ? streak.longest : "—"}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
