export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import crypto from "crypto";

function generateReferralCode(name?: string | null): string {
  const base = (name || "user")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 6);
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  return `${base}${rand}`;
}

export async function POST() {
  try {
    const { requireAuth } = await import("@/lib/session");
    const { db } = await import("@/lib/db");

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const userId = session.user.id;

    // Ensure user exists in DB (upsert = create or do nothing)
    const user = await db.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: session.user.name || "User",
        email: session.user.email || "",
        plan: "free",
      },
    });

    if (user.referralCode) {
      return NextResponse.json({
        referralCode: user.referralCode,
        referralLink: `https://www.bidrank.pro?ref=${user.referralCode}`,
      });
    }

    // Generate unique referral code
    let code = generateReferralCode(user.name);
    let exists = await db.user.findUnique({ where: { referralCode: code } });
    let attempts = 0;
    while (exists && attempts < 10) {
      code = generateReferralCode(user.name);
      exists = await db.user.findUnique({ where: { referralCode: code } });
      attempts++;
    }
    if (exists) {
      code = crypto.randomBytes(5).toString("hex").toUpperCase();
    }

    const updated = await db.user.update({
      where: { id: userId },
      data: { referralCode: code },
    });

    return NextResponse.json({
      referralCode: updated.referralCode,
      referralLink: `https://www.bidrank.pro?ref=${updated.referralCode}`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[/api/referral/generate]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET() {
  return new NextResponse("Method not allowed", { status: 405 });
}