"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[660px] mx-auto px-6 md:px-[48px] pt-[60px] text-center">
        <section className="flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[40px] md:text-[64px] font-[800] leading-[1.05] tracking-[-1.5px] flex flex-col items-center"
          >
            <span className="text-text-primary">Check in with</span>
            <span className="text-accent">yourself</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-[17px] text-text-secondary font-[400] max-w-[380px] mt-[24px] leading-relaxed"
          >
            A simple, private space to log how you&apos;re doing each day.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <Link 
              href="/login" 
              className="mt-[36px] bg-accent text-accent-dark font-[700] text-[15px] px-[28px] py-[13px] rounded-full hover:opacity-90 transition-opacity"
            >
              Get started →
            </Link>
            <p className="text-[13px] text-text-secondary mt-[10px]">
              Free forever · No credit card
            </p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}