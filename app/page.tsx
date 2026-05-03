"use client";

import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Heart, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] bg-accent/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] bg-accent/[0.02] rounded-full blur-[80px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Nav */}
      <nav className="relative z-50 border-b border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-background text-xs font-black tracking-tight">K</span>
            </div>
            <span className="text-base font-bold text-text-primary tracking-tight">
              kiv
            </span>
          </div>
          <a
            href="/login"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-300 px-4 py-2 rounded-[var(--radius-md)] hover:bg-white/[0.04] border border-transparent hover:border-white/[0.06]"
          >
            Sign in
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-10 py-24">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/[0.08] border border-accent/[0.15] rounded-[var(--radius-full)] text-xs text-accent font-medium backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              Micro-journaling, simplified
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-text-primary tracking-[-0.04em] leading-[0.95]">
              Check in with
            </h1>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-[-0.04em] leading-[0.95]">
              <span className="bg-gradient-to-r from-accent via-[#d4f046] to-[#a8c431] bg-clip-text text-transparent">
                yourself
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base sm:text-lg text-text-secondary max-w-lg leading-relaxed"
          >
            A simple, private space to log how you&apos;re doing each day.
            <br className="hidden sm:block" />
            One mood. One thought. Under two minutes.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <a
              href="/login"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-accent text-background font-bold rounded-[var(--radius-md)] hover:bg-accent-dim transition-all duration-300 active:scale-[0.97] text-sm shadow-[0_0_30px_rgba(232,255,71,0.15)] hover:shadow-[0_0_40px_rgba(232,255,71,0.25)]"
            >
              Get started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
            </a>
            <span className="text-xs text-text-muted">
              Free forever · No credit card
            </span>
          </motion.div>

          {/* Preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-md mt-8"
          >
            <div className="relative p-[1px] rounded-[20px] bg-gradient-to-b from-white/[0.1] to-white/[0.02]">
              <div className="bg-surface rounded-[19px] p-6 space-y-5">
                {/* Fake greeting */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-text-muted">Today</p>
                    <p className="text-base font-semibold text-text-primary">
                      Good afternoon ☀️
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-accent/[0.08] rounded-[var(--radius-full)]">
                    <span className="text-xs">🔥</span>
                    <span className="text-xs font-bold text-accent">7</span>
                  </div>
                </div>

                {/* Fake mood selector */}
                <div className="space-y-2.5">
                  <p className="text-xs text-text-muted font-medium">How are you feeling?</p>
                  <div className="flex gap-2">
                    {[
                      { emoji: "😔", dim: true },
                      { emoji: "😕", dim: true },
                      { emoji: "😐", dim: true },
                      { emoji: "🙂", dim: false },
                      { emoji: "😄", dim: true },
                    ].map((m, i) => (
                      <div
                        key={i}
                        className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${
                          !m.dim
                            ? "bg-accent/10 border-accent/30"
                            : "bg-white/[0.02] border-white/[0.06]"
                        }`}
                      >
                        <span className="text-lg">{m.emoji}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fake prompt */}
                <div className="space-y-2">
                  <p className="text-xs text-text-muted font-medium">
                    What made you smile today?
                  </p>
                  <div className="h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center px-3">
                    <span className="text-xs text-text-muted/50">
                      Optional — answer if it speaks to you
                    </span>
                  </div>
                </div>

                {/* Fake CTA */}
                <div className="h-10 rounded-[var(--radius-md)] bg-accent/80 flex items-center justify-center gap-2">
                  <span className="text-xs font-bold text-background">Check in</span>
                </div>
              </div>
            </div>

            {/* Reflection glow */}
            <div className="w-[80%] h-[1px] mx-auto bg-gradient-to-r from-transparent via-accent/20 to-transparent mt-4" />
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 w-full"
          >
            {[
              {
                icon: Clock,
                title: "2 minutes",
                desc: "That's all it takes. No pressure, no friction.",
              },
              {
                icon: Shield,
                title: "Private",
                desc: "No social features. No sharing. Just you.",
              },
              {
                icon: Heart,
                title: "Intentional",
                desc: "Build self-awareness, one check-in at a time.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 + i * 0.08 }}
                className="group relative p-[1px] rounded-[var(--radius-lg)] bg-gradient-to-b from-white/[0.08] to-transparent hover:from-accent/[0.15] hover:to-transparent transition-all duration-500"
              >
                <div className="flex flex-col items-start gap-3 p-5 bg-[#0d0d0d] rounded-[calc(var(--radius-lg)-1px)] h-full">
                  <div className="w-9 h-9 rounded-[var(--radius-md)] bg-white/[0.04] border border-white/[0.06] flex items-center justify-center group-hover:bg-accent/[0.08] group-hover:border-accent/[0.15] transition-all duration-500">
                    <feature.icon className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors duration-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-text-muted">
          <span>© 2026 SAMKIEL Studio</span>
          <a
            href="https://samkiel.tech"
            className="hover:text-text-secondary transition-colors duration-300"
          >
            samkiel.tech
          </a>
        </div>
      </footer>
    </div>
  );
}
