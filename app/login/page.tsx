"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

const ACCOUNTS_URL =
  process.env.NEXT_PUBLIC_SAMKIEL_ACCOUNTS_URL || "https://account.samkiel.tech";

function LoginContent() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [illustrationFailed, setIllustrationFailed] = useState(false);

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

  function handleLogin() {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${origin}/app`;
    window.location.href = `${ACCOUNTS_URL}/login?redirect=${encodeURIComponent(
      redirectUrl
    )}`;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {!isMobile && (
        <div
          style={{
            width: "50%",
            backgroundColor: "#1A1410",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          {!illustrationFailed ? (
            <img
              src="/illustration.png"
              alt="Kiv"
              onError={() => setIllustrationFailed(true)}
              style={{ maxWidth: "80%", opacity: 0.85 }}
            />
          ) : (
            <span
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800,
                fontSize: "80px",
                color: "#C4956A",
                letterSpacing: "-2px",
              }}
            >
              kiv
            </span>
          )}
        </div>
      )}

      <div
        style={{
          width: isMobile ? "100%" : "50%",
          backgroundColor: "var(--bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
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
          <p
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 400,
              fontSize: "14px",
              color: "var(--text-secondary)",
              marginTop: "6px",
            }}
          >
            Check in with yourself
          </p>

          <div style={{ height: "48px" }} />

          <button
            onClick={handleLogin}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            style={{
              width: "100%",
              backgroundColor: "#C4956A",
              color: "#FFFFFF",
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
                color: "#C4956A",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Create one
            </a>
          </p>
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
