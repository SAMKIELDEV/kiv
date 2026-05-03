"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@samkiel/authsdk/react";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";

function LoginContent() {
  const router = useRouter();
  const { signInWithProvider } = useAuth();

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
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${origin}/app`;
    window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(redirectUrl)}`;
  }

  function handleGoogleLogin() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    signInWithProvider('google', `${origin}/app`);
  }

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-background w-full">
      {/* Accent Panel (Left) */}
      <div className="w-full md:w-1/2 bg-accent flex items-center justify-center p-12 min-h-[30vh] md:min-h-screen">
        <Link href="/" className="text-5xl md:text-7xl font-bold text-[#0A0A0A] tracking-tight font-heading">
          kiv
        </Link>
      </div>

      {/* Login Form (Right) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12">
        <div className="max-w-md w-full flex flex-col gap-8">
          
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight font-heading">
              Sign in to Kiv
            </h1>
            <p className="text-base text-text-secondary font-body">
              Use your SAMKIEL account to continue
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            <button
              onClick={handleLogin}
              className="w-full py-4 px-6 bg-[#0A0A0A] text-white dark:bg-accent dark:text-[#0A0A0A] font-bold rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer active:scale-[0.98] text-base flex items-center justify-center gap-2 group"
            >
              Sign in with SAMKIEL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 px-6 bg-white text-[#0A0A0A] border border-[#E5E5E5] dark:bg-transparent dark:text-white dark:border-[#262626] font-bold rounded-[var(--radius-sm)] transition-all duration-200 cursor-pointer active:scale-[0.98] text-base flex items-center justify-center gap-2 group"
            >
              <svg className="w-5 h-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Continue with Google
            </button>

            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <a
                href={`${ACCOUNTS_URL}/register`}
                className="text-accent hover:underline font-medium"
              >
                Create one
              </a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
