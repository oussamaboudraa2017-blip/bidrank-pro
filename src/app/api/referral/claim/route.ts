export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { requireAuth } = await import("@/lib/session");
    const { db } = await import("@/lib/db");

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const userId = session.user.id;

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || !user.referredByCode) {
      return NextResponse.json({ error: "No referral code on file" }, { status: 400 });
    }

    const referral = await db.referral.findFirst({
      where: { referredId: userId, status: "pending" },
    });

    if (!referral) {
      return NextResponse.json({ error: "No pending referral found" }, { status: 404 });
    }

    const subscription = await db.subscription.findFirst({
      where: { userId, status: "active" },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: "Must have an active paid subscription to claim referral credit" },
        { status: 400 }
      );
    }

    await db.referral.update({
      where: { id: referral.id },
      data: { status: "activated", activatedAt: new Date() },
    });

    await db.referralCredit.create({
      data: {
        userId: referral.referrerId,
        amount: 2500,
        source: "referral_bonus",
        referralId: referral.id,
        description: `$25 referral credit — ${user.name || user.email} subscribed`,
      },
    });

    await db.referralCredit.create({
      data: {
        userId,
        amount: 2500,
        source: "referral_bonus",
        referralId: referral.id,
        description: `$25 welcome credit for signing up with a referral`,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Referral activated! Both you and your referrer received $25 credit.",
      referrerReward: 2500,
      referredReward: 2500,
    });
  } catch (error) {
    console.error("[/api/referral/claim]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}