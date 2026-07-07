export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  const checks = {};

  const username = process.env.FASTSPRING_API_USERNAME || "";
  const password = process.env.FASTSPRING_API_PASSWORD || "";
  checks["FASTSPRING_API_USERNAME"] = username ? "SET (" + username.substring(0, 6) + "...)" : "NOT SET";
  checks["FASTSPRING_API_PASSWORD"] = password ? "SET (hidden)" : "NOT SET";

  const basicId = process.env.FASTSPRING_BASIC_PRODUCT_ID || "";
  checks["BASIC_PRODUCT_ID"] = basicId ? "SET (" + basicId + ")" : "NOT SET";

  const proId = process.env.FASTSPRING_PRO_PRODUCT_ID || "";
  checks["PRO_PRODUCT_ID"] = proId ? "SET (" + proId + ")" : "NOT SET";

  const enterpriseId = process.env.FASTSPRING_ENTERPRISE_PRODUCT_ID || "";
  checks["ENTERPRISE_PRODUCT_ID"] = enterpriseId ? "SET (" + enterpriseId + ")" : "NOT SET";

  const webhookSecret = process.env.FASTSPRING_WEBHOOK_SECRET || "";
  checks["FASTSPRING_WEBHOOK_SECRET"] = webhookSecret ? "SET (hidden)" : "NOT SET";

  if (username && password) {
    try {
      const res = await fetch("https://api.fastspring.com/products", {
        headers: {
          Authorization: "Basic " + Buffer.from(username + ":" + password).toString("base64"),
        },
      });
      checks["FASTSPRING_API_TEST"] = res.status + " " + res.statusText;
      if (res.status === 200) {
        const data = await res.json();
        const count = Array.isArray(data) ? data.length : (data.products ? data.products.length : 0);
        checks["PRODUCTS_COUNT"] = count + " product(s) found";
      } else if (res.status === 401) {
        checks["FASTSPRING_API_TEST"] += " - INVALID CREDENTIALS";
      }
    } catch (err) {
      checks["FASTSPRING_API_TEST"] = "ERROR: " + (err instanceof Error ? err.message : String(err));
    }
  } else {
    checks["FASTSPRING_API_TEST"] = "SKIPPED - no credentials";
  }

  return NextResponse.json(checks);
}