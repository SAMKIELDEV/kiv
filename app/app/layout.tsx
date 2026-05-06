"use client";

import { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { AppNav } from "@/app/components/AppNav";

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
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "var(--bg)",
        }}
      >
        <Loader2
          size={24}
          style={{ color: "var(--text-secondary)" }}
          className="animate-spin"
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <AppNav />

      <main
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          paddingTop: "60px",
        }}
      >
        <div
          style={{
            padding: isMobile ? "32px 20px" : "40px 48px",
          }}
        >
          {user && (
            <script
              id="user-data"
              type="application/json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(user) }}
            />
          )}
          {children}
        </div>
      </main>
    </div>
  );
}
