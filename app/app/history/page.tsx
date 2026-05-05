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
    } catch {
      // No console.log
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
    
    let startPad = firstDay.getDay() - 1;
    if (startPad < 0) startPad = 6;
    
    const totalDays = lastDay.getDate();

    const days: (number | null)[] = [];

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
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-[800] text-text-primary tracking-tight mb-[32px]">
        History
      </h1>

      {/* Month navigation */}
      <div className="flex items-center justify-center gap-4 mb-[24px]">
        <button
          onClick={prevMonth}
          className="p-2 text-text-secondary hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="text-[18px] font-[700] text-text-primary min-w-[140px] text-center">
          {formatMonthYear()}
        </div>
        <button
          onClick={nextMonth}
          className="p-2 text-text-secondary hover:opacity-70 transition-opacity cursor-pointer"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="w-full">
        <div className="grid grid-cols-7 gap-[4px] mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              className="text-center text-[12px] text-text-secondary font-[600] pb-2 uppercase"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-[4px]">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`pad-${i}`} className="aspect-square" />;
            }

            const dateStr = getDateStr(day);
            const entry = entryMap.get(dateStr);
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <div
                key={dateStr}
                onClick={() => {
                  if (entry) window.location.href = `/app/entry/${dateStr}`;
                }}
                className={cn(
                  "aspect-square flex items-center justify-center rounded-[8px] text-[14px] font-[400] text-text-secondary relative transition-opacity",
                  entry
                    ? "bg-accent text-accent-dark font-[700] cursor-pointer hover:opacity-85"
                    : "",
                  isToday && !entry ? "border border-border text-text-primary font-[600]" : ""
                )}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {entries.length === 0 && (
        <p className="text-[14px] text-text-secondary text-center py-12">
          No entries yet.
        </p>
      )}
    </div>
  );
}

