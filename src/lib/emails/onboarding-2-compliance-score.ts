import { brandEmailHtml } from "@/lib/email";

export function onboardingEmail2() {
  return {
    subject: "How to Read Your BidRank Compliance Score",
    html: brandEmailHtml(
      `<h2>Understanding Your Compliance Score</h2>
<p>Your BidRank Compliance Score (0–100) is the first thing you'll see after analyzing an RFP. Here's what the numbers actually mean — and how to use them.</p>

<div class="stat-grid">
  <div class="stat-box">
    <div class="num" style="color:#16a34a;">80–100</div>
    <div class="label">Ready to Pursue</div>
  </div>
  <div class="stat-box">
    <div class="num" style="color:#d97706;">60–79</div>
    <div class="label">Needs Work</div>
  </div>
  <div class="stat-box">
    <div class="num" style="color:#dc2626;">0–59</div>
    <div class="label">Not Ready</div>
  </div>
</div>

<h3>It's Not Just One Number</h3>
<p>The overall score is built from four sub-scores, each measuring a different dimension:</p>
<ul>
  <li><strong>Compliance Completeness</strong> — Do you have all required documents, certifications, and clauses addressed?</li>
  <li><strong>Capability Match</strong> — Does your profile align with the RFP's technical requirements and NAICS code?</li>
  <li><strong>Requirement Clarity</strong> — How well-defined is the SOW? Ambiguous requirements mean higher proposal risk.</li>
  <li><strong>Historical Patterns</strong> — How does this opportunity compare to similar past solicitations?</li>
</ul>

<div class="highlight">
  <p><strong>Pro tip:</strong> A score below 60 doesn't mean "don't bid." It means "address these gaps before investing proposal resources." Many winning proposals started with low initial scores.</p>
</div>

<p>Have you run your first analysis yet?</p>
<p style="text-align:center;">
  <a href="https://www.bidrank.pro/analyzer" class="btn">Analyze an RFP Now →</a>
</p>`,
      "How to read your BidRank compliance score"
    ),
  };
}