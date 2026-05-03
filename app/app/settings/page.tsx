"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UserInfo {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  async function handleDeleteData() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

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
      <div className="flex items-center justify-center py-20">
        <div className="w-2 h-2 bg-text-muted rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-8 animate-fade-in"
    >
      <h1 className="text-2xl font-bold text-text-primary tracking-tight">
        Settings
      </h1>

      {/* User info */}
      <div className="flex flex-col gap-4 p-6 bg-surface border border-border rounded-[var(--radius-lg)]">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Account
        </h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted">Name</span>
            <span className="text-sm text-text-primary font-medium">
              {user?.name || "—"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-text-muted">Email</span>
            <span className="text-sm text-text-primary font-medium">
              {user?.email || "—"}
            </span>
          </div>
        </div>

        <a
          href={process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mt-2 w-fit"
        >
          Manage account <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Danger zone */}
      <div className="flex flex-col gap-4 p-6 bg-surface border border-danger/20 rounded-[var(--radius-lg)]">
        <h2 className="text-sm font-semibold text-danger uppercase tracking-wider">
          Danger Zone
        </h2>
        <p className="text-sm text-text-secondary">
          Delete all your Kiv data — entries, streaks, everything. This does{" "}
          <strong className="text-text-primary">not</strong> delete your SAMKIEL
          ID account.
        </p>

        <div className="flex items-center gap-3">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteData}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {confirmDelete ? "Confirm deletion" : "Delete all Kiv data"}
          </Button>
          {confirmDelete && (
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm text-text-muted hover:text-text-secondary cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
