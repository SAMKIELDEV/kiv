"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MoodSelector } from "./mood-selector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { MoodValue, Entry } from "@/types";
import { MOOD_EMOJIS } from "@/types";

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
      toast.success("Checked in!");
      
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center gap-4 py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center"
          >
            <Check className="w-8 h-8 text-accent" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-semibold text-text-primary"
          >
            You&apos;re checked in {mood && MOOD_EMOJIS[mood]}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-text-secondary"
          >
            See you tomorrow
          </motion.p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <MoodSelector value={mood} onChange={setMood} />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-text-secondary font-medium">
              {prompt}
            </label>
            <Textarea
              id="prompt-response"
              value={promptResponse}
              onChange={(e) => setPromptResponse(e.target.value)}
              placeholder="Optional — answer if it speaks to you"
              className="min-h-[100px]"
            />
          </div>

          <Textarea
            id="note"
            label="Anything else?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Free write — no rules here"
            className="min-h-[120px]"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={!mood || isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isSubmitting ? "Saving..." : "Check in"}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
