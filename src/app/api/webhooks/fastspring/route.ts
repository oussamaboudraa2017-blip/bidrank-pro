export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { verifyFastSpringWebhookSignature, mapProductToPlan, mapFastSpringStatus } = await import("@/lib/fastspring");
    const { db } = await import("@/lib/db");

    const body = await req.text();

    if (!body) {
      return NextResponse.json({ error: "Empty body" }, { status: 400 });
    }

    let eventData: any;
    try {
      eventData = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const signature = req.headers.get("fastspring-signature") || "";
    if (signature) {
      try {
        const valid = verifyFastSpringWebhookSignature(body, signature);
        if (!valid) {
          console.error("[FastSpring Webhook] Signature verification failed");
          return NextResponse.json({ received: true, verified: false });
        }
      } catch (verifyError) {
        console.error("[FastSpring Webhook] Signature error:", verifyError);
        return NextResponse.json({ received: true, verified: false });
      }
    }

    const eventType = eventData.action || eventData.type || "";
    console.log("[FastSpring Webhook]", eventType);

    const subscription = eventData.subscription || {};
    const fsSubId = subscription.id || "";
    const state = subscription.state || subscription.status || "";
    const endDate = subscription.endDate || null;

    // Extract userId from tags
    const tags = subscription.tags || eventData.tags || {};
    let userId = "";
    if (Array.isArray(tags)) {
      for (const tag of tags) {
        if (typeof tag === "string" && tag.startsWith("user:")) {
          userId = tag.replace("user:", "");
          break;
        }
        if (typeof tag === "string" && tag.startsWith("clerk:")) {
          userId = tag.replace("clerk:", "");
          break;
        }
      }
    } else if (typeof tags === "object" && tags !== null) {
      userId = tags.user || tags.clerk || "";
    }

    if (!userId) {
      const account = eventData.account || subscription.account || {};
      userId = account.id || "";
    }

    const items = subscription.items || [];
    const firstItem = items[0] || {};
    const productId = firstItem.product || firstItem.productId || null;

    const dbStatus = mapFastSpringStatus(state);
    const periodEnd = endDate ? new Date(endDate) : null;
    const planName = mapProductToPlan(productId);

    switch (eventType) {
      case "subscription.activated": {
        if (!userId) {
          console.warn("[Subscription Activated] No userId found");
          break;
        }

        // Read previous plan BEFORE updating
        let prevPlan = "free";
        try {
          const prevUser = await db.user.findUnique({ where: { id: userId }, select: { plan: true } });
          if (prevUser?.plan) prevPlan = prevUser.plan;
        } catch { /* ok */ }

        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            fastspringSubId: fsSubId || undefined,
            fastspringProductId: productId || undefined,
            status: dbStatus,
            currentPeriodEnd: periodEnd,
          },
          update: {
            fastspringSubId: fsSubId || undefined,
            fastspringProductId: productId || undefined,
            status: dbStatus,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: false,
          },
        });

        if (planName) {
          await db.user.update({
            where: { id: userId },
            data: { plan: planName },
          });
        }

        console.log("[Subscription Activated] User", userId, "-> plan", planName, "status", state);

        // Track analytics (using prevPlan read before the update)
        try {
          if (prevPlan === "free" && planName) {
            await db.analyticsEvent.create({ data: { userId, event: "subscription_started", category: "billing", metadata: { plan: planName } } });
          } else if (prevPlan && planName && prevPlan !== planName) {
            await db.analyticsEvent.create({ data: { userId, event: "subscription_upgraded", category: "billing", metadata: { fromPlan: prevPlan, toPlan: planName } } });
          }
        } catch { /* don't break webhook for analytics */ }

        break;
      }

      case "subscription.changed": {
        if (!userId) break;
        await db.subscription.upsert({
          where: { userId },
          create: {
            userId,
            fastspringSubId: fsSubId || undefined,
            fastspringProductId: productId || undefined,
            status: dbStatus,
            currentPeriodEnd: periodEnd,
          },
          update: {
            fastspringSubId: fsSubId || undefined,
            fastspringProductId: productId || undefined,
            status: dbStatus,
            currentPeriodEnd: periodEnd,
          },
        });

        if (planName) {
          await db.user.update({
            where: { id: userId },
            data: { plan: planName },
          });
        }

        console.log("[Subscription Changed] User", userId, "-> plan", planName, "status", dbStatus);
        break;
      }

      case "subscription.canceled":
      case "subscription.deactivated": {
        if (!userId) break;
        await db.subscription.update({
          where: { userId },
          data: {
            status: dbStatus,
            cancelAtPeriodEnd: true,
          },
        });

        if (eventType === "subscription.deactivated") {
          await db.user.update({
            where: { id: userId },
            data: { plan: "free" },
          });
          console.log("[Subscription Deactivated] User", userId, "-> free plan");
        }
        try {
          await db.analyticsEvent.create({ data: { userId, event: "subscription_cancelled", category: "billing", metadata: { state } } });
        } catch { /* ok */ }
        break;
      }

      case "subscription.charge.completed": {
        if (!userId) break;
        await db.user.update({
          where: { id: userId },
          data: { analysesThisMonth: 0 },
        });

        if (periodEnd) {
          await db.subscription.update({
            where: { userId },
            data: {
              status: "active",
              currentPeriodEnd: periodEnd,
            },
          });
        }

        // If user was on trial, upgrade to the paid plan
        if (planName) {
          await db.user.update({
            where: { id: userId },
            data: { plan: planName },
          });
        }

        console.log("[Payment Completed] User", userId, "- analyses reset");
        break;
      }

      default:
        console.log("[Unhandled Event]", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}