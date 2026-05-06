"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { AppNav } from "@/app/components/AppNav";

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
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function handleLogin() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${origin}/app`;
    window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(
      redirectUrl
    )}`;
  }

  const isDark = mounted && resolvedTheme === "dark";
  const imageFilter = isDark ? "invert(1) brightness(1.2)" : "none";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <AppNav variant="auth" />

      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          width: "100%",
        }}
      >
        {!isMobile && (
          <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "100vh",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={`Kiv illustration ${currentImageIndex + 1}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 0.9, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                style={{
                  maxWidth: "80%",
                  height: "auto",
                  filter: imageFilter,
                  transition: "filter 0.3s ease",
                }}
              />
            </AnimatePresence>
          </div>
        )}

        <div
          style={{
            width: isMobile ? "100%" : "50%",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            paddingTop: "60px",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "32px 24px",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "320px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img
                  src="/favicon.ico"
                  alt="Kiv"
                  style={{ width: 28, height: 28, objectFit: "contain" }}
                />
                <span
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "24px",
                    color: "var(--text-primary)",
                    letterSpacing: "-0.5px",
                  }}
                >
                  kiv
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginTop: "10px",
                }}
              >
                Check in with yourself
              </p>

              <div style={{ height: "48px" }} />

              <button
                type="button"
                onClick={handleLogin}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                style={{
                  width: "100%",
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-foreground)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  padding: "14px 24px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  transition: "opacity 0.15s ease",
                }}
              >
                Continue with SAMKIEL ID →
              </button>

              <p
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  marginTop: "20px",
                  textAlign: "center",
                }}
              >
                Don&apos;t have an account?{" "}
                <a
                  href="https://account.samkiel.tech/register"
                  style={{
                    color: "var(--accent)",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Create one
                </a>
              </p>
            </div>
          </div>

          <footer
            style={{
              borderTop: "1px solid var(--border)",
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "16px",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "12px",
              color: "var(--text-secondary)",
              flexWrap: "wrap",
            }}
          >
            <span>© {new Date().getFullYear()} Kiv</span>
            <span aria-hidden="true">·</span>
            <Link
              href="/terms"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link
              href="/privacy"
              style={{ color: "var(--text-secondary)", textDecoration: "none" }}
            >
              Privacy
            </Link>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--bg)",
          }}
        />
      }
    >
      <LoginContent />
    </Suspense>
  );
}
