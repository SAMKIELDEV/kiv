// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/journal", label: "Journal" },
  { href: "/insights", label: "Insights" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-6"
    >
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center justify-between glass px-6 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-border/40">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-text-primary flex items-center justify-center group-hover:bg-accent transition-colors duration-500">
              <span className="text-bg text-sm font-bold">K</span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tighter text-text-primary group-hover:text-accent transition-colors duration-500">
              Kiv<span className="text-accent group-hover:text-text-primary">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  pathname === link.href
                    ? "text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-accent/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-bold text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-text-primary text-bg px-6 py-2.5 rounded-full text-sm font-bold hover:bg-accent transition-all duration-300 hover:scale-105 shadow-xl shadow-black/5"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </motion.header>
  );
}