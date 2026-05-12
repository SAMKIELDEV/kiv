"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ReminderChannels } from "@/types";

function formatTime12(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

const TIME_OPTIONS: { value: string; label: string }[] = (() => {
  const out: { value: string; label: string }[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      out.push({ value, label: formatTime12(value) });
    }
  }
  return out;
})();

const DEFAULT_TIME = "20:00";

interface UserReminders {
  reminderTime?: string;
  reminderTimezone?: string;
  reminderChannels?: ReminderChannels;
}

const rowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 0",
  borderBottom: "1px solid var(--border)",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 500,
  fontSize: "14px",
  color: "var(--text-secondary)",
};

const valueStyle: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontWeight: 600,
  fontSize: "14px",
  color: "var(--text-primary)",
};

const subLabelStyle: React.CSSProperties = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: "11px",
  color: "var(--text-secondary)",
  marginTop: "2px",
  letterSpacing: "0.2px",
};

export function ReminderSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [time, setTime] = useState<string>(DEFAULT_TIME);
  const [timezone, setTimezone] = useState<string>("");
  const [emailOn, setEmailOn] = useState(true);

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    setTimezone(detected);
  }, []);

  const persistDefaults = useCallback(
    async (timeValue: string, tz: string) => {
      try {
        await fetch("/api/me/reminders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reminderTime: timeValue,
            reminderTimezone: tz,
            reminderChannels: { email: true },
          }),
        });
      } catch {
        // silent
      }
    },
    []
  );

  const fetchReminders = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = (await res.json()) as UserReminders;
        if (data.reminderTime) setTime(data.reminderTime);
        const explicitEmail = data.reminderChannels?.email;
        if (typeof explicitEmail === "boolean") {
          setEmailOn(explicitEmail);
        } else {
          const tz =
            data.reminderTimezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone ||
            "UTC";
          persistDefaults(data.reminderTime || DEFAULT_TIME, tz);
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [persistDefaults]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  async function save(next: { time: string; email: boolean }) {
    if (!timezone) return;
    setSaving(true);
    try {
      const res = await fetch("/api/me/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reminderTime: next.time,
          reminderTimezone: timezone,
          reminderChannels: { email: next.email },
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Reminder preferences saved");
    } catch {
      toast.error("Could not save preferences");
    } finally {
      setSaving(false);
    }
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setTime(v);
    save({ time: v, email: emailOn });
  }

  function handleEmailToggle() {
    const v = !emailOn;
    setEmailOn(v);
    save({ time, email: v });
  }

  if (loading) {
    return (
      <>
        <div style={rowStyle}>
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
        <div style={rowStyle}>
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[140px]" />
        </div>
        <div style={rowStyle}>
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-6 w-[40px]" />
        </div>
      </>
    );
  }

  return (
    <>
      <div style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Clock size={14} style={{ color: "var(--text-secondary)" }} />
          <span style={labelStyle}>Time</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {saving && <Loader2 size={12} className="animate-spin" style={{ color: "var(--text-secondary)" }} />}
          <select
            value={time}
            onChange={handleTimeChange}
            disabled={saving}
            aria-label="Reminder time"
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              color: "var(--text-primary)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "6px 10px",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={rowStyle}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={labelStyle}>Timezone</span>
          <span style={subLabelStyle}>Detected automatically</span>
        </div>
        <span style={valueStyle}>{timezone || "—"}</span>
      </div>

      <div style={rowStyle}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={valueStyle}>Email reminder</span>
          <span style={subLabelStyle}>Also send an email at your reminder time.</span>
        </div>
        <button
          type="button"
          onClick={handleEmailToggle}
          disabled={saving}
          aria-label={`Email reminder: ${emailOn ? "on" : "off"}`}
          style={{
            position: "relative",
            width: "40px",
            height: "24px",
            borderRadius: "999px",
            border: "1px solid var(--border)",
            backgroundColor: emailOn ? "var(--accent)" : "var(--surface)",
            cursor: saving ? "not-allowed" : "pointer",
            padding: 0,
            transition: "background-color 0.15s ease",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "2px",
              left: emailOn ? "18px" : "2px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: emailOn ? "#0F0E0D" : "var(--text-secondary)",
              transition: "left 0.15s ease",
            }}
          />
        </button>
      </div>
    </>
  );
}
