export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { requireAuth } = await import("@/lib/session");
    const { db } = await import("@/lib/db");
    const { getPlanLimits } = await import("@/lib/auth");

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ plan: null, authenticated: false });
    }

    const userId = session.user.id;
    let plan = "free";
    let analysesThisMonth = 0;
    let trialEndsAt: string | null = null;
    let subscriptionStatus: string | null = null;
    let currentPeriodEnd: string | null = null;
    let cancelAtPeriodEnd = false;

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        plan: true,
        analysesThisMonth: true,
        trialEndsAt: true,
        subscription: {
          select: {
            status: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true,
          },
        },
        stats: {
          select: {
            totalAnalyses: true,
            thisMonthAnalyses: true,
            averageScore: true,
            risksFlagged: true,
            timeSavedMinutes: true,
          },
        },
      },
    });

    if (user) {
      plan = user.plan || "free";
      analysesThisMonth = user.analysesThisMonth;
      trialEndsAt = user.trialEndsAt?.toISOString() || null;
      if (user.subscription) {
        subscriptionStatus = user.subscription.status;
        currentPeriodEnd = user.subscription.currentPeriodEnd?.toISOString() || null;
        cancelAtPeriodEnd = user.subscription.cancelAtPeriodEnd;
      }
    }

    const limits = getPlanLimits(plan);

    return NextResponse.json({
      plan,
      authenticated: true,
      analysesThisMonth,
      limits,
      trialEndsAt,
      subscriptionStatus,
      currentPeriodEnd,
      cancelAtPeriodEnd,
      stats: user?.stats || null,
    });
  } catch {
    return NextResponse.json({ plan: null, authenticated: false });
  }
}