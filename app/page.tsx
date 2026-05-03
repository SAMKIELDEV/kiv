"use client";

import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-background">
      {/* Nav */}
      <nav className="relative z-50 px-6 py-6 w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-text-primary tracking-tight font-heading">
            kiv
          </span>
        </div>
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-8 -mt-20">
          
          {/* Headline */}
          <div className="flex flex-col gap-2 font-heading font-black">
            <h1 className="text-6xl sm:text-7xl md:text-8xl text-text-primary tracking-[-0.04em] leading-[1.1]">
              Check in with
            </h1>
            <h1 className="text-6xl sm:text-7xl md:text-8xl text-accent tracking-[-0.04em] leading-[1.1]">
              yourself
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl leading-relaxed font-body">
            A simple, private space to log how you&apos;re doing each day.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 mt-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-accent text-background font-bold rounded-[var(--radius-full)] hover:opacity-90 transition-all duration-300 active:scale-[0.98] text-base"
            >
              Get started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <span className="text-sm text-text-secondary">
              Free forever · No credit card
            </span>
          </div>

        </div>
      </main>
    </div>
  );
}
