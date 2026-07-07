import { brandEmailHtml } from "@/lib/email";

export function onboardingEmail7(name: string) {
  return {
    subject: "Final Chance — Join 500+ Contractors Using BidRank",
    html: brandEmailHtml(
      `<h2>${name}, Don't Leave Money on the Table</h2>
<p>Federal agencies awarded over <strong>$700 billion</strong> in contracts last year. Small businesses won a record share — but only those who submitted compliant, well-targeted proposals.</p>

<h3>The Math Is Simple</h3>
<div class="stat-grid">
  <div class="stat-box">
    <div class="num">6 hrs</div>
    <div class="label">Avg Manual Review</div>
  </div>
  <div class="stat-box">
    <div class="num">3 min</div>
    <div class="label">BidRank Analysis</div>
  </div>
  <div class="stat-box">
    <div class="num">99%</div>
    <div class="label">Time Saved</div>
  </div>
</div>

<h3>What Other Contractors Say</h3>
<ul>
  <li>"BidRank caught a missing FAR clause that would have disqualified us. Literally saved our bid." — <strong>James T., SDVOSB</strong></li>
  <li>"We went from bidding on everything to bidding smart. Our win rate improved from 12% to 28%." — <strong>Priya K., WOSB</strong></li>
  <li>"The risk heatmap alone is worth the subscription. We see problems in minutes, not days." — <strong>Marcus D., 8(a)</strong></li>
</ul>

<h3>Still Using Your Free Analyses?</h3>
<p>You've used some of your trial analyses. Upgrade now and get unlimited RFP analyses, PDF exports, and team features.</p>

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/pricing" class="btn">See Plans & Pricing →</a>
</p>

<hr class="divider" />

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/analyzer" class="btn-outline">Or Try One More Free Analysis</a>
</p>`,
      "Final chance — join 500+ contractors"
    ),
  };
}