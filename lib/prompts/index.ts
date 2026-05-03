const prompts = [
  "What's one thing on your mind?",
  "What made you smile today?",
  "What's one thing you're looking forward to?",
  "What's one thing you want to let go of today?",
  "What are you grateful for right now?",
  "What drained your energy today?",
  "What did you do just for yourself today?",
  "What's something you learned today?",
  "How did you treat yourself today?",
  "What's one word to describe your day?",
  "What's something you're proud of this week?",
  "What would have made today better?",
  "Who made a positive impact on your day?",
  "What's something you've been avoiding?",
  "What does your body need right now?",
];

function getDayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getTodaysPrompt(): string {
  const dayOfYear = getDayOfYear();
  return prompts[dayOfYear % prompts.length];
}

export function getPromptForDate(date: Date): string {
  const dayOfYear = getDayOfYear(date);
  return prompts[dayOfYear % prompts.length];
}
