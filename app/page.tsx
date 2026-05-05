"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <style>{`
        .landing-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 48px;
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 50;
          background: var(--background);
          backdrop-filter: blur(12px);
        }
        .landing-hero {
          padding: 80px 48px;
          max-width: 760px;
        }
        .landing-h1 {
          font-weight: 800;
          font-size: 72px;
          line-height: 1.0;
          margin: 0 0 28px 0;
          letter-spacing: -2px;
          white-space: nowrap;
        }
        .landing-sub {
          font-size: 18px;
          color: var(--text-secondary);
          margin: 0 0 40px 0;
          max-width: 400px;
          line-height: 1.65;
          font-weight: 400;
        }
        .landing-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--accent);
          color: var(--accent-text);
          font-weight: 700;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 999px;
          text-decoration: none;
        }
        .landing-note {
          font-size: 13px;
          color: var(--text-secondary);
          margin-top: 12px;
        }
        @media (max-width: 640px) {
          .landing-nav {
            padding: 16px 20px;
          }
          .landing-hero {
            padding: 60px 24px;
          }
          .landing-h1 {
            font-size: 40px;
            letter-spacing: -1px;
            white-space: normal;
          }
          .landing-sub {
            font-size: 16px;
            margin: 0 0 32px 0;
          }
          .landing-cta {
            font-size: 14px;
            padding: 12px 24px;
          }
        }
      `}</style>
      <main style={{ minHeight: "100vh", background: "var(--background)", fontFamily: "Syne, sans-serif" }}>
        <nav className="landing-nav">
          <span style={{ fontWeight: 800, fontSize: 20, color: "var(--text-primary)", letterSpacing: -0.5 }}>kiv</span>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", display: "flex" }}>
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/login" style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", fontWeight: 600 }}>
              Sign in
            </Link>
          </div>
        </nav>

        <section className="landing-hero">
          <h1 className="landing-h1">
            <span style={{ color: "var(--text-primary)", display: "block" }}>Check in with</span>
            <span style={{ color: "var(--accent)", display: "block" }}>yourself</span>
          </h1>
          <p className="landing-sub">
            A simple, private space to log how you&apos;re doing each day.
          </p>
          <Link href="/login" className="landing-cta">
            Get started →
          </Link>
          <p className="landing-note">Free forever · No credit card</p>
        </section>
      </main>
    </>
  );
}
