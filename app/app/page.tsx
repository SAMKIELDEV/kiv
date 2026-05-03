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
    } catch (error) {
      console.error("Dashboard fetch error:", error);
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
      .catch(console.error);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-in w-full max-w-[480px] mx-auto">
      {/* Greeting + Streak */}
      <div className="flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-[800] text-text-primary tracking-tight font-heading leading-tight text-[clamp(28px,5vw,48px)]"
        >
          {getGreeting(userName || "there")}
        </motion.h1>
        <StreakDisplay streak={streak} />
      </div>

      <hr className="border-t border-border" />

      {/* Check-in or Today's Entry */}
      {todayEntry ? (
        <div className="flex flex-col gap-8">
          <p className="text-sm font-semibold text-accent tracking-wide uppercase">
            You&apos;ve checked in today ✓
          </p>
          <TodayEntry entry={todayEntry} />
          <a
            href="/app/history"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:brightness-110 mt-2 w-fit font-medium transition-colors"
          >
            View history <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mt-[32px] mb-[16px]">
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
