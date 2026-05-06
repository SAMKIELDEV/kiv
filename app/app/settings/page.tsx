"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [hoverDelete, setHoverDelete] = useState(false);

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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 0",
        }}
      >
        <Loader2 size={20} style={{ color: "var(--text-secondary)" }} className="animate-spin" />
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
        Settings
      </h1>

      <p style={sectionLabel}>Account</p>

      <div style={rowBase}>
        <span style={labelStyle}>Name</span>
        <span style={valueStyle}>{user?.name || "—"}</span>
      </div>

      <div style={rowBase}>
        <span style={labelStyle}>Email</span>
        <span style={valueStyle}>{user?.email || "—"}</span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 0",
        }}
      >
        <span style={labelStyle}>Manage account</span>
        <a
          href={ACCOUNTS_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 600,
            fontSize: "13px",
            color: "var(--accent)",
            textDecoration: "none",
          }}
        >
          account.samkiel.tech →
        </a>
      </div>

      <div style={{ height: "40px" }} />

      <p style={sectionLabel}>Data</p>

      {!confirmDelete ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
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
              Delete all Kiv data
            </span>
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginTop: "2px",
              }}
            >
              This permanently removes all your check-ins and cannot be undone.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            onMouseEnter={() => setHoverDelete(true)}
            onMouseLeave={() => setHoverDelete(false)}
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              color: hoverDelete ? "#FFFFFF" : "var(--destructive)",
              backgroundColor: hoverDelete ? "var(--destructive)" : "transparent",
              border: "1px solid var(--destructive)",
              borderRadius: "8px",
              padding: "6px 14px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
          >
            Delete
          </button>
        </div>
      ) : (
        <div style={{ padding: "16px 0" }}>
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              color: "var(--text-primary)",
            }}
          >
            Are you sure? This cannot be undone.
          </p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "12px",
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
                backgroundColor: "transparent",
                color: "var(--text-primary)",
                borderRadius: "8px",
                padding: "8px 16px",
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.5 : 1,
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
                opacity: deleting ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {deleting && <Loader2 size={14} className="animate-spin" />}
              Delete everything
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
