export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

const VALID_EVENTS = new Set([
  "user_signed_up", "user_logged_in", "trial_started",
  "subscription_started", "subscription_cancelled", "subscription_upgraded",
  "free_tool_used", "analysis_started", "analysis_completed", "analysis_exported",
  "referral_link_clicked", "referral_converted",
  "blog_article_read", "case_study_viewed", "pricing_page_viewed", "free_tool_to_signup_conversion",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, category, metadata } = body;

    if (!event || !VALID_EVENTS.has(event)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const { db } = await import("@/lib/db");

    let userId: string | null = null;
    try {
      const { getSession } = await import("@/lib/session");
      const session = await getSession();
      if (session?.user) userId = session.user.id;
    } catch { /* not authenticated — ok */ }

    await db.analyticsEvent.create({
      data: {
        userId,
        event,
        category: category || "general",
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        path: body.path || null,
        userAgent: req.headers.get("user-agent") || null,
        ip: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Analytics Track Error]", error);
    return NextResponse.json({ ok: true });
  }
}