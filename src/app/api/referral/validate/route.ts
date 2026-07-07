export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ valid: false, error: "Missing code" }, { status: 400 });
    }

    const referrer = await db.user.findUnique({
      where: { referralCode: code },
      select: { id: true, name: true, referralCode: true },
    });

    if (!referrer) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({
      valid: true,
      referrerName: referrer.name || "A BidRank User",
    });
  } catch (error) {
    console.error("[/api/referral/validate]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}