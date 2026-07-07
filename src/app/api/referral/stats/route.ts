export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { requireAuth } = await import("@/lib/session");
    const { db } = await import("@/lib/db");

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const userId = session.user.id;

    const user = await db.user.findUnique({ where: { id: userId } }).catch(() => null);
    if (!user) {
      return NextResponse.json({
        referralCode: null,
        referralLink: null,
        totalCredits: 0,
        totalReferrals: 0,
        pendingReferrals: 0,
        activatedReferrals: 0,
        referralHistory: [],
      });
    }

    const credits = await db.referralCredit.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    const totalCreditsCents = credits._sum.amount || 0;
    const totalCredits = totalCreditsCents / 100;

    const referrals = await db.referral.findMany({
      where: { referrerId: userId },
      include: {
        referrer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const pendingCount = referrals.filter((r) => r.status === "pending").length;
    const activatedCount = referrals.filter((r) => r.status === "activated").length;

    const referralHistory = referrals.map((r) => ({
      id: r.id,
      status: r.status,
      reward: `$${r.referrerReward / 100}`,
      referredEmail: "Referred User",
      createdAt: r.createdAt,
      activatedAt: r.activatedAt,
    }));

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink: user.referralCode
        ? `https://www.bidrank.pro?ref=${user.referralCode}`
        : null,
      totalCredits,
      totalReferrals: referrals.length,
      pendingReferrals: pendingCount,
      activatedReferrals: activatedCount,
      referralHistory,
    });
  } catch (error) {
    console.error("[/api/referral/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}