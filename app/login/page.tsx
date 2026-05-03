"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if already authenticated
    async function checkAuth() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          router.replace("/app");
          return;
        }
      } catch {
        // Not authenticated — stay on login
      }
    }
    checkAuth();
  }, [router]);

  function handleLogin() {
    const redirectUrl = `${window.location.origin}/app`;
    window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(redirectUrl)}`;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen px-4">
      <div className="flex flex-col items-center gap-8 max-w-sm w-full">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">
            kiv
          </h1>
          <p className="text-sm text-text-secondary text-center">
            Check in with yourself
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full p-6 bg-surface border border-border rounded-[var(--radius-lg)]">
          <p className="text-sm text-text-secondary text-center">
            Sign in with your SAMKIEL account to continue
          </p>

          <button
            onClick={handleLogin}
            className="w-full py-3 px-4 bg-accent text-background font-semibold rounded-[var(--radius-md)] hover:bg-accent-dim transition-all duration-200 cursor-pointer active:scale-[0.98] text-sm"
          >
            Sign in with SAMKIEL
          </button>
        </div>

        <p className="text-xs text-text-muted text-center">
          Don&apos;t have an account?{" "}
          <a
            href={`${ACCOUNTS_URL}/register`}
            className="text-accent hover:underline"
          >
            Create one
          </a>
        </p>
      </div>
    </div>
  );
}
