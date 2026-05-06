"use client";

import { Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/insights", label: "Insights" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* NAVBAR */}
      <nav className="kiv-nav">
          <Link href="/" className="kiv-nav-logo gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <img src="/favicon.ico" alt="Kiv Logo" className="w-full h-full object-contain" />
            </div>
            kiv
          </Link>
          <div className="kiv-nav-right">
            <button
              className="kiv-theme-btn"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted ? (theme === "dark" ? <Sun size={16} /> : <Moon size={16} />) : <div style={{ width: 16, height: 16 }} />}
            </button>
            <Link href="/login" className="kiv-signin">Sign in</Link>
            
            <button 
              className="kiv-menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="kiv-mobile-menu"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <Link href="/login" className="kiv-mobile-link" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              <Link href="/login" className="kiv-mobile-link" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
              <div className="mt-8 flex flex-col gap-6">
                <Link href="/terms" className="kiv-mobile-link-sub" onClick={() => setIsMenuOpen(false)}>Terms of Service</Link>
                <Link href="/privacy" className="kiv-mobile-link-sub" onClick={() => setIsMenuOpen(false)}>Privacy Policy</Link>
              </div>
              <button
                className="mt-auto flex items-center gap-2 text-text-primary font-bold"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setIsMenuOpen(false);
                }}
              >
                {mounted ? (theme === "dark" ? <Sun size={20} /> : <Moon size={20} />) : <div style={{ width: 20, height: 20 }} />}
                {mounted ? (theme === "dark" ? "Light Mode" : "Dark Mode") : "Loading..."}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
}