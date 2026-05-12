import { PROMPTS } from "@/lib/prompts";

function djb2(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  // Force unsigned 32-bit
  return hash >>> 0;
}

export function getDailyPrompt(userId: string, date: string): string {
  const seed = djb2(`${userId}|${date}`);
  return PROMPTS[seed % PROMPTS.length];
}
