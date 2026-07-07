import { brandEmailHtml } from "@/lib/email";

export function onboardingEmail4() {
  return {
    subject: "5 Tips for Stronger Past Performance Narratives",
    html: brandEmailHtml(
      `<h2>5 Tips for Stronger Past Performance Narratives</h2>
<p>Past performance is one of the most heavily weighted evaluation factors in federal contracting — often worth 20–30% of your total score. Here's how to write narratives that actually win points.</p>

<h3>1. Mirror the RFP's Language</h3>
<p>If the solicitation emphasizes "agile methodology," your past performance should describe how you used agile — even if the project wasn't formally agile. Match their vocabulary to their evaluation criteria.</p>

<h3>2. Quantify Everything</h3>
<p>"Delivered on time" is weak. "Delivered 47 deliverables across 12 work packages, 2 weeks ahead of schedule, with zero defects" is what evaluators want to see. Use real numbers from your project records.</p>

<h3>3. Address Relevance Directly</h3>
<p>Evaluators score on <em>relevance</em>, not impressiveness. A $50K highly relevant project often outscores a $5M tangential one. Start each narrative by explicitly connecting the past work to the RFP requirements.</p>

<h3>4. Include Lessons Learned</h3>
<p>Federal evaluators look for self-awareness. Briefly mention one challenge you overcame — it demonstrates maturity and resilience. Just keep it to 1–2 sentences.</p>

<h3>5. Use the STAR Format</h3>
<p><strong>S</strong>ituation → <strong>T</strong>ask → <strong>A</strong>ction → <strong>R</strong>esult. This structure ensures you cover all the bases evaluators are checking for. BidRank's analysis can help you identify which of your past projects are most relevant to the current RFP.</p>

<div class="highlight">
  <p><strong>Bonus:</strong> Upload your past performance write-ups alongside the RFP — BidRank can cross-reference and suggest which projects to highlight.</p>
</div>

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/analyzer" class="btn">Analyze Your Next RFP →</a>
</p>`,
      "5 tips for stronger past performance narratives"
    ),
  };
}