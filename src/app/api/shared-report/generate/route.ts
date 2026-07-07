export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { requireAuth } = await import("@/lib/session");
    const { db } = await import("@/lib/db");

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await request.json();
    const { analysisId } = body;

    if (!analysisId) {
      return NextResponse.json({ error: "analysisId is required" }, { status: 400 });
    }

    const analysis = await db.rfpAnalysis.findFirst({
      where: { id: analysisId, userId },
    });

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 });
    }

    const existing = await db.sharedReport.findFirst({
      where: {
        analysisId,
        userId,
        expiresAt: { gt: new Date() },
      },
    });

    if (existing) {
      return NextResponse.json({
        token: existing.token,
        shareUrl: `https://www.bidrank.pro/shared/${existing.token}`,
        expiresAt: existing.expiresAt,
      });
    }

    const token = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const sharedReport = await db.sharedReport.create({
      data: {
        userId,
        analysisId,
        token,
        expiresAt,
      },
    });

    return NextResponse.json({
      token: sharedReport.token,
      shareUrl: `https://www.bidrank.pro/shared/${sharedReport.token}`,
      expiresAt: sharedReport.expiresAt,
    });
  } catch (error) {
    console.error("[/api/shared-report/generate]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}