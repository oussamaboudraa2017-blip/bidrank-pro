import crypto from "crypto";

const FASTSPRING_BASE = "https://api.fastspring.com";

function getCredentials() {
  const username = process.env.FASTSPRING_API_USERNAME || "";
  const password = process.env.FASTSPRING_API_PASSWORD || "";
  if (!username || !password) {
    throw new Error("FASTSPRING_API_USERNAME and FASTSPRING_API_PASSWORD are required");
  }
  return { username, password };
}

// Product IDs from your FastSpring store
const PRODUCT_IDS: Record<string, Record<string, string>> = {
  starter: {
    monthly: process.env.FASTSPRING_STARTER_PRODUCT_ID || "bidrank-starter-monthly",
    annual: process.env.FASTSPRING_STARTER_ANNUAL_PRODUCT_ID || "bidrank-starter-annual",
  },
  pro: {
    monthly: process.env.FASTSPRING_PRO_PRODUCT_ID || "bidrank-pro-monthly",
    annual: process.env.FASTSPRING_PRO_ANNUAL_PRODUCT_ID || "bidrank-pro-annual",
  },
  studio: {
    monthly: process.env.FASTSPRING_STUDIO_PRODUCT_ID || "bidrank-studio-monthly",
    annual: process.env.FASTSPRING_STUDIO_ANNUAL_PRODUCT_ID || "bidrank-studio-annual",
  },
};

export function getFastSpringProductId(plan: string, billing = "monthly"): string {
  return PRODUCT_IDS[plan]?.[billing] || "";
}

export const PLANS = {
  free: { name: "Free", price: 0 },
  starter: { name: "Starter", price: 49 },
  pro: { name: "Pro", price: 149 },
  studio: { name: "Studio", price: 399 },
  enterprise: { name: "Enterprise", price: 0 },
};

export async function createFastSpringCheckout(plan: string, userId: string, billing = "monthly", userEmail = "") {
  const productId = getFastSpringProductId(plan, billing);
  if (!productId) {
    throw new Error("No product ID configured for plan: " + plan);
  }

  const { username, password } = getCredentials();

  const payload: Record<string, unknown> = {
    items: [{ product: productId, quantity: 1 }],
    tags: { user: userId, plan: plan, billing: billing },
  };

  if (userEmail) {
    payload.contact = { email: userEmail };
  }

  console.log("[FastSpring] POST /sessions payload:", JSON.stringify(payload, null, 2));

  const response = await fetch(FASTSPRING_BASE + "/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + Buffer.from(username + ":" + password).toString("base64"),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[FastSpring] Checkout error: " + response.status, errorBody);
    throw new Error("FastSpring API error: " + response.status + " — " + errorBody.slice(0, 300));
  }

  const data = await response.json();
  console.log("[FastSpring] Session response:", JSON.stringify(data, null, 2));

  const sessionId = data.id;
  if (!sessionId) {
    console.error("[FastSpring] No session ID in response", data);
    throw new Error("No session ID returned from FastSpring");
  }

  const storeUrl = process.env.FASTSPRING_STORE_URL || "https://bidrank.test.onfastspring.com";
  const baseUrl = storeUrl.replace(/\/+$/, "");
  const checkoutUrl = baseUrl + "/session/" + sessionId;

  return checkoutUrl;
}

export function verifyFastSpringWebhookSignature(payload: string, signature: string) {
  const secret = process.env.FASTSPRING_WEBHOOK_SECRET || "";
  if (!secret) {
    return true;
  }
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

export function mapProductToPlan(productId: string | null): string | null {
  if (!productId) return null;

  // Check all product IDs (env override or default)
  for (const [plan, billingMap] of Object.entries(PRODUCT_IDS)) {
    for (const id of Object.values(billingMap)) {
      if (productId === id) return plan;
    }
  }

  return null;
}

export function mapFastSpringStatus(state: string) {
  switch (state) {
    case "active":
    case "trialing":
    case "pending":
      return "active";
    case "canceled":
    case "deactivated":
      return "canceled";
    case "paused":
    case "on_hold":
      return "paused";
    case "past_due":
      return "past_due";
    default:
      return "active";
  }
}