import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users as usersTable, entries as entriesTable } from "@/lib/db/schema";
import { count, gte, lt, sql, inArray } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [{ totalSignups }] = await db.select({ totalSignups: count() }).from(usersTable);
    const [{ totalEntries }] = await db.select({ totalEntries: count() }).from(entriesTable);

    // Active users (DAU, WAU, MAU)
    const dauRes = await db
      .select({ userId: entriesTable.userId })
      .from(entriesTable)
      .where(gte(entriesTable.createdAt, todayStart))
      .groupBy(entriesTable.userId);
    const dau = dauRes.length;

    const wauRes = await db
      .select({ userId: entriesTable.userId })
      .from(entriesTable)
      .where(gte(entriesTable.createdAt, weekAgo))
      .groupBy(entriesTable.userId);
    const wau = wauRes.length;

    const mauRes = await db
      .select({ userId: entriesTable.userId })
      .from(entriesTable)
      .where(gte(entriesTable.createdAt, monthAgo))
      .groupBy(entriesTable.userId);
    const mau = mauRes.length;

    // Signups by day last 30 days
    const signupsByDayRes = await db
      .select({
        date: sql<string>`to_char(${usersTable.createdAt}, 'YYYY-MM-DD')`,
        count: count(),
      })
      .from(usersTable)
      .where(gte(usersTable.createdAt, monthAgo))
      .groupBy(sql`to_char(${usersTable.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${usersTable.createdAt}, 'YYYY-MM-DD')`);

    // DAU by day last 14 days
    const dauByDayRes = await db
      .select({
        date: sql<string>`to_char(${entriesTable.createdAt}, 'YYYY-MM-DD')`,
        count: count(sql`DISTINCT ${entriesTable.userId}`),
      })
      .from(entriesTable)
      .where(gte(entriesTable.createdAt, fourteenDaysAgo))
      .groupBy(sql`to_char(${entriesTable.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${entriesTable.createdAt}, 'YYYY-MM-DD')`);

    const avgCheckInsPerUser = totalSignups > 0 ? totalEntries / totalSignups : 0;

    const dauMap = new Map(dauByDayRes.map((d) => [d.date, Number(d.count)]));
    const finalDauByDay = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      finalDauByDay.push({ date: dateStr, count: dauMap.get(dateStr) || 0 });
    }

    const oldUsersRes = await db
      .select({ userId: entriesTable.userId })
      .from(entriesTable)
      .where(lt(entriesTable.createdAt, weekAgo))
      .groupBy(entriesTable.userId);
    const oldUserIds = oldUsersRes.map((u) => u.userId);

    let retentionRate = 0;
    if (oldUserIds.length > 0) {
      const retainedRes = await db
        .select({ userId: entriesTable.userId })
        .from(entriesTable)
        .where(
          sql`${gte(entriesTable.createdAt, weekAgo)} AND ${inArray(entriesTable.userId, oldUserIds)}`
        )
        .groupBy(entriesTable.userId);
      retentionRate = Math.round((retainedRes.length / oldUserIds.length) * 100);
    }

    return NextResponse.json({
      totalSignups,
      dau,
      wau,
      mau,
      retentionRate,
      avgCheckInsPerUser,
      signupsByDay: signupsByDayRes.map((d) => ({ date: d.date, count: Number(d.count) })),
      dauByDay: finalDauByDay,
    });
  } catch (error) {
    console.error("Kiv Internal Metrics Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
