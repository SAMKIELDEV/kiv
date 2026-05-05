// app/page.tsx (Home component)
"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Shield, Calendar, ArrowRight, Play, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Daily Check-ins",
    description: "Log your mood and thoughts in under 2 minutes with our intuitive interface.",
  },
  {
    icon: Sparkles,
    title: "Beautiful Insights",
    description: "Visualize your emotional journey over time with elegant, data-driven charts.",
  },
  {
    icon: Shield,
    title: "Completely Private",
    description: "Your data is yours. End-to-end encryption ensures your thoughts stay private.",
  },
  {
    icon: Calendar,
    title: "Consistent Growth",
    description: "Build a sustainable journaling habit that helps you understand yourself better.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden">
      <div className="grain" />
      <div className="premium-gradient absolute inset-0" />
      
      <Navbar />

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-40 pb-20 px-6 overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="flex flex-col items-center text-center"
            >
              <motion.div 
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/5 border border-accent/10 mb-10"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-accent">Introducing Kiv 1.0</span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="font-heading text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tight leading-[0.9] mb-8"
              >
                Check in with <br />
                <span className="text-accent italic font-normal">yourself</span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
              >
                A simple, private space to log how you&apos;re doing each day. 
                Mood tracking and micro-journaling redefined for the modern mind.
              </motion.p>

              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
              >
                <Link
                  href="/signup"
                  className="group relative bg-text-primary text-bg px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start your journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link
                  href="/demo"
                  className="flex items-center gap-3 text-text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-surface transition-all border border-transparent hover:border-border"
                >
                  <Play className="w-5 h-5 fill-current" /> Watch demo
                </Link>
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-8 text-xs font-bold uppercase tracking-widest text-text-secondary/60"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> Free forever
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> No credit card
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" /> End-to-end encrypted
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-24"
            >
              <h2 className="font-heading text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Designed for reflection
              </h2>
              <p className="text-text-secondary text-xl max-w-2xl mx-auto font-medium">
                Everything you need to stay mindful, without the noise.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-8 rounded-[32px] bg-surface/30 border border-border/50 hover:border-accent/30 transition-all hover:bg-surface/50"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-accent/10 transition-all duration-500">
                    <feature.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold mb-4 text-text-primary">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative overflow-hidden bg-text-primary rounded-[48px] p-12 md:p-24 text-center text-bg"
            >
              <div className="absolute inset-0 premium-gradient opacity-10" />
              <div className="relative z-10">
                <h2 className="font-heading text-4xl md:text-7xl font-bold mb-8 tracking-tight">
                  Start your journey <br /> to self-awareness.
                </h2>
                <p className="text-bg/60 text-xl mb-12 max-w-2xl mx-auto font-medium">
                  Join thousands of others who are building a healthier relationship with themselves, one day at a time.
                </p>
                <Link
                  href="/signup"
                  className="inline-block bg-accent text-accent-dark px-12 py-5 rounded-full font-bold text-xl hover:opacity-90 transition-all hover:scale-105 shadow-2xl"
                >
                  Create your free account
                </Link>
                <p className="text-sm text-bg/40 mt-8 font-medium">
                  No credit card required · Cancel anytime
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div className="flex flex-col gap-6">
              <Link href="/" className="font-heading text-3xl font-bold tracking-tighter">
                Kiv<span className="text-accent">.</span>
              </Link>
              <p className="text-text-secondary max-w-xs font-medium">
                Modern journaling for the mindful individual. Designed and built by SAMKIEL Studio.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Product</span>
                <Link href="/features" className="text-text-secondary hover:text-accent transition-colors font-medium">Features</Link>
                <Link href="/pricing" className="text-text-secondary hover:text-accent transition-colors font-medium">Pricing</Link>
                <Link href="/demo" className="text-text-secondary hover:text-accent transition-colors font-medium">Demo</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Legal</span>
                <Link href="/privacy" className="text-text-secondary hover:text-accent transition-colors font-medium">Privacy</Link>
                <Link href="/terms" className="text-text-secondary hover:text-accent transition-colors font-medium">Terms</Link>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold uppercase tracking-widest text-text-primary">Connect</span>
                <Link href="https://twitter.com" className="text-text-secondary hover:text-accent transition-colors font-medium">Twitter</Link>
                <Link href="https://instagram.com" className="text-text-secondary hover:text-accent transition-colors font-medium">Instagram</Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-border/20">
            <span className="text-sm text-text-secondary font-medium">
              © 2024 Kiv. All rights reserved.
            </span>
            <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
              Made with <span className="text-accent">♥</span> by SAMKIEL
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}