"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PrivacyPage() {
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
          <h1 className="font-heading font-extrabold text-5xl mb-12 tracking-tight">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-12 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">Our Commitment</h2>
              <p>At Kiv, we believe your thoughts and feelings should stay between you and your journal. Privacy isn't just a feature; it's our foundation.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">Data Collection</h2>
              <p>We only collect the information necessary to provide the service. This includes your account details (email) and the data you explicitly enter (mood logs, notes). We do not track your location or use intrusive analytics.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">No Data Selling</h2>
              <p>We will never sell, rent, or trade your personal data or your journal entries to third parties. Period.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">Security</h2>
              <p>We use industry-standard encryption to protect your data both in transit and at rest. Your privacy is protected by the same security protocols used by leading financial institutions.</p>
            </section>

            <section>
              <h2 className="text-text-primary text-xl font-bold mb-4">Your Rights</h2>
              <p>You have the right to access, export, or delete your data at any time. Your journal is yours, and you can take it with you whenever you choose.</p>
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
