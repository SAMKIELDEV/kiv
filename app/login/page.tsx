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
    <div className="flex-1 flex flex-col min-h-screen bg-bg items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[660px] w-full flex flex-col items-center text-center"
      >
        <div className="flex flex-col items-center">
          <Link href="/" className="text-[32px] font-[800] text-text-primary tracking-tight">
            kiv
          </Link>
          <p className="text-[15px] text-text-secondary mt-2">
            Check in with yourself
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-[320px] mt-[48px]">
          <button
            onClick={handleLogin}
            className="w-full py-[14px] px-[24px] bg-accent text-accent-dark font-[700] text-[15px] rounded-[12px] hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2 group"
          >
            Continue with SAMKIEL ID
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-[14px] text-text-secondary mt-[20px]">
            Don&apos;t have an account?{" "}
            <a
              href={`${ACCOUNTS_URL}/register`}
              className="text-accent hover:opacity-80 transition-opacity font-semibold"
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
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

