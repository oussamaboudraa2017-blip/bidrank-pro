import { brandEmailHtml } from "@/lib/email";

export function onboardingEmail1(name: string) {
  return {
    subject: "Welcome to BidRank — Your First RFP Analysis Awaits",
    html: brandEmailHtml(
      `<h2>Welcome aboard, ${name}! 👋</h2>
<p>You just joined hundreds of federal contractors who use BidRank to analyze RFPs faster, spot compliance gaps early, and make smarter bid/no-bid decisions.</p>

<h3>Your first step: Upload an RFP</h3>
<p>In under 3 minutes, you'll get a full compliance breakdown, risk analysis, and actionable recommendations. No credit card required — your free trial includes 5 analyses.</p>

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/analyzer" class="btn">Analyze Your First RFP →</a>
</p>

<div class="highlight">
  <p><strong>What you'll get with every analysis:</strong></p>
</div>
<ul>
  <li><strong>Compliance Score (0–100)</strong> — See how ready your proposal looks at a glance</li>
  <li><strong>Risk Heatmap</strong> — Spot critical, high, medium, and low risks instantly</li>
  <li><strong>Section-by-section checklist</strong> — Know exactly what's met, partial, or missing</li>
  <li><strong>Bid/No-Bid recommendation</strong> — AI-powered verdict with confidence score</li>
</ul>

<p>Over the next week, I'll send you tips to get the most out of BidRank. For now — upload that RFP sitting on your desk and see the magic.</p>

<p>Questions? Reply to this email — a real human will get back to you.</p>`,
      "Welcome to BidRank — analyze your first RFP"
    ),
  };
}