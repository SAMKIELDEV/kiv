"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MoodSelector } from "./mood-selector";
import { Textarea } from "@/components/ui/textarea";
import type { MoodValue, Entry } from "@/types";

interface CheckInFormProps {
  prompt: string;
  onComplete: (entry: Entry) => void;
}

export function CheckInForm({ prompt, onComplete }: CheckInFormProps) {
  const [mood, setMood] = useState<MoodValue | null>(null);
  const [promptResponse, setPromptResponse] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) {
      toast.error("Select a mood to check in");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mood,
          prompt,
          promptResponse: promptResponse.trim() || null,
          note: note.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to check in");
      }

      const entry = await res.json();
      setIsComplete(true);
      
      setTimeout(() => onComplete(entry), 1500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isComplete ? (
        <motion.div
          key="complete"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-2 py-12"
        >
          <p className="text-[15px] font-[600] text-accent">
            Checked in today ✓
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onSubmit={handleSubmit}
          className="flex flex-col"
        >
          <MoodSelector value={mood} onChange={setMood} />

          <div className="mt-[24px] flex flex-col">
            <label className="text-[14px] text-text-secondary italic font-[400] mb-[8px]">
              {prompt}
            </label>
            <textarea
              value={promptResponse}
              onChange={(e) => setPromptResponse(e.target.value)}
              className="w-full bg-surface border border-border rounded-[10px] px-[16px] py-[12px] text-text-primary text-[15px] font-[400] min-h-[80px] resize-vertical outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="mt-[24px] flex flex-col">
            <label className="text-[13px] text-text-secondary font-[400] mb-[8px]">
              Anything else?
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-surface border border-border rounded-[10px] px-[16px] py-[12px] text-text-primary text-[15px] font-[400] min-h-[100px] resize-vertical outline-none focus:border-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!mood || isSubmitting}
            className="w-full mt-[24px] bg-accent text-accent-dark font-[700] text-[15px] py-[14px] rounded-[12px] border-none cursor-pointer hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Check in"
            )}
          </button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

