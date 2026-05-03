"use client";

import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { motion } from "framer-motion";

interface AuthUser {
  userId: string;
  name: string;
  email: string;
}

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";
const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) {
        window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(`${APP_URL}/app`)}`;
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(`${APP_URL}/app`)}`;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="w-6 h-6 text-text-secondary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background relative">
      {/* Nav */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 w-full backdrop-blur-md bg-background/80"
      >
        <div className="max-w-[680px] mx-auto flex items-center justify-between">
          <Link href="/app" className="text-xl font-extrabold text-text-primary tracking-tight font-heading">
            kiv
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/app/history"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              History
            </Link>
            <Link
              href="/app/settings"
              className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Settings
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </motion.nav>

      {/* Content */}
      <main className="flex-1 w-full max-w-[680px] mx-auto px-[24px] md:px-[48px] pt-28 pb-12">
        {user && (
          <script
            id="user-data"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(user) }}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
