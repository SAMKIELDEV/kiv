import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/db/models/user";
import { EntryModel } from "@/lib/db/models/entry";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (authHeader !== `Bearer ${process.env.INTERNAL_API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const now = new Date();
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [
      totalSignups,
      dau,
      wau,
      mau,
      totalEntries,
      signupsByDay,
      dauByDay
    ] = await Promise.all([
      User.countDocuments(),
      EntryModel.distinct("userId", { createdAt: { $gte: todayStart } }).then(res => res.length),
      EntryModel.distinct("userId", { createdAt: { $gte: weekAgo } }).then(res => res.length),
      EntryModel.distinct("userId", { createdAt: { $gte: monthAgo } }).then(res => res.length),
      EntryModel.countDocuments(),
      // Signups by day last 30 days
      User.aggregate([
        { $match: { createdAt: { $gte: monthAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // DAU by day last 14 days
      EntryModel.aggregate([
        { $match: { createdAt: { $gte: fourteenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, users: { $addToSet: "$userId" } } },
        { $project: { _id: 1, count: { $size: "$users" } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const avgCheckInsPerUser = totalSignups > 0 ? totalEntries / totalSignups : 0;

    // Map to ensure all days are represented in dauByDay even if 0
    const dauMap = new Map(dauByDay.map(d => [d._id, d.count]));
    const finalDauByDay = [];
    for (let i = 13; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      finalDauByDay.push({ date: dateStr, count: dauMap.get(dateStr) || 0 });
    }

    const totalUsersWithOldEntries = await EntryModel.distinct("userId", { createdAt: { $lt: weekAgo } }).then(res => res.length);
    const retainedUsers = await EntryModel.distinct("userId", { 
      createdAt: { $gte: weekAgo },
      userId: { $in: await EntryModel.distinct("userId", { createdAt: { $lt: weekAgo } }) }
    }).then(res => res.length);
    
    const retentionRate = totalUsersWithOldEntries > 0 ? Math.round((retainedUsers / totalUsersWithOldEntries) * 100) : 0;

    return NextResponse.json({
      totalSignups,
      dau,
      wau,
      mau,
      retentionRate,
      avgCheckInsPerUser,
      signupsByDay: signupsByDay.map(d => ({ date: d._id, count: d.count })),
      dauByDay: finalDauByDay
    });

  } catch (error) {
    console.error("Kiv Internal Metrics Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
