"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
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
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-10 animate-fade-in max-w-[480px] w-full"
    >
      <h1 className="text-[40px] font-extrabold text-text-primary tracking-tight font-heading">
        Settings
      </h1>

      {/* User info */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between py-4 border-b border-border bg-surface px-4 first:rounded-t-[var(--radius-sm)]">
          <span className="text-sm font-medium text-text-primary">Name</span>
          <span className="text-sm text-text-primary font-medium">{user?.name || "—"}</span>
        </div>
        <div className="flex items-center justify-between py-4 border-b border-border bg-surface px-4 last:rounded-b-[var(--radius-sm)]">
          <span className="text-sm font-medium text-text-primary">Email</span>
          <span className="text-sm text-text-secondary">{user?.email || "—"}</span>
        </div>

        <a
          href={process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors mt-4 w-fit px-4"
        >
          Manage account <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      <hr className="border-t border-border" />

      {/* Danger zone */}
      <div className="flex flex-col gap-4 px-4">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm text-red-500 hover:text-red-600 transition-colors w-fit font-medium text-left"
          >
            Delete Kiv data
          </button>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-primary font-medium">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteData}
                disabled={deleting}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Delete everything
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
