import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Lazy imports to avoid build-time evaluation
async function getDb() {
  const { db } = await import("@/lib/db");
  return db;
}

async function getSendEmail() {
  const { sendEmail } = await import("@/lib/email");
  return sendEmail;
}

async function getDispatch() {
  const { getOnboardingEmail } = await import("@/lib/emails/dispatch");
  return getOnboardingEmail;
}

// Vercel Cron: runs every 30 minutes
// Processes OnboardingEmail rows where status = 'scheduled' AND scheduledAt <= now()
export async function GET(req: Request) {
  // Security: Only allow Vercel Cron to call this route
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Also allow calls from localhost (development)
    const isDev =
      process.env.NODE_ENV === "development" ||
      req.headers.get("x-vercel-ip") === "127.0.0.1";
    if (!isDev) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const db = await getDb();
    const sendEmail = await getSendEmail();
    const getOnboardingEmail = await getDispatch();
    const now = new Date();

    // Fetch all scheduled emails that are due
    const pendingEmails = await db.onboardingEmail.findMany({
      where: {
        status: "scheduled",
        scheduledAt: { lte: now },
      },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
      take: 50, // Process in batches to avoid timeouts
    });

    if (pendingEmails.length === 0) {
      return NextResponse.json({ processed: 0, message: "No emails due" });
    }

    let sent = 0;
    let failed = 0;

    for (const record of pendingEmails) {
      if (!record.user?.email) {
        // User has no email — mark as failed
        await db.onboardingEmail.update({
          where: { id: record.id },
          data: { status: "failed", sentAt: new Date() },
        });
        failed++;
        continue;
      }

      const template = getOnboardingEmail(
        record.emailKey,
        record.user.name || undefined
      );

      if (!template) {
        console.error(
          `[cron/onboarding] No template for key: ${record.emailKey}`
        );
        await db.onboardingEmail.update({
          where: { id: record.id },
          data: { status: "failed", sentAt: new Date() },
        });
        failed++;
        continue;
      }

      const result = await sendEmail({
        to: record.user.email,
        subject: template.subject,
        html: template.html,
      });

      if (result.success) {
        await db.onboardingEmail.update({
          where: { id: record.id },
          data: { status: "sent", sentAt: new Date() },
        });
        sent++;
        console.log(
          `[cron/onboarding] Sent ${record.emailKey} to ${record.user.email}`
        );
      } else {
        await db.onboardingEmail.update({
          where: { id: record.id },
          data: { status: "failed", sentAt: new Date() },
        });
        failed++;
        console.error(
          `[cron/onboarding] Failed to send ${record.emailKey} to ${record.user.email}: ${result.message}`
        );
      }
    }

    return NextResponse.json({
      processed: pendingEmails.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error("[cron/onboarding] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}