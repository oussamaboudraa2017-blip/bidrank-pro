import { brandEmailHtml } from "@/lib/email";

export function onboardingEmail3() {
  return {
    subject: "Spot Risks Before They Sink Your Bid — The Risk Heatmap",
    html: brandEmailHtml(
      `<h2>Feature Spotlight: Risk Heatmap</h2>
<p>One of BidRank's most powerful features is the <strong>Risk Heatmap</strong> — a visual grid that shows you exactly where the danger zones are in any federal solicitation.</p>

<h3>How It Works</h3>
<p>After you analyze an RFP, scroll down to the Risk Heatmap. You'll see a matrix with compliance categories on one axis and severity levels on the other:</p>
<ul>
  <li><span style="color:#dc2626;font-weight:700;">Critical</span> — Could be a showstopper. Missing required certification, impossible deadline, or contractual clause you can't accept.</li>
  <li><span style="color:#f97316;font-weight:700;">High</span> — Significant concern. Unclear evaluation criteria, aggressive pricing structure, or teaming requirements.</li>
  <li><span style="color:#d97706;font-weight:700;">Medium</span> — Worth monitoring. Partial experience match or some ambiguity in deliverables.</li>
  <li><span style="color:#16a34a;font-weight:700;">Low</span> — Minor gaps easily addressed in your proposal narrative.</li>
</ul>

<h3>Why This Matters</h3>
<p>Most contractors spend 40–120 hours on a proposal before discovering a critical risk. The heatmap shows you in <strong>under 3 minutes</strong> what would normally take days of manual review.</p>

<div class="highlight">
  <p><strong>Use case:</strong> Before your next bid decision meeting, run the analysis and pull up the heatmap. You'll walk in knowing exactly which risks to discuss — and which ones are non-issues.</p>
</div>

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/analyzer" class="btn">Try the Risk Heatmap →</a>
</p>`,
      "Feature spotlight: Risk Heatmap"
    ),
  };
}