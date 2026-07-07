export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { db } = await import("@/lib/db");

    const body = await req.text();

    if (!body) {
      return NextResponse.json({ error: "Empty body" }, { status: 400 });
    }

    // Parse event data
    let eventData: Record<string, unknown>;
    try {
      eventData = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const meta = eventData.meta as Record<string, string> | undefined;
    const eventName = meta?.event_name || "";
    const customData = (eventData.meta?.custom_data || {}) as Record<string, string>;

    // Verify webhook signature
    try {
      const signature = req.headers.get("x-signature") || "";
      if (signature) {
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || "";
        if (secret) {
          const hmac = crypto.createHmac("sha256", secret);
          hmac.update(body);
          const expected = hmac.digest("hex");
          if (signature !== expected) {
            console.error("[Lemon Squeezy Webhook] Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
          }
        }
      }
    } catch (verifyError) {
      console.error("[Lemon Squeezy Webhook] Verification error:", verifyError);
      return NextResponse.json({ received: true, verified: false });
    }

    console.log(`[Lemon Squeezy Webhook] ${eventName}`);

    // Extract common fields
    const attrs = (eventData.data?.attributes || {}) as Record<string, unknown>;
    const userId = customData.userId || (attrs.custom_data as Record<string, string>)?.userId || customData.clerkUserId || (attrs.custom_data as Record<string, string>)?.clerkUserId;
    const subscriptionId = String(attrs.customer_id || attrs.subscription_id || attrs.order_id || "");
    const variantId = String(attrs.variant_id || attrs.first_order_item?.variant_id || "");
    const status = String(attrs.status || "");
    const endsAt = attrs.ends_at || attrs.renews_at;
    const trialEndsAt = attrs.trial_ends_at;

    switch (eventName) {
      case "subscription_created": {
        if (!userId) {
          console.warn("[Subscription Created] No userId in custom_data");
          break;
        }
        try {
          const planName = mapVariantToPlan(variantId);
          await db.subscription.upsert({
            where: { userId: userId },
            create: {
              userId: userId,
              paddleSubId: subscriptionId || undefined,
              paddlePlanId: variantId || undefined,
              status: "active",
              currentPeriodEnd: endsAt ? new Date(endsAt as string) : (trialEndsAt ? new Date(trialEndsAt as string) : null),
            },
            update: {
              paddleSubId: subscriptionId || undefined,
              paddlePlanId: variantId || undefined,
              status: "active",
              currentPeriodEnd: endsAt ? new Date(endsAt as string) : (trialEndsAt ? new Date(trialEndsAt as string) : null),
              cancelAtPeriodEnd: false,
            },
          });

          if (planName) {
            await db.user.update({
              where: { id: userId },
              data: { plan: planName },
            });
          }

          console.log(`[Subscription Created] User ${userId} → plan ${planName}`);
        } catch (dbErr) {
          console.error("[Subscription Created] DB error:", dbErr);
        }
        break;
      }

      case "subscription_updated": {
        if (!userId) break;
        try {
          const mappedStatus = mapLemonSqueezyStatus(status);
          await db.subscription.upsert({
            where: { userId: userId },
            create: {
              userId: userId,
              paddleSubId: subscriptionId || undefined,
              paddlePlanId: variantId || undefined,
              status: mappedStatus,
              currentPeriodEnd: endsAt ? new Date(endsAt as string) : null,
            },
            update: {
              paddleSubId: subscriptionId || undefined,
              paddlePlanId: variantId || undefined,
              status: mappedStatus,
              currentPeriodEnd: endsAt ? new Date(endsAt as string) : null,
            },
          });

          // Update plan if variant changed
          const planName = mapVariantToPlan(variantId);
          if (planName && mappedStatus === "active") {
            await db.user.update({
              where: { id: userId },
              data: { plan: planName },
            });
          }

          console.log(`[Subscription Updated] User ${userId} → ${mappedStatus}`);
        } catch (dbErr) {
          console.error("[Subscription Updated] DB error:", dbErr);
        }
        break;
      }

      case "subscription_cancelled": {
        if (!userId) break;
        try {
          await db.subscription.update({
            where: { userId: userId },
            data: {
              status: "canceled",
              cancelAtPeriodEnd: true,
            },
          });
          await db.user.update({
            where: { id: userId },
            data: { plan: "free" },
          });
          console.log(`[Subscription Cancelled] User ${userId}`);
        } catch (dbErr) {
          console.error("[Subscription Cancelled] DB error:", dbErr);
        }
        break;
      }

      case "subscription_expired": {
        if (!userId) break;
        try {
          await db.subscription.update({
            where: { userId: userId },
            data: { status: "canceled" },
          });
          await db.user.update({
            where: { id: userId },
            data: { plan: "free" },
          });
          console.log(`[Subscription Expired] User ${userId}`);
        } catch (dbErr) {
          console.error("[Subscription Expired] DB error:", dbErr);
        }
        break;
      }

      case "order_created": {
        // Successful payment — reset monthly analysis count
        if (!userId) break;
        try {
          await db.user.update({
            where: { id: userId },
            data: { analysesThisMonth: 0 },
          });

          // Update subscription period if we have an end date
          if (endsAt) {
            await db.subscription.update({
              where: { userId: userId },
              data: {
                status: "active",
                currentPeriodEnd: new Date(endsAt as string),
              },
            });
          }
          console.log(`[Order Created / Payment] User ${userId} — count reset`);
        } catch (dbErr) {
          console.error("[Order Created] DB error:", dbErr);
        }
        break;
      }

      default:
        console.log(`[Unhandled Event] ${eventName}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook Error]", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}

// ── Helper: Map Lemon Squeezy variant ID to plan name ──────────────────────
function mapVariantToPlan(variantId: string | null | undefined): string | null {
  if (!variantId) return null;
  const basicId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_BASIC_VARIANT_ID;
  const proId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID;
  const enterpriseId = process.env.NEXT_PUBLIC_LEMONSQUEEZY_ENTERPRISE_VARIANT_ID;

  if (variantId === basicId) return "basic";
  if (variantId === proId) return "pro";
  if (variantId === enterpriseId) return "enterprise";
  return null;
}

// ── Helper: Map Lemon Squeezy status to our DB status ──────────────────────
function mapLemonSqueezyStatus(status: string | undefined): string {
  switch (status) {
    case "active":
    case "on_trial":
      return "active";
    case "paused":
      return "paused";
    case "cancelled":
    case "expired":
      return "canceled";
    case "past_due":
      return "past_due";
    default:
      return "active";
  }
}