import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const body = await req.json();
    const { type, score, title, comment, email, page } = body;

    if (!type || !comment) {
      return NextResponse.json({ error: "type and comment are required" }, { status: 400 });
    }

    const validTypes = ["nps", "feature_request", "bug_report", "exit_survey"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Invalid feedback type" }, { status: 400 });
    }

    if (type === "nps" && (score === undefined || score < 0 || score > 10)) {
      return NextResponse.json({ error: "NPS score must be 0-10" }, { status: 400 });
    }

    await db.userFeedback.create({
      data: {
        userId: session?.user?.id || "anonymous",
        type,
        score: score ?? null,
        title: title?.trim() || null,
        comment: comment.trim(),
        email: email?.trim() || session?.user?.email || null,
        page: page || null,
        userAgent: req.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}