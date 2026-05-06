"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2, Trash2, ArrowRight, Smartphone, Download } from "lucide-react";
import { toast } from "sonner";
import { NotificationToggle } from "@/components/NotificationToggle";
import { NotificationTest } from "@/components/NotificationTest";
import { Skeleton } from "@/components/ui/Skeleton";

interface UserInfo {
  name: string;
  email: string;
}

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";

export default function SettingsPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if PWA installation is possible
    const checkInstallable = () => {
      setCanInstall(!!(window as any).canInstallPWA);
    };

    checkInstallable();
    const interval = setInterval(checkInstallable, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch {
      // No console.log
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function handleDeleteData() {
    setDeleting(true);
    try {
      const res = await fetch("/api/me", { method: "DELETE" });
      if (res.ok) {
        toast.success("All your Kiv data has been deleted");
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        toast.error("Failed to delete data");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", paddingBottom: "80px" }}>
        <Skeleton className="h-9 w-[150px] mb-8" />
        
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: "48px" }}>
            <Skeleton className="h-3 w-[80px] mb-4" />
            <div style={{ borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <div style={{ borderBottom: "1px solid var(--border)", padding: "16px 0" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const sectionLabel: React.CSSProperties = {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: "12px",
  };

  const rowBase: React.CSSProperties = {
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

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", paddingBottom: "80px" }}>
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
        Settings
      </h1>

      {/* ACCOUNT SECTION */}
      <div style={{ marginBottom: "48px" }}>
        <p style={sectionLabel}>Account</p>
        <div style={rowBase}>
          <span style={labelStyle}>Name</span>
          <span style={valueStyle}>{user?.name || "—"}</span>
        </div>
        <div style={rowBase}>
          <span style={labelStyle}>Email</span>
          <span style={valueStyle}>{user?.email || "—"}</span>
        </div>
        <a
          href={ACCOUNTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            textDecoration: "none",
            color: "var(--accent)",
          }}
        >
          <span style={{ ...labelStyle, color: "var(--accent)" }}>SAMKIEL ID Settings</span>
          <ArrowRight size={14} />
        </a>
      </div>

      {/* APP SECTION */}
      {canInstall && (
        <div style={{ marginBottom: "48px" }}>
          <p style={sectionLabel}>App</p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 0",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(196, 149, 106, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                <Smartphone size={18} />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={valueStyle}>Install Kiv</span>
                <span style={{ ...labelStyle, fontSize: "12px", marginTop: "2px" }}>
                  Add to your home screen for a native experience.
                </span>
              </div>
            </div>
            <button
              onClick={() => (window as any).triggerPWAInstall?.()}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                color: "var(--text-primary)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Download size={14} />
              Install
            </button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS SECTION */}
      <div style={{ marginBottom: "48px" }}>
        <p style={sectionLabel}>Reminders</p>
        <NotificationToggle />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <NotificationTest />
        </div>
      </div>

      {/* DATA MANAGEMENT SECTION */}
      <div style={{ marginBottom: "48px" }}>
        <p style={sectionLabel}>Data Management</p>
        

        {!confirmDelete ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "24px 0",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "var(--destructive)",
                }}
              >
                Delete all data
              </span>
              <span
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "2px",
                }}
              >
                Permanently removes all your Kiv check-ins.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                color: "var(--destructive)",
                backgroundColor: "transparent",
                border: "1px solid var(--destructive)",
                borderRadius: "8px",
                padding: "6px 14px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--destructive)";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--destructive)";
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div style={{ padding: "24px 16px", backgroundColor: "rgba(239, 68, 68, 0.05)", borderRadius: "12px", border: "1px solid rgba(239, 68, 68, 0.2)", marginTop: "16px" }}>
            <p
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "14px",
                color: "var(--text-primary)",
                fontWeight: 600,
              }}
            >
              Delete everything?
            </p>
            <p style={{ ...labelStyle, fontSize: "12px", marginTop: "4px" }}>
              This action is irreversible. All your logs will be lost forever.
            </p>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: deleting ? "not-allowed" : "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteData}
                disabled={deleting}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: "13px",
                  backgroundColor: "var(--destructive)",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  cursor: deleting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                <Trash2 size={14} />
                Delete forever
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
