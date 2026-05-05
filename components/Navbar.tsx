"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/app/history", label: "History" },
    { href: "/app/settings", label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-border bg-bg/90 backdrop-blur-md flex items-center">
      <div className="w-full max-w-[660px] mx-auto px-6 md:px-[48px] flex items-center justify-between">
        <Link href="/" className="text-[18px] font-[800] text-text-primary tracking-tight">
          kiv
        </Link>
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[14px] font-[600] transition-colors ${
                  isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
