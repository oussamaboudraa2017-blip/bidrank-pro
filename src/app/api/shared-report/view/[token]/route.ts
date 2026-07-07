export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { db } = await import("@/lib/db");
    const { token } = await params;

    const sharedReport = await db.sharedReport.findUnique({
      where: { token },
      include: {
        analysis: {
          select: {
            id: true,
            fileName: true,
            executiveSummary: true,
            readinessScore: true,
            contractValue: true,
            submissionDeadline: true,
            agency: true,
            naicsCode: true,
            setAsideType: true,
            complianceJson: true,
            risksJson: true,
            recommendationsJson: true,
            createdAt: true,
          },
        },
        user: {
          select: { name: true, company: true },
        },
      },
    });

    if (!sharedReport) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Check expiry
    if (new Date() > sharedReport.expiresAt) {
      return NextResponse.json({ error: "This shared link has expired" }, { status: 410 });
    }

    // Increment view count (fire-and-forget)
    db.sharedReport.update({
      where: { id: sharedReport.id },
      data: { viewCount: { increment: 1 } },
    }).catch(() => {});

    // Parse JSON fields
    let complianceChecklist: unknown[] = [];
    let risks: unknown[] = [];
    let recommendations: string[] = [];

    try {
      const comp = JSON.parse(sharedReport.analysis.complianceJson);
      complianceChecklist = comp.checklist || comp.complianceChecklist || comp;
    } catch {}
    try {
      const rsk = JSON.parse(sharedReport.analysis.risksJson);
      risks = rsk.risks || rsk;
    } catch {}
    try {
      const rec = JSON.parse(sharedReport.analysis.recommendationsJson);
      recommendations = Array.isArray(rec) ? rec : rec.recommendations || [];
    } catch {}

    return NextResponse.json({
      shareInfo: {
        sharedBy: sharedReport.user.name || "A BidRank User",
        company: sharedReport.user.company,
        sharedAt: sharedReport.createdAt,
        expiresAt: sharedReport.expiresAt,
        viewCount: sharedReport.viewCount + 1,
      },
      analysis: {
        ...sharedReport.analysis,
        complianceChecklist,
        risks,
        recommendations,
      },
    });
  } catch (error) {
    console.error("[/api/shared-report/view]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}