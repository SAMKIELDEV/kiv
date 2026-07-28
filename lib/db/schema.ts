import { pgTable, text, timestamp, integer, uniqueIndex, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().unique(), // SAMKIEL ID
  name: text("name").notNull(),
  email: text("email").notNull(),
  reminderTime: text("reminder_time"),
  reminderTimezone: text("reminder_timezone"),
  reminderChannels: jsonb("reminder_channels").$type<{
    push?: boolean;
    email?: boolean;
  }>(),
  lastNotifiedDate: text("last_notified_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const entries = pgTable(
  "entries",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(), // SAMKIEL ID
    date: text("date").notNull(),
    mood: integer("mood").notNull(),
    prompt: text("prompt").default(""),
    promptResponse: text("prompt_response").default(""),
    note: text("note"),
    factors: jsonb("factors").$type<string[]>().default([]),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdDateIdx: uniqueIndex("user_id_date_idx").on(table.userId, table.date),
  })
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    subscription: jsonb("subscription").notNull().$type<{
      endpoint: string;
      keys: {
        p256dh: string;
        auth: string;
      };
    }>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("sub_user_id_idx").on(table.userId),
  })
);
