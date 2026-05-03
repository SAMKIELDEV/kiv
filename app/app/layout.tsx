"use client";

import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/app" className="text-lg font-bold text-text-primary tracking-tight">
            kiv
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/app/history"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              History
            </a>
            <a
              href="/app/settings"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Settings
            </a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {user && (
          <script
            id="user-data"
            type="application/json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(user) }}
          />
        )}
        {children}
      </main>
    </div>
  );
}
