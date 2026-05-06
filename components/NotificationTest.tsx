"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

export function NotificationTest() {
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/test", { method: "POST" });
      if (res.ok) {
        toast.success("Test notification sent!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send test notification");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleTest}
      disabled={loading}
      style={{
        marginTop: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "transparent",
        border: "none",
        color: "var(--text-secondary)",
        fontSize: "12px",
        cursor: "pointer",
        padding: "4px 8px",
        borderRadius: "4px",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--text-primary)";
        e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--text-secondary)";
        e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
      Send test notification
    </button>
  );
}
