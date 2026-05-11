"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Loader2, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ReminderChannels } from "@/types";

const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      out.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
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
  const [pushOn, setPushOn] = useState(false);
  const [emailOn, setEmailOn] = useState(false);

  useEffect(() => {
    const detected = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    setTimezone(detected);
  }, []);

  const fetchReminders = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = (await res.json()) as UserReminders;
        if (data.reminderTime) setTime(data.reminderTime);
        if (data.reminderChannels) {
          setPushOn(!!data.reminderChannels.push);
          setEmailOn(!!data.reminderChannels.email);
        }
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  async function save(next: {
    time: string;
    push: boolean;
    email: boolean;
  }) {
    if (!timezone) return;
    setSaving(true);
    try {
      const res = await fetch("/api/me/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reminderTime: next.time,
          reminderTimezone: timezone,
          reminderChannels: { push: next.push, email: next.email },
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
    save({ time: v, push: pushOn, email: emailOn });
  }

  function handlePushToggle() {
    const v = !pushOn;
    setPushOn(v);
    save({ time, push: v, email: emailOn });
  }

  function handleEmailToggle() {
    const v = !emailOn;
    setEmailOn(v);
    save({ time, push: pushOn, email: v });
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
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-6 w-[40px]" />
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
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
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

      <ToggleRow
        title="Push notification"
        subtitle="Send a browser push at your reminder time."
        on={pushOn}
        onToggle={handlePushToggle}
        disabled={saving}
      />

      <ToggleRow
        title="Email"
        subtitle="Send an email at your reminder time."
        on={emailOn}
        onToggle={handleEmailToggle}
        disabled={saving}
      />
    </>
  );
}

function ToggleRow({
  title,
  subtitle,
  on,
  onToggle,
  disabled,
}: {
  title: string;
  subtitle: string;
  on: boolean;
  onToggle: () => void;
  disabled: boolean;
}) {
  return (
    <div style={rowStyle}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={valueStyle}>{title}</span>
        <span style={subLabelStyle}>{subtitle}</span>
      </div>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        aria-pressed={on}
        style={{
          position: "relative",
          width: "40px",
          height: "24px",
          borderRadius: "999px",
          border: "1px solid var(--border)",
          backgroundColor: on ? "var(--accent)" : "var(--surface)",
          cursor: disabled ? "not-allowed" : "pointer",
          padding: 0,
          transition: "background-color 0.15s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: on ? "18px" : "2px",
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            backgroundColor: on ? "#0F0E0D" : "var(--text-secondary)",
            transition: "left 0.15s ease",
          }}
        />
      </button>
    </div>
  );
}
