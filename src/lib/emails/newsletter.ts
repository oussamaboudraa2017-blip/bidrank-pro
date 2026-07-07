import { brandEmailHtml } from "@/lib/email";

interface NewsletterContent {
  samOpportunities: Array<{
    title: string;
    agency: string;
    value: string;
    naics: string;
    deadline: string;
    url: string;
  }>;
  weeklyTip: string;
  featureSpotlight: string;
  industryNews: string;
}

export function newsletterEmail(content: NewsletterContent) {
  const samItems = content.samOpportunities
    .slice(0, 3)
    .map(
      (opp) => `
    <tr>
      <td style="padding:12px 0; border-bottom:1px solid #e2e8f0;">
        <p style="margin:0 0 4px;"><strong>${opp.title}</strong></p>
        <p style="margin:0; font-size:13px; color:#64748b;">
          ${opp.agency} · ${opp.value} · NAICS ${opp.naics} · Due ${opp.deadline}
        </p>
        <p style="margin:6px 0 0;">
          <a href="${opp.url}" style="color:#d4af37; font-size:13px; text-decoration:none; font-weight:600;">View on SAM.gov →</a>
        </p>
      </td>
    </tr>`
    )
    .join("");

  return {
    subject: "GovCon Insider — This Week in Federal Contracting",
    html: brandEmailHtml(
      `<h2>GovCon Insider</h2>
<p style="color:#64748b; font-size:13px;">Your weekly roundup of federal opportunities, tips, and industry news.</p>

<h3>🔥 Top 3 SAM.gov Opportunities This Week</h3>
<table style="width:100%; border-collapse:collapse; margin-bottom:8px;">
    ${samItems}
  </table>
  <p style="font-size:12px; color:#94a3b8;">
    <a href="https://sam.gov" style="color:#d4af37; text-decoration:none;">Browse all opportunities on SAM.gov →</a>
  </p>

<h3>💡 Weekly Tip</h3>
<p>${content.weeklyTip}</p>

<h3>🚀 BidRank Feature Spotlight</h3>
<p>${content.featureSpotlight}</p>

<h3>📰 Industry News</h3>
<p>${content.industryNews}</p>

<hr class="divider" />

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/analyzer" class="btn">Analyze an RFP Now →</a>
</p>`,
      "GovCon Insider — weekly federal contracting roundup"
    ),
  };
}