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
      <div className="flex items-center justify-center py-20">
        <div className="w-2 h-2 bg-text-secondary rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-[28px] font-[800] text-text-primary tracking-tight mb-[32px]">
        Settings
      </h1>

      {/* User info */}
      <div className="flex flex-col bg-surface border border-border rounded-[12px] overflow-hidden">
        <div className="flex items-center justify-between py-4 border-b border-border px-6">
          <span className="text-[14px] font-[600] text-text-secondary">Name</span>
          <span className="text-[14px] text-text-primary font-[600]">{user?.name || "—"}</span>
        </div>
        <div className="flex items-center justify-between py-4 px-6">
          <span className="text-[14px] font-[600] text-text-secondary">Email</span>
          <span className="text-[14px] text-text-primary">{user?.email || "—"}</span>
        </div>
      </div>

      <a
        href={process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors mt-4 w-fit px-2"
      >
        Manage account <ArrowRight size={12} />
      </a>

      <div className="h-[1px] bg-border my-[32px]" />

      {/* Danger zone */}
      <div className="flex flex-col gap-4">
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-[14px] text-red-500 hover:opacity-80 transition-opacity w-fit font-[600] cursor-pointer"
          >
            Delete Kiv data
          </button>
        ) : (
          <div className="flex flex-col gap-4 p-6 bg-red-500/5 border border-red-500/20 rounded-[12px]">
            <p className="text-[14px] text-text-primary font-[600]">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                disabled={deleting}
                className="text-[13px] font-[600] text-text-secondary hover:text-text-primary cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                disabled={deleting}
                className="bg-red-500 text-white text-[13px] font-[600] px-4 py-2 rounded-[8px] hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Delete everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

