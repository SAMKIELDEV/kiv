"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function AppNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname.startsWith(href);
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
        href="/app"
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 800,
          fontSize: "18px",
          color: "var(--text-primary)",
          textDecoration: "none",
          letterSpacing: "-0.5px",
        }}
      >
        kiv
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <Link href="/app/history" style={linkStyle(isActive("/app/history"))}>
          History
        </Link>
        <Link href="/app/settings" style={linkStyle(isActive("/app/settings"))}>
          Settings
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          {mounted ? (
            theme === "dark" ? <Sun size={16} /> : <Moon size={16} />
          ) : (
            <span style={{ width: 16, height: 16, display: "inline-block" }} />
          )}
        </button>
      </div>
    </nav>
  );
}
