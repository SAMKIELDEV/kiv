"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-bg px-6 text-center overflow-hidden">
      {/* Background Effects */}
      <div className="grain" />
      <div className="premium-gradient" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-accent mb-4"
        >
          Error 404
        </motion.span>
        
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-8xl font-black tracking-tighter text-text-primary md:text-9xl mb-6"
        >
          Lost?
        </motion.h1>
        
        <div className="max-w-md space-y-4 mb-10">
          <h2 className="font-heading text-2xl font-semibold text-text-primary md:text-3xl">
            Some thoughts are meant to stay private.
          </h2>
          <p className="text-text-secondary text-base md:text-lg leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Take a breath, and let's get you back to your journal.
          </p>
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link 
            href="/" 
            className="group flex items-center gap-3 bg-accent text-accent-foreground px-16 py-6 rounded-full font-heading font-bold text-lg transition-all duration-300 shadow-xl shadow-accent/10"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Decorative Orbs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.08, 0.05]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent blur-[100px]" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.05, 0.07, 0.05]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-accent blur-[100px]" 
      />
    </main>
  );
}
