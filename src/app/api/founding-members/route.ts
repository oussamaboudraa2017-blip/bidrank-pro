export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

const MAX_FOUNDING_MEMBERS = 100;
const CACHE_TTL_MS = 60_000; // 1 minute

let cachedCount: number | null = null;
let cachedAt = 0;

export async function GET() {
  const now = Date.now();

  // Return cached value if fresh
  if (cachedCount !== null && now - cachedAt < CACHE_TTL_MS) {
    return NextResponse.json({
      count: cachedCount,
      remaining: Math.max(0, MAX_FOUNDING_MEMBERS - cachedCount),
      max: MAX_FOUNDING_MEMBERS,
    });
  }

  try {
    const { db } = await import("@/lib/db");

    // Count users on any paid plan (starter, pro, studio, enterprise, basic)
    const count = await db.user.count({
      where: {
        plan: { notIn: ["free"] },
      },
    });

    cachedCount = count;
    cachedAt = now;

    return NextResponse.json({
      count,
      remaining: Math.max(0, MAX_FOUNDING_MEMBERS - count),
      max: MAX_FOUNDING_MEMBERS,
    });
  } catch (error) {
    // On DB error, return a fallback so the UI still works
    console.error("[Founding Members] DB error:", error);
    return NextResponse.json({
      count: 0,
      remaining: MAX_FOUNDING_MEMBERS,
      max: MAX_FOUNDING_MEMBERS,
    });
  }
}