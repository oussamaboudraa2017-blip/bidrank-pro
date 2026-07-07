export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// Clerk webhook endpoint — DEPRECATED
// Better Auth handles user creation/management directly via the database.
// This endpoint is kept as a no-op to avoid 404 errors from any stale webhook configurations.
export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true, message: "Webhook deprecated" });
}