export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/session");
    const { db } = await import("@/lib/db");

    const session = await requireAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true },
    });
    if (!user || (user.role !== "admin" && user.email !== process.env.ADMIN_EMAIL)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const range = url.searchParams.get("range") || "30d"; // 7d, 30d, 90d

    const now = new Date();
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // ── Run all queries in parallel ──
    const [
      totalUsers,
      newUsers,
      paidUsers,
      activeUsers,
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers,
      events,
      signupEvents,
      freeToolEvents,
      trialToPaidEvents,
      freeToSignupEvents,
      subscriptions,
      churnedSubs,
      topEvents,
      rfpTypes,
      referralEvents,
      planDistribution,
      trialCount,
    ] = await Promise.all([
      // Total users
      db.user.count(),

      // New users in period
      db.user.count({ where: { createdAt: { gte: since } } }),

      // Paid users
      db.user.count({ where: { plan: { not: "free" } } }),

      // Active users (did anything in period)
      db.analyticsEvent.groupBy({ by: ["userId"], where: { createdAt: { gte: since }, userId: { not: null } } }).then(r => r.length),

      // DAU
      db.analyticsEvent.groupBy({ by: ["userId"], where: { createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }, userId: { not: null } } }).then(r => r.length),

      // WAU
      db.analyticsEvent.groupBy({ by: ["userId"], where: { createdAt: { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }, userId: { not: null } } }).then(r => r.length),

      // MAU
      db.analyticsEvent.groupBy({ by: ["userId"], where: { createdAt: { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }, userId: { not: null } } }).then(r => r.length),

      // All events in period (for timeline)
      db.analyticsEvent.findMany({
        where: { createdAt: { gte: since } },
        select: { event: true, category: true, createdAt: true },
        orderBy: { createdAt: "asc" },
      }),

      // Signups in period
      db.analyticsEvent.count({ where: { event: "user_signed_up", createdAt: { gte: since } } }),

      // Free tool uses in period
      db.analyticsEvent.count({ where: { event: "free_tool_used", createdAt: { gte: since } } }),

      // Trial to paid: users who started subscription
      db.analyticsEvent.count({ where: { event: "subscription_started", createdAt: { gte: since } } }),

      // Free tool to signup
      db.analyticsEvent.count({ where: { event: "free_tool_to_signup_conversion", createdAt: { gte: since } } }),

      // Active subscriptions
      db.subscription.count({ where: { status: "active" } }),

      // Churned (canceled)
      db.subscription.count({ where: { status: "canceled" } }),

      // Top events
      db.analyticsEvent.groupBy({
        by: ["event"],
        where: { createdAt: { gte: since } },
        _count: { event: true },
        orderBy: { _count: { event: "desc" } },
        take: 10,
      }),

      // Most common RFP types (from analyses)
      db.rfpAnalysis.groupBy({
        by: ["setAsideType"],
        where: { createdAt: { gte: since } },
        _count: { setAsideType: true },
        orderBy: { _count: { setAsideType: "desc" } },
        take: 10,
      }),

      // Referral performance
      db.referral.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // Plan distribution
      db.user.groupBy({
        by: ["plan"],
        _count: { plan: true },
        orderBy: { _count: { plan: "desc" } },
      }),

      // Trials started in period
      db.analyticsEvent.count({ where: { event: "trial_started", createdAt: { gte: since } } }),
    ]);

    // ── MRR Calculation ──
    const planPrices: Record<string, number> = { starter: 49, pro: 149, studio: 399 };
    const activePlanCounts = await db.user.groupBy({
      by: ["plan"],
      where: { plan: { not: "free" } },
      _count: { plan: true },
    });
    let mrr = 0;
    for (const pc of activePlanCounts) {
      mrr += (planPrices[pc.plan] || 0) * pc._count.plan;
    }
    const arpu = paidUsers > 0 ? Math.round(mrr / paidUsers) : 0;
    const churnRate = subscriptions > 0 ? ((churnedSubs / (subscriptions + churnedSubs)) * 100).toFixed(1) : "0";

    // ── Timeline: daily event counts ──
    const dailyMap: Record<string, Record<string, number>> = {};
    for (const e of events) {
      const day = e.createdAt.toISOString().slice(0, 10);
      if (!dailyMap[day]) dailyMap[day] = {};
      dailyMap[day][e.event] = (dailyMap[day][e.event] || 0) + 1;
    }
    const timeline = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({ date, ...counts }));

    return NextResponse.json({
      range,
      period: { from: since.toISOString(), to: now.toISOString() },
      users: {
        total: totalUsers,
        newInPeriod: newUsers,
        paid: paidUsers,
        activeInPeriod: activeUsers,
      },
      activity: {
        dau: dailyActiveUsers,
        wau: weeklyActiveUsers,
        mau: monthlyActiveUsers,
      },
      conversions: {
        freeToolUses: freeToolEvents,
        freeToolToSignup: freeToSignupEvents,
        trialToPaid: trialToPaidEvents,
        trialsStarted: trialCount,
        signupToPaidRate: signupEvents > 0 ? ((trialToPaidEvents / signupEvents) * 100).toFixed(1) + "%" : "N/A",
      },
      revenue: {
        mrr,
        arpu,
        activeSubscriptions: subscriptions,
        churnedSubscriptions: churnedSubs,
        churnRate: churnRate + "%",
      },
      topEvents: topEvents.map(t => ({ event: t.event, count: t._count.event })),
      rfpTypes: rfpTypes.map(t => ({ type: t.setAsideType || "Unknown", count: t._count.setAsideType })),
      referrals: referralEvents.map(r => ({ status: r.status, count: r._count.status })),
      planDistribution: planDistribution.map(p => ({ plan: p.plan, count: p._count.plan })),
      timeline,
    });
  } catch (error) {
    console.error("[Admin Analytics Error]", error);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}