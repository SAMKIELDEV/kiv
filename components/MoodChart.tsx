"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface MoodPoint {
  date: string;
  mood: number;
}

export function MoodChart() {
  const [data, setData] = useState<MoodPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/entries?limit=7");
        if (res.ok) {
          const entries = await res.json();
          // Sort by date ascending and map to {date, mood}
          const points = entries
            .map((e: any) => ({
              date: e.date,
              mood: Number(e.mood),
            }))
            .sort((a: any, b: any) => a.date.localeCompare(b.date));
          setData(points);
        }
      } catch {
        // Quiet fail
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ marginTop: "32px", padding: "24px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
          <Skeleton className="h-2 w-12" />
          <Skeleton className="h-2 w-8" />
        </div>
      </div>
    );
  }

  if (data.length < 2) return null;

  // SVG Logic
  const width = 600;
  const height = 100;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Mood values are 1-5. Map 1 to bottom, 5 to top.
  const getX = (index: number) => padding + (index / (data.length - 1)) * chartWidth;
  const getY = (mood: number) => padding + chartHeight - ((mood - 1) / 4) * chartHeight;

  const points = data.map((p, i) => `${getX(i)},${getY(p.mood)}`).join(" ");
  
  return (
    <div
      style={{
        marginTop: "32px",
        padding: "24px",
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
        <TrendingUp size={16} style={{ color: "var(--text-secondary)" }} />
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "12px",
            color: "var(--text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          7-Day Trend
        </span>
      </div>

      <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: "100%", height: "auto", overflow: "visible" }}
        >
          {/* Grid lines (horizontal) */}
          {[1, 2, 3, 4, 5].map((m) => (
            <line
              key={m}
              x1="0"
              y1={getY(m)}
              x2={width}
              y2={getY(m)}
              stroke="var(--border)"
              strokeWidth="0.5"
              strokeDasharray="4,4"
            />
          ))}

          {/* Gradient for the line */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* The Line */}
          <polyline
            points={points}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots on points */}
          {data.map((p, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(p.mood)}
              r="4"
              fill="var(--bg)"
              stroke={i === data.length - 1 ? "var(--accent)" : "var(--border)"}
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
        <span style={{ fontSize: "10px", color: "var(--text-secondary)", opacity: 0.5 }}>
          {new Date(data[0].date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>
        <span style={{ fontSize: "10px", color: "var(--text-secondary)", opacity: 0.5 }}>
          Today
        </span>
      </div>
    </div>
  );
}
