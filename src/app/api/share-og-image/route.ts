export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";

// Generate an OG image card for sharing analysis results
// Returns SVG that browsers render as an image for OG meta tags
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const score = searchParams.get("score") || "72";
  const agency = searchParams.get("agency") || "Federal Agency";
  const verdict = searchParams.get("verdict") || "CONDITIONAL";
  const fileName = searchParams.get("fileName") || "RFP Analysis";

  const scoreNum = parseInt(score, 10);
  const scoreColor =
    scoreNum >= 80
      ? "#16a34a"
      : scoreNum >= 60
        ? "#d97706"
        : "#dc2626";

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e3a5f"/>
    </linearGradient>
    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${scoreColor}"/>
      <stop offset="100%" stop-color="${scoreColor}88"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" rx="0"/>

  <!-- Decorative circles -->
  <circle cx="1100" cy="100" r="200" fill="white" opacity="0.02"/>
  <circle cx="100" cy="530" r="150" fill="white" opacity="0.02"/>

  <!-- BidRank logo -->
  <text x="60" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#d4af37">BidRank</text>
  <text x="200" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#94a3b8">Federal RFP Intelligence</text>

  <!-- File name -->
  <text x="60" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#e2e8f0" font-weight="600">${escapeXml(fileName.length > 50 ? fileName.slice(0, 50) + "..." : fileName)}</text>
  <text x="60" y="160" font-family="system-ui, -apple-system, sans-serif" font-size="15" fill="#64748b">${escapeXml(agency)}</text>

  <!-- Score circle -->
  <circle cx="280" cy="370" r="140" fill="none" stroke="url(#scoreGrad)" stroke-width="8" opacity="0.3"/>
  <text x="280" y="365" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="96" font-weight="800" fill="${scoreColor}">${score}</text>
  <text x="280" y="410" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#94a3b8">Compliance Score</text>

  <!-- Verdict badge -->
  <rect x="560" y="240" width="240" height="52" rx="26" fill="${scoreColor}22" stroke="${scoreColor}" stroke-width="1.5"/>
  <text x="680" y="273" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="700" fill="${scoreColor}">Verdict: ${escapeXml(verdict)}</text>

  <!-- Stats row -->
  <rect x="560" y="320" width="580" height="100" rx="16" fill="white" opacity="0.04"/>

  <text x="660" y="365" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#64748b">Analysis</text>
  <text x="660" y="395" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#e2e8f0" font-weight="600">~3 min</text>

  <text x="860" y="365" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#64748b">Time Saved</text>
  <text x="860" y="395" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#e2e8f0" font-weight="600">~6 hours</text>

  <text x="1040" y="365" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#64748b">Risks Flagged</text>
  <text x="1040" y="395" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="13" fill="#e2e8f0" font-weight="600">Auto-detected</text>

  <!-- CTA -->
  <text x="60" y="575" font-family="system-ui, -apple-system, sans-serif" font-size="15" fill="#64748b">Analyze your next federal RFP in minutes — </text>
  <text x="540" y="575" font-family="system-ui, -apple-system, sans-serif" font-size="15" fill="#d4af37" font-weight="600">bidrank.pro</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}