"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";

const images = [
  "/assets/hero.png",
  "/assets/hero2.png",
  "/assets/hero3.png",
  "/assets/hero4.png",
  "/assets/hero5.png",
  "/assets/hero6.png",
  "/assets/hero7.png",
];

function LoginContent() {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    // Slideshow logic
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 second interval
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Check if already authenticated
    async function checkAuth() {
      try {
        const res = await fetch("/api/me");
        if (res.ok) {
          router.replace("/app");
        }
      } catch {
        // Not authenticated
      }
    }
    checkAuth();
  }, [router]);

  function handleLogin() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${origin}/app`;
    window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(
      redirectUrl
    )}`;
  }

  return (
    <div className="flex min-h-screen bg-[#0F0E0D] overflow-hidden font-sans">
      {/* Left Panel: Slideshow */}
      <div className="hidden lg:block relative w-1/2 h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={images[currentImageIndex]}
              alt="Kiv atmosphere"
              className="w-full h-full object-cover grayscale opacity-60 invert-[0.1]"
            />
            {/* Dark overlay to ensure images don't overpower */}
            <div className="absolute inset-0 bg-[#0F0E0D]/40 mix-blend-multiply" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Panel: Auth */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[360px] flex flex-col items-center"
        >
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-16">
            <div className="w-10 h-10 flex items-center justify-center mb-3">
              <img src="/favicon.ico" alt="Kiv Icon" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-[18px] font-bold tracking-tight text-text-primary">
              kiv
            </span>
          </div>

          {/* Heading Section */}
          <div className="text-center mb-12">
            <h1 className="text-[40px] font-medium text-text-primary tracking-tight leading-tight mb-3">
              Welcome back.
            </h1>
            <p className="text-text-secondary text-[16px] font-medium opacity-80">
              A quiet moment, every day.
            </p>
          </div>

          {/* Action Section */}
          <div className="w-full flex flex-col items-center">
            <button
              onClick={handleLogin}
              className="w-full py-4 px-8 bg-[#F5E6D3] text-[#1A1410] font-bold text-[16px] rounded-full hover:opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-white/5"
            >
              Continue with SAMKIEL ID
            </button>
            
            <p className="mt-8 text-[11px] text-text-secondary tracking-[0.05em] uppercase font-bold opacity-40">
              Your data is private. Always.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0F0E0D]">
          <div className="w-6 h-6 border-2 border-white/10 border-t-[#F5E6D3] rounded-full animate-spin"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
