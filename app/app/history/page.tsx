"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Entry } from "@/types";
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
    
    // JS getDay(): 0=Sun, 1=Mon, ..., 6=Sat
    // We want Mon=0, Tue=1, ..., Sun=6
    let startPad = firstDay.getDay() - 1;
    if (startPad < 0) startPad = 6;
    
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];

    // Padding for start of month
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= totalDays; d++) days.push(d);

    return days;
  }, [currentMonth]);

  function formatMonthYear(offset = 0) {
    const date = new Date(currentMonth.year, currentMonth.month + offset);
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
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 w-full animate-fade-in">
      <h1 className="text-[40px] font-extrabold text-text-primary tracking-tight font-heading">
        History
      </h1>

      {/* Month navigation */}
      <div className="flex items-center justify-center gap-4 text-text-secondary">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-surface-raised transition-colors cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4 sm:gap-8 font-medium">
          <span className="hidden sm:inline opacity-50">{formatMonthYear(-1)}</span>
          <span className="text-lg font-semibold text-text-primary min-w-[120px] text-center">{formatMonthYear()}</span>
          <span className="hidden sm:inline opacity-50">{formatMonthYear(1)}</span>
        </div>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-surface-raised transition-colors cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="w-full max-w-[400px] mx-auto">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              className="text-center text-xs text-text-secondary font-medium py-1"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-2">
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
                whileHover={entry ? { scale: 1.1 } : undefined}
                whileTap={entry ? { scale: 0.95 } : undefined}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-full text-base transition-colors relative",
                  entry
                    ? "cursor-pointer bg-accent text-accent-text font-bold"
                    : "cursor-default text-text-primary",
                  isToday && !entry && "border border-border",
                  isToday && entry && "ring-2 ring-accent ring-offset-2 ring-offset-background"
                )}
                onClick={() => {
                  if (entry) window.location.href = `/app/entry/${dateStr}`;
                }}
              >
                <span className="relative z-10">
                  {day}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {entries.length === 0 && (
        <p className="text-sm text-text-secondary text-center py-4">
          No entries yet. Start your first check-in!
        </p>
      )}
    </div>
  );
}
