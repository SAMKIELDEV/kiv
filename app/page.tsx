"use client";

import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function LandingPage() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative bg-background">
      {/* Nav */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 w-full backdrop-blur-md bg-background/80"
      >
        <div className="max-w-[680px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-extrabold text-text-primary tracking-tight font-heading">
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
        </div>
      </motion.nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 md:px-12 pt-24">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="w-full max-w-[680px] mx-auto flex flex-col items-center text-center gap-8"
        >
          
          {/* Headline */}
          <motion.div variants={item} className="flex flex-col font-heading font-extrabold">
            <h1 className="text-[48px] sm:text-[64px] md:text-[72px] text-text-primary tracking-tight leading-[1.1]">
              Check in with
            </h1>
            <h1 className="text-[48px] sm:text-[64px] md:text-[72px] text-accent tracking-tight leading-[1.1]">
              yourself
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={item} className="text-lg text-text-secondary max-w-md leading-relaxed font-body">
            A simple, private space to log how you&apos;re doing each day.
          </motion.p>

          {/* CTA */}
          <motion.div variants={item} className="flex flex-col items-center gap-3 mt-4">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-text font-semibold rounded-full hover:brightness-105 transition-all duration-300 text-base"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-text-secondary">
              Free forever · No credit card
            </span>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
}
