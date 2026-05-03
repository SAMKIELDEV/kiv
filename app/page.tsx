"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Heart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-lg font-bold text-text-primary tracking-tight">
            kiv
          </span>
          <a
            href="/login"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-2xl mx-auto flex flex-col items-center text-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-[var(--radius-full)] text-xs text-accent font-medium">
              Micro-journaling, simplified
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1]">
              Check in with
              <br />
              <span className="text-accent">yourself</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-md leading-relaxed">
              A simple, private space to log how you&apos;re doing each day. One
              mood. One thought. Under two minutes.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-background font-semibold rounded-[var(--radius-md)] hover:bg-accent-dim transition-all duration-200 active:scale-[0.98] text-sm animate-pulse-glow"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 w-full"
          >
            {[
              {
                icon: Clock,
                title: "2 minutes",
                desc: "That's all it takes. No pressure.",
              },
              {
                icon: Shield,
                title: "Private",
                desc: "No social. No sharing. Just you.",
              },
              {
                icon: Heart,
                title: "Intentional",
                desc: "Build self-awareness, one day at a time.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className="flex flex-col items-center gap-3 p-6 bg-surface border border-border rounded-[var(--radius-lg)]"
              >
                <feature.icon className="w-5 h-5 text-accent" />
                <h3 className="text-sm font-semibold text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-xs text-text-secondary text-center">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-text-muted">
          <span>© 2026 SAMKIEL Studio</span>
          <a
            href="https://samkiel.tech"
            className="hover:text-text-secondary transition-colors"
          >
            samkiel.tech
          </a>
        </div>
      </footer>
    </div>
  );
}
