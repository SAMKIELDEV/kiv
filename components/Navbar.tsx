"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const navStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "60px",
    zIndex: 100,
    backgroundColor: "rgba(var(--bg-rgb), 0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isMobile ? "0 20px" : "0 48px",
  };

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    fontSize: "14px",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    textDecoration: "none",
    transition: "color 0.15s ease",
  });

  return (
    <>
      <nav style={navStyle}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <img
            src="/favicon.ico"
            alt="Kiv"
            style={{ width: 24, height: 24, objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 800,
              fontSize: "18px",
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
            }}
          >
            kiv
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {!isMobile && (
            <>
              <Link href="/login" style={linkStyle(false)}>
                Sign in
              </Link>
              <Link
                href="/login"
                style={{
                  ...linkStyle(true),
                  backgroundColor: "var(--text-primary)",
                  color: "var(--bg)",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  fontSize: "13px",
                }}
              >
                Get Started
              </Link>
            </>
          )}

          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            {mounted ? (
              resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />
            ) : (
              <div style={{ width: 18, height: 18 }} />
            )}
          </button>

          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-primary)",
                padding: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "fixed",
              top: "60px",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 90,
              backgroundColor: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              padding: "32px 20px",
            }}
          >
            <Link
              href="/login"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                color: "var(--text-primary)",
                textDecoration: "none",
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Sign In
            </Link>
            <Link
              href="/login"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                color: "var(--accent)",
                textDecoration: "none",
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Get Started →
            </Link>

            <div style={{ flex: 1 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", opacity: 0.6 }}>
              <Link href="/terms" style={linkStyle(false)}>Terms of Service</Link>
              <Link href="/privacy" style={linkStyle(false)}>Privacy Policy</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}