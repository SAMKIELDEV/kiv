"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, RefreshCw, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/Skeleton";

export function WeeklyReflection() {
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  async function fetchReflection() {
    setLoading(true);
    setError(null);
    setIsRevealed(false);
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
      <div style={{ marginTop: "32px", padding: "24px", backgroundColor: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
          <Skeleton className="w-4 h-4 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-5 w-full mb-3" />
        <Skeleton className="h-5 w-[90%] mb-3" />
        <Skeleton className="h-5 w-[70%]" />
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
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
        
        {isRevealed && (
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
          </button>
        )}
      </div>

      <div style={{ position: "relative", minHeight: "60px" }}>
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            <motion.div
              key="cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              onClick={() => setIsRevealed(true)}
              style={{
                cursor: "pointer",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                background: "rgba(var(--bg-rgb), 0.4)",
                backdropFilter: "blur(8px)",
                borderRadius: "12px",
                border: "1px dashed var(--border)",
              }}
            >
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "rgba(196, 149, 106, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--accent)"
              }}>
                <Eye size={20} />
              </div>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-secondary)",
                margin: 0
              }}>
                Tap to reveal your reflection
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "var(--text-primary)",
                  marginBottom: 0,
                }}
              >
                {reflection}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
