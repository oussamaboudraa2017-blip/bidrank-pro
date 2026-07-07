import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Lazy imports to avoid build-time evaluation of Prisma Client
async function getDb() {
  const { db } = await import("@/lib/db");
  return db;
}

async function getSendEmail() {
  const { sendEmail } = await import("@/lib/email");
  return sendEmail;
}

async function getEmailTemplates() {
  const {
    reengagementTipEmail,
    featureHighlightEmail,
    trialEndingEmail,
    exitSurveyOfferEmail,
  } = await import("@/lib/emails/churn-prevention");
  return { reengagementTipEmail, featureHighlightEmail, trialEndingEmail, exitSurveyOfferEmail };
}

// Triggered by Vercel Cron: runs every 6 hours
// Checks for churn prevention triggers and sends appropriate emails

export async function GET(req: Request) {
  // Verify cron secret
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

  const now = new Date();
  const results = { reengagement: 0, featureHighlight: 0, trialEnding: 0, exitSurvey: 0 };

  try {
    const db = await getDb();
    const sendEmail = await getSendEmail();
    const { reengagementTipEmail, featureHighlightEmail, trialEndingEmail, exitSurveyOfferEmail } = await getEmailTemplates();

    // ── 1. No login for 7 days: Re-engagement email with tip ──
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

    // Find users with a session older than 7 days but who logged in 5-7 days ago
    // (so we only send once, in the 7-8 day window)
    const recentInactiveUsers = await db.user.findMany({
      where: {
        updatedAt: { gte: fiveDaysAgo, lte: sevenDaysAgo },
        plan: { in: ["free", "starter", "pro", "studio"] },
      },
      select: { id: true, name: true, email: true },
      take: 50,
    });

    for (const user of recentInactiveUsers) {
      // Check if we already sent this email (via analytics event)
      const alreadySent = await db.analyticsEvent.findFirst({
        where: {
          userId: user.id,
          event: "churn_reengagement_sent",
        },
      });
      if (alreadySent) continue;

      try {
        await sendEmail({
          to: user.email,
          subject: "A quick tip for your federal contracting",
          html: reengagementTipEmail(user.name),
        });
        await db.analyticsEvent.create({
          data: {
            userId: user.id,
            event: "churn_reengagement_sent",
            category: "lifecycle",
          },
        });
        results.reengagement++;
      } catch {
        // Skip on email failure, try next user
      }
    }

    // ── 2. No analysis for 14 days: Feature highlight + case study ──
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const twelveDaysAgo = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000);

    // Find users whose last analysis was 12-14 days ago
    const usersWithStaleAnalyses = await db.$queryRaw<
      { userId: string; name: string; email: string }[]
    >`
      SELECT u.id as "userId", u.name, u.email
      FROM "user" u
      INNER JOIN "user_stats" us ON us."userId" = u.id
      WHERE us."totalAnalyses" >= 1
        AND u.plan IN ('free', 'starter', 'pro', 'studio')
        AND NOT EXISTS (
          SELECT 1 FROM "analytics_event" ae
          WHERE ae."userId" = u.id AND ae.event = 'churn_feature_highlight_sent'
        )
      LIMIT 50
    `;

    for (const user of usersWithStaleAnalyses) {
      const lastAnalysis = await db.rfpAnalysis.findFirst({
        where: { userId: user.userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      });

      if (
        !lastAnalysis ||
        lastAnalysis.createdAt < fourteenDaysAgo ||
        lastAnalysis.createdAt > twelveDaysAgo
      )
        continue;

      try {
        await sendEmail({
          to: user.email,
          subject: "Your RFPs are waiting — here's what you're missing",
          html: featureHighlightEmail(user.name),
        });
        await db.analyticsEvent.create({
          data: {
            userId: user.userId,
            event: "churn_feature_highlight_sent",
            category: "lifecycle",
          },
        });
        results.featureHighlight++;
      } catch {
        // Skip
      }
    }

    // ── 3. Trial ending in 3 days: Urgency email with 20% discount ──
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const trialEndingUsers = await db.user.findMany({
      where: {
        plan: "free",
        trialEndsAt: { gte: tomorrow, lte: threeDaysFromNow },
      },
      select: { id: true, name: true, email: true, trialEndsAt: true },
    });

    for (const user of trialEndingUsers) {
      const alreadySent = await db.analyticsEvent.findFirst({
        where: {
          userId: user.id,
          event: "churn_trial_ending_sent",
        },
      });
      if (alreadySent) continue;

      const daysLeft = Math.max(
        1,
        Math.ceil(
          (user.trialEndsAt!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        )
      );

      try {
        await sendEmail({
          to: user.email,
          subject:
            daysLeft <= 1
              ? "Last day of your BidRank trial — 20% off inside"
              : `Only ${daysLeft} days left on your BidRank trial`,
          html: trialEndingEmail(user.name, daysLeft),
        });
        await db.analyticsEvent.create({
          data: {
            userId: user.id,
            event: "churn_trial_ending_sent",
            category: "billing",
          },
        });
        results.trialEnding++;
      } catch {
        // Skip
      }
    }

    // ── 4. Cancellation initiated: Exit survey + retention offer ──
    // This is handled reactively via the webhook, but we check for users
    // who cancelled in the last 24h but haven't received the exit email
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentlyCancelled = await db.user.findMany({
      where: {
        plan: "free",
        subscription: {
          some: {
            status: "cancelled",
            cancelAtPeriodEnd: true,
            updatedAt: { gte: oneDayAgo },
          },
        },
      },
      select: { id: true, name: true, email: true },
    });

    for (const user of recentlyCancelled) {
      const alreadySent = await db.analyticsEvent.findFirst({
        where: {
          userId: user.id,
          event: "churn_exit_survey_sent",
        },
      });
      if (alreadySent) continue;

      try {
        await sendEmail({
          to: user.email,
          subject: "Sorry to see you go — 2 months free if you change your mind",
          html: exitSurveyOfferEmail(user.name),
          replyTo: "support@bidrank.pro",
        });
        await db.analyticsEvent.create({
          data: {
            userId: user.id,
            event: "churn_exit_survey_sent",
            category: "billing",
          },
        });
        results.exitSurvey++;
      } catch {
        // Skip
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now.toISOString(),
      ...results,
    });
  } catch (error) {
    console.error("Churn prevention cron error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}