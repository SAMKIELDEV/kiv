"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";

export function WeeklyReflection() {
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchReflection() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/reflections/weekly");
      const data = await res.json();
      if (res.ok) {
        setReflection(data.reflection);
      } else {
        setError(data.error || "Failed to load reflection");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReflection();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Loader2 size={20} className="animate-spin text-accent" />
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          Consulting the stars...
        </p>
      </div>
    );
  }

  if (error) return null;

  return (
    <div
      style={{
        marginTop: "32px",
        padding: "24px",
        backgroundColor: "rgba(var(--accent-rgb), 0.04)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <Sparkles size={16} style={{ color: "var(--accent)" }} />
        <span
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700,
            fontSize: "12px",
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          Weekly Insight
        </span>
      </div>

      <p
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: "15px",
          lineHeight: 1.6,
          color: "var(--text-primary)",
          marginBottom: "16px",
        }}
      >
        {reflection}
      </p>

      <button
        onClick={fetchReflection}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "12px",
          color: "var(--text-secondary)",
          padding: 0,
          opacity: 0.6,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
      >
        <RefreshCw size={12} />
        Regenerate
      </button>
    </div>
  );
}
