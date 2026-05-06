"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Entry } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HistoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [loading, setLoading] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

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
      <div style={{ display: "flex", flexDirection: "column", width: "100%", paddingBottom: "80px" }}>
        <Skeleton className="h-9 w-[180px] mb-8" />
        
        {/* Month Selector Skeleton */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", marginBottom: "24px" }}>
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-6 w-[140px]" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>

        {/* Calendar Grid Skeleton */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "12px" }}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
            <div key={d} style={{ display: "flex", justifyContent: "center", paddingBottom: "12px" }}>
              <Skeleton key={d} className="h-3 w-8" />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <h1
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "26px",
          color: "var(--text-primary)",
          marginBottom: "32px",
          letterSpacing: "-0.5px",
        }}
      >
        History
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={prevMonth}
          aria-label="Previous month"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "17px",
            color: "var(--text-primary)",
            minWidth: "140px",
            textAlign: "center",
          }}
        >
          {formatMonthYear()}
        </div>
        <button
          onClick={nextMonth}
          aria-label="Next month"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            padding: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ width: "100%" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
          }}
        >
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div
              key={d}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "11px",
                color: "var(--text-secondary)",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                paddingBottom: "12px",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "2px",
          }}
        >
          {calendarDays.map((day, i) => {
            if (day === null) {
              return (
                <div
                  key={`pad-${i}`}
                  style={{ aspectRatio: "1 / 1" }}
                />
              );
            }

            const dateStr = getDateStr(day);
            const entry = entryMap.get(dateStr);
            const isToday = dateStr === todayStr;
            const hovered = hoveredDate === dateStr;

            const cellStyle: React.CSSProperties = {
              aspectRatio: "1 / 1",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              color: "var(--text-secondary)",
              backgroundColor: "transparent",
              transition: "opacity 0.15s ease",
            };

            if (entry && isToday) {
              cellStyle.backgroundColor = "var(--accent)";
              cellStyle.border = "2px solid var(--text-primary)";
              cellStyle.color = "#FFFFFF";
              cellStyle.fontWeight = 700;
              cellStyle.cursor = "pointer";
              cellStyle.opacity = hovered ? 0.85 : 1;
            } else if (entry) {
              cellStyle.backgroundColor = "var(--accent)";
              cellStyle.color = "#FFFFFF";
              cellStyle.fontWeight = 700;
              cellStyle.cursor = "pointer";
              cellStyle.opacity = hovered ? 0.85 : 1;
            } else if (isToday) {
              cellStyle.border = "1.5px solid var(--border)";
              cellStyle.color = "var(--text-primary)";
              cellStyle.fontWeight = 600;
            }

            return (
              <div
                key={dateStr}
                onClick={() => {
                  if (entry) window.location.href = `/app/entry/${dateStr}`;
                }}
                onMouseEnter={() => entry && setHoveredDate(dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
                style={cellStyle}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {entries.length === 0 && (
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            color: "var(--text-secondary)",
            textAlign: "center",
            padding: "48px 0",
          }}
        >
          No entries yet.
        </p>
      )}
    </div>
  );
}
