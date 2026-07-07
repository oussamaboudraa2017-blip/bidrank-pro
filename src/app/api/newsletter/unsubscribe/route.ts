export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/?unsubscribed=missing", request.url));
    }

    const sub = await db.newsletterSubscription.findFirst({ where: { token } });

    if (!sub) {
      return NextResponse.redirect(new URL("/?unsubscribed=not_found", request.url));
    }

    await db.newsletterSubscription.update({
      where: { email: sub.email },
      data: { active: false },
    });

    return NextResponse.redirect(new URL("/?unsubscribed=success", request.url));
  } catch (error) {
    console.error("[/api/newsletter/unsubscribe]", error);
    return NextResponse.redirect(new URL("/?unsubscribed=error", request.url));
  }
}