export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// Called after sign-up (email or Google) to set trial dates and handle referral codes
export async function POST(req: NextRequest) {
  try {
    const { db } = await import("@/lib/db");
    const { getSession } = await import("@/lib/session");
    const body = await req.json();
    const { email: bodyEmail, referralCode } = body;

    // Try to get email from session (for Google sign-up) or from body (for email sign-up)
    let userId: string | null = null;
    let userEmail: string | null = bodyEmail || null;

    if (!userEmail) {
      const session = await getSession();
      if (session?.user) {
        userId = session.user.id;
        userEmail = session.user.email;
      }
    }

    if (!userEmail) {
      return NextResponse.json({ error: "Could not identify user" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {
      trialStartsAt: new Date(),
      trialEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    // Handle referral code
    if (referralCode) {
      const referrer = await db.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        updateData.referredByCode = referralCode;
        await db.referral.create({
          data: {
            referrerId: referrer.id,
            referredId: user.id,
            referralCode,
            status: "pending",
          },
        }).catch(() => {});
      }
    }

    await db.user.update({
      where: { id: user.id },
      data: updateData,
    });

    // Trigger onboarding emails
    import("@/lib/onboarding").then(({ triggerOnboardingSequence }) =>
      triggerOnboardingSequence(user.id).catch((err: any) =>
        console.error("[Signup Callback] Failed to trigger onboarding:", err)
      )
    );

    // Track trial started event
    db.analyticsEvent.create({
      data: {
        userId: user.id,
        event: "trial_started",
        category: "lifecycle",
        metadata: { plan: user.plan || "free" },
      },
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Signup Callback] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}