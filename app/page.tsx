"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { theme, setTheme } = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    "/assets/hero.png",
    "/assets/hero2.png",
    "/assets/hero3.png",
    "/assets/hero4.png",
    "/assets/hero5.png",
    "/assets/hero6.png",
    "/assets/hero7.png",
  ];

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg); color: var(--text-primary); }
        .kiv-landing { min-height: 100vh; background: var(--bg); display: flex; flex-direction: column; }
        .kiv-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          height: 60px; display: flex; justify-content: space-between; align-items: center;
          padding: 0 48px; background: var(--bg);
          opacity: 0.95;
          backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
        }
        .kiv-nav-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 18px; color: var(--text-primary); text-decoration: none; }
        .kiv-nav-right { display: flex; align-items: center; gap: 20px; }
        .kiv-theme-btn { background: none; border: none; cursor: pointer; color: var(--text-secondary); display: flex; align-items: center; padding: 0; }
        .kiv-signin { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 600; color: var(--text-secondary); text-decoration: none; }
        .kiv-signin:hover { color: var(--text-primary); }
        .kiv-hero {
          flex: 1; display: flex; align-items: center;
          padding: 100px 48px 80px 48px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
        }
        .kiv-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 48px;
          width: 100%;
        }
        .kiv-hero-inner { display: flex; flex-direction: column; align-items: flex-start; }
        .kiv-headline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; font-size: 64px;
          line-height: 1.05; letter-spacing: -2px;
          margin-bottom: 24px;
        }
        .kiv-headline-white { color: var(--text-primary); display: block; }
        .kiv-headline-accent { color: var(--accent); display: block; }
        .kiv-subheading {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 400; font-size: 17px;
          color: var(--text-secondary); line-height: 1.65;
          max-width: 360px; margin-bottom: 36px;
        }
        .kiv-cta {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--accent); color: var(--bg);
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700; font-size: 15px;
          padding: 13px 28px; border-radius: 999px;
          text-decoration: none; border: none;
          transition: opacity 0.15s ease;
        }
        .kiv-cta:hover { opacity: 0.88; }
        .kiv-fine-print {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; color: var(--text-secondary); margin-top: 10px;
        }
        .kiv-hero-image {
          display: flex; align-items: center; justify-content: center;
          position: relative;
          height: 500px;
          width: 100%;
        }
        .kiv-hero-image img {
          max-width: 100%; height: auto; opacity: 0.9;
          transition: filter 0.3s ease;
        }
        .dark .kiv-hero-image img {
          filter: invert(1) brightness(1.2);
        }
        .kiv-footer {
          border-top: 1px solid var(--border);
          padding: 40px 48px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
          background: var(--bg);
        }
        .kiv-footer-left { display: flex; flex-direction: column; gap: 6px; }
        .kiv-footer-brand {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800; font-size: 16px; color: var(--text-primary);
        }
        .kiv-footer-byline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px; color: var(--text-secondary); line-height: 1.5;
        }
        .kiv-footer-byline a {
          color: var(--accent); text-decoration: none; font-weight: 600;
        }
        .kiv-footer-byline a:hover { text-decoration: underline; }
        .kiv-footer-right {
          display: flex; gap: 48px;
        }
        .kiv-footer-col { display: flex; flex-direction: column; gap: 10px; }
        .kiv-footer-col-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 700; color: var(--text-secondary);
          text-transform: uppercase; letter-spacing: 1.5px;
          opacity: 0.7;
        }
        .kiv-footer-link {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: var(--text-secondary); text-decoration: none;
          transition: color 0.15s ease;
        }
        .kiv-footer-link:hover { color: var(--text-primary); }
        .kiv-footer-bottom {
          border-top: 1px solid var(--border);
          padding: 16px 48px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg);
        }
        .kiv-footer-copy {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 12px; color: var(--text-secondary);
        }
        .kiv-footer-copy a {
          color: var(--text-secondary); text-decoration: none;
        }
        .kiv-footer-copy a:hover { color: var(--accent); }
        @media (max-width: 768px) {
          .kiv-nav { padding: 0 24px; }
          .kiv-hero { padding: 90px 24px 60px 24px; }
          .kiv-hero-grid { grid-template-columns: 1fr; }
          .kiv-hero-image { display: none; }
          .kiv-headline { font-size: 40px; letter-spacing: -1px; }
          .kiv-subheading { font-size: 16px; }
          .kiv-footer { padding: 32px 24px; flex-direction: column; gap: 32px; }
          .kiv-footer-right { gap: 32px; }
          .kiv-footer-bottom { padding: 16px 24px; flex-direction: column; gap: 8px; text-align: center; }
        }
      `}</style>

      <div className="kiv-landing">
        {/* NAVBAR */}
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

        {/* HERO */}
        <main className="kiv-hero">
          <div className="kiv-hero-grid">
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
            <div 
              className="kiv-hero-image"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
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
                />
              </AnimatePresence>
            </div>
          </div>
        </main>

        {/* FOOTER */}
        <footer className="kiv-footer">
          <div className="kiv-footer-left">
            <span className="kiv-footer-brand">kiv</span>
            <p className="kiv-footer-byline">
              A product by <a href="https://samkiel.tech" target="_blank" rel="noopener noreferrer">SAMKIEL</a>
              <br />
              Software with Intention.
            </p>
          </div>
          <div className="kiv-footer-right">
            <div className="kiv-footer-col">
              <span className="kiv-footer-col-label">Product</span>
              <Link href="/login" className="kiv-footer-link">Get started</Link>
              <Link href="/login" className="kiv-footer-link">Sign in</Link>
            </div>
            <div className="kiv-footer-col">
              <span className="kiv-footer-col-label">Legal</span>
              <a href="https://samkiel.tech/terms" target="_blank" rel="noopener noreferrer" className="kiv-footer-link">Terms of Service</a>
              <a href="https://samkiel.tech/privacy" target="_blank" rel="noopener noreferrer" className="kiv-footer-link">Privacy Policy</a>
            </div>
            <div className="kiv-footer-col">
              <span className="kiv-footer-col-label">Company</span>
              <a href="https://samkiel.tech" target="_blank" rel="noopener noreferrer" className="kiv-footer-link">SAMKIEL</a>
              <a href="mailto:hello@samkiel.tech" className="kiv-footer-link">Contact</a>
            </div>
          </div>
        </footer>

        {/* FOOTER BOTTOM */}
        <div className="kiv-footer-bottom">
          <span className="kiv-footer-copy">
            © {new Date().getFullYear()} Kiv by <a href="https://samkiel.tech" target="_blank" rel="noopener noreferrer">SAMKIEL</a>. All rights reserved.
          </span>
          <span className="kiv-footer-copy">
            <a href="https://samkiel.tech/terms" target="_blank" rel="noopener noreferrer">Terms</a>
            {" · "}
            <a href="https://samkiel.tech/privacy" target="_blank" rel="noopener noreferrer">Privacy</a>
          </span>
        </div>
      </div>
    </>
  );
}