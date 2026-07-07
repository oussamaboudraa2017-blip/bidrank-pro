export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let plan = "";
  let billing = "";
  let productId = "";

  try {
    const { requireAuth } = await import("@/lib/session");
    const { createFastSpringCheckout, getFastSpringProductId } = await import("@/lib/fastspring");

    const session = await requireAuth();
    if (!session) {
      return NextResponse.json(
        { error: "Please sign in to continue", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const userEmail = session.user.email || "";

    const body = await req.json();
    plan = body.plan || "";
    billing = body.billing || "monthly";

    const validPlans = ["starter", "pro", "studio"];
    if (!validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }
    if (!["monthly", "annual"].includes(billing)) {
      return NextResponse.json({ error: "Invalid billing period" }, { status: 400 });
    }

    productId = getFastSpringProductId(plan, billing);
    if (!productId) {
      return NextResponse.json(
        { error: "Pricing not configured for the " + plan + " plan.", code: "PLAN_NOT_CONFIGURED" },
        { status: 400 }
      );
    }

    const username = process.env.FASTSPRING_API_USERNAME || "";
    const password = process.env.FASTSPRING_API_PASSWORD || "";
    if (!username || !password) {
      return NextResponse.json(
        { error: "Payment system is being configured. Please try again later.", code: "FASTSPRING_NOT_CONFIGURED" },
        { status: 503 }
      );
    }

    const checkoutUrl = await createFastSpringCheckout(plan, userId, billing, userEmail);
    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Checkout Error]", message, "plan=" + plan, "billing=" + billing, "productId=" + productId, error);
    return NextResponse.json(
      { error: "Checkout failed. Please try again or contact support.", code: "CHECKOUT_ERROR" },
      { status: 500 }
    );
  }
}