"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CheckInForm } from "@/components/checkin/check-in-form";
import TodayEntry from "@/components/checkin/today-entry";
import { StreakDisplay } from "@/components/streak/streak-display";
import { getGreeting, getTodayDateString } from "@/lib/utils";
import { getTodaysPrompt } from "@/lib/prompts";
import type { Entry, StreakData } from "@/types";

export default function DashboardPage() {
  const [todayEntry, setTodayEntry] = useState<Entry | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const today = getTodayDateString();
      const [entryRes, streakRes] = await Promise.all([
        fetch(`/api/entries/${today}`),
        fetch("/api/entries/streak"),
      ]);

      if (entryRes.ok) {
        const entry = await entryRes.json();
        setTodayEntry(entry);
      }

      if (streakRes.ok) {
        const data = await streakRes.json();
        setStreak(data);
      }

      // Get user name from embedded script
      const userScript = document.getElementById("user-data");
      if (userScript) {
        const user = JSON.parse(userScript.textContent || "{}");
        setUserName(user.name || "");
      }
    } catch {
      // Error handling without console.log
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleCheckInComplete(entry: Entry) {
    setTodayEntry(entry);
    // Refresh streak
    fetch("/api/entries/streak")
      .then((res) => res.json())
      .then(setStreak)
      .catch(() => {});
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {/* Greeting + Streak */}
      <div className="flex flex-col">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[28px] md:text-[36px] font-[800] text-text-primary tracking-[-0.5px] leading-tight"
        >
          {getGreeting(userName || "there")}
        </motion.h1>
        <div className="mt-[16px]">
          <StreakDisplay streak={streak} />
        </div>
      </div>

      <div className="h-[1px] bg-border my-[28px]" />

      {/* Check-in or Today's Entry */}
      {todayEntry ? (
        <div className="flex flex-col">
          <p className="text-[15px] font-[600] text-accent mb-[20px]">
            Checked in today ✓
          </p>
          <TodayEntry entry={todayEntry} />
          <Link
            href="/app/history"
            className="inline-flex items-center gap-1.5 text-[14px] text-accent hover:opacity-80 mt-[20px] w-fit font-[600] transition-opacity"
          >
            View history →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          <h2 className="text-[11px] font-[600] text-text-secondary uppercase tracking-[2px] mb-[20px]">
            Today
          </h2>
          <CheckInForm
            prompt={getTodaysPrompt()}
            onComplete={handleCheckInComplete}
          />
        </div>
      )}
    </div>
  );
}

// Add missing Link import
import Link from "next/link";

