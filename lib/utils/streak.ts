import type { StreakData } from "@/types";

function formatDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function computeStreak(dates: string[]): StreakData {
  if (dates.length === 0) return { current: 0, longest: 0 };

  const dateSet = new Set(dates);
  const sortedDates = [...dateSet].sort().reverse();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = 0;
  const checkDate = new Date(today);

  const todayStr = formatDateStr(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDateStr(yesterday);

  if (dateSet.has(todayStr)) {
    while (dateSet.has(formatDateStr(checkDate))) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  } else if (dateSet.has(yesterdayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    while (dateSet.has(formatDateStr(checkDate))) {
      current++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  let longest = 0;
  let tempStreak = 1;

  for (let i = 0; i < sortedDates.length - 1; i++) {
    const curr = new Date(sortedDates[i] + "T00:00:00");
    const next = new Date(sortedDates[i + 1] + "T00:00:00");
    const diffDays =
      (curr.getTime() - next.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays === 1) {
      tempStreak++;
    } else {
      longest = Math.max(longest, tempStreak);
      tempStreak = 1;
    }
  }
  longest = Math.max(longest, tempStreak);
  longest = Math.max(longest, current);

  return { current, longest };
}
