"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuth } from "@samkiel/authsdk/react";
import { Sun, Moon, Menu, X, LogOut, Loader2, BarChart2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface AppNavProps {
  variant?: "app" | "auth";
}

export function AppNav({ variant = "app" }: AppNavProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
  };

  async function handleLogout() {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await auth.logout();
    } catch {
      // proceed to redirect regardless
    }
    window.location.href = "/";
  }

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  const linkStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: 600,
    fontSize: "14px",
    color: active ? "var(--text-primary)" : "var(--text-secondary)",
    textDecoration: "none",
    transition: "color 0.15s ease",
  });

  const iconBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--text-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };

  const isApp = variant === "app";
  const showHamburger = isApp && isMobile;

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          zIndex: 50,
          backgroundColor: "rgba(var(--bg-rgb), 0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "0 20px" : "0 48px",
        }}
      >
        <Link
          href={isApp ? "/app" : "/"}
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

        {showHamburger ? (
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{ ...iconBtnStyle, color: "var(--text-primary)" }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            {isApp && (
              <>
                <Link href="/app/history" style={linkStyle(isActive("/app/history"))}>
                  History
                </Link>
                <Link
                  href="/app/insights"
                  style={{
                    ...linkStyle(isActive("/app/insights")),
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <BarChart2 size={14} />
                  Insights
                </Link>
                <Link href="/app/settings" style={linkStyle(isActive("/app/settings"))}>
                  Settings
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: loggingOut ? "not-allowed" : "pointer",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    opacity: loggingOut ? 0.6 : 1,
                    transition: "color 0.15s ease",
                  }}
                >
                  {loggingOut ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <LogOut size={14} />
                  )}
                  Logout
                </button>
              </>
            )}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              style={iconBtnStyle}
            >
              {mounted ? (
                resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />
              ) : (
                <span style={{ width: 16, height: 16, display: "inline-block" }} />
              )}
            </button>
          </div>
        )}
      </nav>

      <AnimatePresence>
        {showHamburger && menuOpen && (
          <motion.div
            key="mobile-menu"
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
              zIndex: 40,
              backgroundColor: "var(--bg)",
              display: "flex",
              flexDirection: "column",
              padding: "32px 20px",
            }}
          >
            <Link
              href="/app"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                color: isActive("/app") ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Today
            </Link>
            <Link
              href="/app/history"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                color: isActive("/app/history") ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              History
            </Link>
            <Link
              href="/app/insights"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                color: isActive("/app/insights") ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <BarChart2 size={18} />
              Insights
            </Link>
            <Link
              href="/app/settings"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                color: isActive("/app/settings") ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                padding: "16px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Settings
            </Link>

            <div style={{ flex: 1 }} />

            <button
              type="button"
              onClick={toggleTheme}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: "var(--text-primary)",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textAlign: "left",
              }}
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <>
                    <Sun size={18} />
                    Light mode
                  </>
                ) : (
                  <>
                    <Moon size={18} />
                    Dark mode
                  </>
                )
              ) : (
                <span style={{ width: 18, height: 18, display: "inline-block" }} />
              )}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                background: "none",
                border: "none",
                cursor: loggingOut ? "not-allowed" : "pointer",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                color: "var(--destructive)",
                padding: "16px 0",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textAlign: "left",
                opacity: loggingOut ? 0.6 : 1,
              }}
            >
              {loggingOut ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <LogOut size={18} />
              )}
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
