"use client";

import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";

function LoginContent() {
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
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${origin}/app`;
    window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(redirectUrl)}`;
  }
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[360px] w-full flex flex-col items-center text-center gap-8"
      >
        <div className="flex flex-col items-center gap-2">
          <Link href="/" className="text-5xl font-extrabold text-accent tracking-tight font-heading">
            kiv
          </Link>
          <p className="text-base text-text-secondary font-body">
            Check in with yourself
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full mt-4">
          <button
            onClick={handleLogin}
            className="w-full py-4 px-6 bg-accent text-accent-text font-semibold rounded-full hover:brightness-105 transition-all duration-300 cursor-pointer text-base flex items-center justify-center gap-2 group"
          >
            Continue with SAMKIEL ID
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <p className="text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <a
              href={`${ACCOUNTS_URL}/register`}
              className="text-accent hover:brightness-110 transition-colors font-medium"
            >
              Create one
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
