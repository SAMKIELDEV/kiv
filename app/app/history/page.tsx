"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MOOD_EMOJIS, type Entry, type MoodValue } from "@/types";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch("/api/entries");
      if (res.ok) {
        const data = await res.json();
        setEntries(data);
      }
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const entryMap = useMemo(() => {
    const map = new Map<string, Entry>();
    entries.forEach((e) => map.set(e.date, e));
    return map;
  }, [entries]);

  const calendarDays = useMemo(() => {
    const { year, month } = currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay(); // 0=Sun
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];

    // Padding for start of month
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);

    return days;
  }, [currentMonth]);

  function formatMonthYear() {
    const date = new Date(currentMonth.year, currentMonth.month);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  function prevMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 };
      return { ...prev, month: prev.month - 1 };
    });
  }

  function nextMonth() {
    setCurrentMonth((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 };
      return { ...prev, month: prev.month + 1 };
    });
  }

  function getDateStr(day: number): string {
    const m = String(currentMonth.month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${currentMonth.year}-${m}-${d}`;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-text-primary tracking-tight">
        History
      </h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 rounded-[var(--radius-sm)] hover:bg-surface transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-text-secondary" />
        </button>
        <span className="text-base font-semibold text-text-primary">
          {formatMonthYear()}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-[var(--radius-sm)] hover:bg-surface transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-xs text-text-muted font-medium py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`pad-${i}`} className="aspect-square" />;
            }

            const dateStr = getDateStr(day);
            const entry = entryMap.get(dateStr);
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <motion.div
                key={dateStr}
                whileHover={entry ? { scale: 1.05 } : undefined}
                className={cn(
                  "aspect-square flex flex-col items-center justify-center rounded-[var(--radius-sm)] text-sm transition-colors relative",
                  entry
                    ? "cursor-pointer hover:bg-surface-hover"
                    : "cursor-default",
                  isToday && "ring-1 ring-accent/30"
                )}
                onClick={() => {
                  if (entry) window.location.href = `/app/entry/${dateStr}`;
                }}
              >
                <span
                  className={cn(
                    "text-xs",
                    entry ? "text-text-primary font-medium" : "text-text-muted"
                  )}
                >
                  {day}
                </span>
                {entry && (
                  <span className="text-xs mt-0.5">
                    {MOOD_EMOJIS[entry.mood as MoodValue]}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {entries.length === 0 && (
        <p className="text-sm text-text-muted text-center py-4">
          No entries yet. Start your first check-in!
        </p>
      )}
    </div>
  );
}
