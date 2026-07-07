import { brandEmailHtml } from "@/lib/email";

export function onboardingEmail5() {
  return {
    subject: "How an 8(a) Firm Won a $2.4M DoD Contract Using BidRank",
    html: brandEmailHtml(
      `<h2>Case Study: From 6-Hour Reviews to 3-Minute Analysis</h2>
<p><strong>Company:</strong> Apex IT Solutions (8(a) certified, 12 employees)<br/>
<strong>Challenge:</strong> Missing deadlines on RFP reviews, inconsistent compliance checks, losing bids to larger competitors.</p>

<h3>The Problem</h3>
<p>Apex was pursuing 3–4 federal RFPs per month but struggled to review each one thoroughly. Their proposal manager spent 6+ hours per solicitation manually checking compliance requirements. They missed a critical security clearance requirement on one RFP — and were disqualified despite having the strongest technical approach.</p>

<h3>The Solution</h3>
<p>Apex started using BidRank to pre-screen every RFP before committing proposal resources. Their new workflow:</p>
<ul>
  <li><strong>Day 1:</strong> Upload the RFP to BidRank (3 minutes)</li>
  <li><strong>Day 1:</strong> Review the compliance score and risk heatmap (15 minutes)</li>
  <li><strong>Day 2:</strong> Team meeting to discuss bid/no-bid decision using BidRank data</li>
  <li><strong>Day 3–14:</strong> Proposal development focused on the gaps BidRank identified</li>
</ul>

<h3>The Results</h3>
<div class="stat-grid">
  <div class="stat-box">
    <div class="num">$2.4M</div>
    <div class="label">Contract Won</div>
  </div>
  <div class="stat-box">
    <div class="num">92</div>
    <div class="label">Final Score</div>
  </div>
  <div class="stat-box">
    <div class="num">85%</div>
    <div class="label">Time Saved</div>
  </div>
</div>

<p>Their proposal manager reduced RFP review time from 6 hours to under 30 minutes. More importantly, they stopped pursuing poor-fit opportunities and focused their limited resources on bids they could actually win.</p>

<div class="highlight">
  <p><strong>Key takeaway:</strong> "BidRank didn't write our proposal — it made sure we wrote the <em>right</em> proposal for the <em>right</em> opportunity." — Maria, Apex IT Solutions</p>
</div>

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/analyzer" class="btn">Start Analyzing RFPs →</a>
</p>`,
      "Case study: How an 8(a) firm won using BidRank"
    ),
  };
}