export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const { email, source } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await db.newsletterSubscription.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing && existing.active) {
      return NextResponse.json({ message: "Already subscribed" });
    }

    // Upsert — create or reactivate
    await db.newsletterSubscription.upsert({
      where: { email: normalizedEmail },
      update: { active: true, source: source || "footer" },
      create: {
        email: normalizedEmail,
        token: crypto.randomBytes(16).toString("hex"),
        active: true,
        source: source || "footer",
      },
    });

    return NextResponse.json({ message: "Subscribed successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[/api/newsletter/subscribe]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}