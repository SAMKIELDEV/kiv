import { MongoClient } from "mongodb";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { users, entries, subscriptions } from "../lib/db/schema";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const DATABASE_URL = process.env.DATABASE_URL;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is required");
  process.exit(1);
}

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is required");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function migrate() {
  console.log("🚀 Starting Kiv MongoDB to PostgreSQL data migration...");
  const mongoClient = new MongoClient(MONGODB_URI);
  await mongoClient.connect();
  const mongoDb = mongoClient.db();

  try {
    // 1. Migrate Users
    const mongoUsers = await mongoDb.collection("users").find({}).toArray();
    console.log(`📦 Found ${mongoUsers.length} users to migrate.`);
    for (const u of mongoUsers) {
      await db
        .insert(users)
        .values({
          userId: u.userId,
          name: u.name,
          email: u.email,
          reminderTime: u.reminderTime || null,
          reminderTimezone: u.reminderTimezone || null,
          reminderChannels: u.reminderChannels || null,
          lastNotifiedDate: u.lastNotifiedDate || null,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }
    console.log("✅ Users migrated successfully.");

    // 2. Migrate Entries
    const mongoEntries = await mongoDb.collection("entries").find({}).toArray();
    console.log(`📦 Found ${mongoEntries.length} entries to migrate.`);
    for (const e of mongoEntries) {
      await db
        .insert(entries)
        .values({
          userId: e.userId,
          date: e.date,
          mood: e.mood,
          prompt: e.prompt || "",
          promptResponse: e.promptResponse || "",
          note: e.note || null,
          factors: e.factors || [],
          createdAt: e.createdAt ? new Date(e.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }
    console.log("✅ Entries migrated successfully.");

    // 3. Migrate Subscriptions
    const mongoSubs = await mongoDb.collection("subscriptions").find({}).toArray();
    console.log(`📦 Found ${mongoSubs.length} push subscriptions to migrate.`);
    for (const s of mongoSubs) {
      await db
        .insert(subscriptions)
        .values({
          userId: s.userId,
          subscription: s.subscription,
          createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
        })
        .onConflictDoNothing();
    }
    console.log("✅ Subscriptions migrated successfully.");

    console.log("\n🎉 Data migration complete!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoClient.close();
    process.exit(0);
  }
}

migrate();
