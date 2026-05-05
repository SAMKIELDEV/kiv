"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .kiv-landing { min-height: 100vh; background: #FAFAF8; display: flex; flex-direction: column; }
        .kiv-nav { 
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          height: 60px; display: flex; justify-content: space-between; align-items: center;
          padding: 0 48px; background: rgba(250,250,248,0.92);
          backdrop-filter: blur(12px); border-bottom: 1px solid #E0DDD8;
        }
        .kiv-nav-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; color: #1A1410; text-decoration: none; }
        .kiv-nav-right { display: flex; align-items: center; gap: 20px; }
        .kiv-theme-btn { background: none; border: none; cursor: pointer; color: #8A8580; display: flex; align-items: center; padding: 0; }
        .kiv-signin { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; color: #8A8580; text-decoration: none; }
        .kiv-signin:hover { color: #1A1410; }
        .kiv-hero {
          flex: 1; display: flex; align-items: center;
          padding: 60px 48px 80px 48px;
          max-width: 700px;
        }
        .kiv-hero-inner { display: flex; flex-direction: column; align-items: flex-start; }
        .kiv-headline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; font-size: 64px;
          line-height: 1.05; letter-spacing: -2px;
          margin-bottom: 24px;
        }
        .kiv-headline-white { color: #1A1410; display: block; }
        .kiv-headline-accent { color: #C4956A; display: block; }
        .kiv-subheading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400; font-size: 17px;
          color: #8A8580; line-height: 1.65;
          max-width: 360px; margin-bottom: 36px;
        }
        .kiv-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: #C4956A; color: #FFFFFF;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 15px;
          padding: 13px 28px; border-radius: 999px;
          text-decoration: none; border: none;
          transition: opacity 0.15s ease;
        }
        .kiv-cta:hover { opacity: 0.88; }
        .kiv-fine-print {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; color: #A09890; margin-top: 10px;
        }
        @media (max-width: 640px) {
          .kiv-nav { padding: 0 24px; }
          .kiv-hero { padding: 80px 24px 60px 24px; }
          .kiv-headline { font-size: 40px; letter-spacing: -1px; }
          .kiv-subheading { font-size: 16px; }
        }
      `}</style>

      <div className="kiv-landing">
        <nav className="kiv-nav">
          <Link href="/" className="kiv-nav-logo">kiv</Link>
          <div className="kiv-nav-right">
            <button
              className="kiv-theme-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link href="/login" className="kiv-signin">Sign in</Link>
          </div>
        </nav>

        <main className="kiv-hero">
          <div className="kiv-hero-inner">
            <h1 className="kiv-headline">
              <span className="kiv-headline-white">Check in with</span>
              <span className="kiv-headline-accent">yourself</span>
            </h1>
            <p className="kiv-subheading">
              A simple, private space to log how you're doing each day.
            </p>
            <Link href="/login" className="kiv-cta">
              Get started →
            </Link>
            <p className="kiv-fine-print">Free forever · No credit card</p>
          </div>
        </main>
      </div>
    </>
  );
}