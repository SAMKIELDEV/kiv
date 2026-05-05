"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent selection:text-bg">
      <nav className="fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center justify-between px-12 bg-bg/80 backdrop-blur-md border-b border-border/50">
        <Link href="/" className="font-bold text-xl tracking-tighter">kiv</Link>
        <Link href="/" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">Back to Home</Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-heading font-extrabold text-5xl mb-12 tracking-tight">Terms of Service</h1>
          
          <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing or using Kiv, you agree to be bound by these Terms of Service. If you do not agree, please do not use the application.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">2. Your Data</h2>
              <p>Kiv is designed with a "privacy-first" philosophy. Your entries, moods, and reflections belong solely to you. We do not claim ownership over any content you log in the application.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">3. Use of Service</h2>
              <p>Kiv is intended for personal, non-commercial use. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">4. Limitations</h2>
              <p>Kiv is a tool for self-reflection and mood tracking. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">5. Modifications</h2>
              <p>We reserve the right to modify or terminate the service for any reason, without notice at any time. We also reserve the right to update these terms periodically.</p>
            </section>
          </div>

          <div className="mt-20 pt-12 border-t border-border/30">
            <p className="text-xs text-text-secondary opacity-50">Last updated: May 2026</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
