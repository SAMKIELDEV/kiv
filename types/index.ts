export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export interface ReminderChannels {
  push: boolean;
  email: boolean;
}

export const DEFAULT_REMINDER_TIME = "20:00";
export const DEFAULT_REMINDER_TZ = "Africa/Lagos";
export const DEFAULT_REMINDER_CHANNELS: ReminderChannels = {
  push: false,
  email: false,
};

export interface KivUser {
  _id?: string;
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
  reminderTime?: string;
  reminderTimezone?: string;
  reminderChannels?: ReminderChannels;
  lastNotifiedDate?: string;
}

export interface Entry {
  _id?: string;
  userId: string;
  date: string; // YYYY-MM-DD
  mood: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  promptResponse: string | null;
  note: string | null;
  factors?: string[];
  createdAt: Date;
}

export interface StreakData {
  current: number;
  longest: number;
}

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export const MOOD_EMOJIS: Record<MoodValue, string> = {
  1: "😔",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

export const MOOD_LABELS: Record<MoodValue, string> = {
  1: "Rough",
  2: "Meh",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export const FACTORS = [
  "Work",
  "Family",
  "Friends",
  "Health",
  "Sleep",
  "Food",
  "Exercise",
  "Partner",
  "Finance",
  "Hobby",
  "Weather",
  "Travel",
];
