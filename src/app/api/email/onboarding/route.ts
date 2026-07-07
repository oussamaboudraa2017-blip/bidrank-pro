export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { requireAuth } = await import("@/lib/session");
    const { triggerOnboardingSequence } = await import("@/lib/onboarding");

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const result = await triggerOnboardingSequence(session.user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/email/onboarding]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}