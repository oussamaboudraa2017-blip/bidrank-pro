import { brandEmailHtml } from "@/lib/email";

export function reengagementTipEmail(userName: string) {
  return brandEmailHtml(
    `
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1A3A5C;">
      We noticed you haven't been back lately
    </h2>
    <p style="margin:0 0 16px;color:#4A5568;line-height:1.6;">
      Hey ${userName},<br><br>
      It's been a few days since you last logged into BidRank. Federal contracting moves fast
      — new solicitations drop every day on SAM.gov, and the best opportunities don't wait around.
    </p>
    <p style="margin:0 0 16px;color:#4A5568;line-height:1.6;">
      <strong>Quick tip:</strong> Set a recurring calendar block (even 30 minutes) to review
      new RFPs each morning. Upload the ones that match your NAICS codes into BidRank for an
      instant go/no-go assessment. It takes under 3 minutes per RFP.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.bidrank.pro/analyzer"
         style="display:inline-block;background:#D4A843;color:#1A3A5C;font-weight:600;
                padding:12px 32px;border-radius:8px;text-decoration:none;font-size:15px;">
        Analyze an RFP Now →
      </a>
    </div>
    <p style="margin:0;color:#64748B;font-size:13px;line-height:1.5;">
      P.S. — If there's anything holding you back, we'd love to hear about it.
      Just reply to this email.
    </p>
    `,
    "Tip: Make RFP review a daily habit"
  );
}

export function featureHighlightEmail(userName: string) {
  return brandEmailHtml(
    `
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1A3A5C;">
      Your RFPs are waiting — here's what you're missing
    </h2>
    <p style="margin:0 0 16px;color:#4A5568;line-height:1.6;">
      Hey ${userName},<br><br>
      It's been two weeks since your last analysis. Here's a feature you might not have
      explored yet:
    </p>
    <div style="background:#F5F7FA;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="margin:0 0 8px;font-weight:600;color:#1A3A5C;font-size:15px;">
        📊 Risk Assessment Dashboard
      </p>
      <p style="margin:0;color:#4A5568;font-size:14px;line-height:1.6;">
        Every analysis includes a structured risk breakdown — pricing risks, timeline risks,
        compliance gaps, and ambiguous requirements. It's the fastest way to spot deal-breakers
        before investing hours in a proposal. Check out our latest
        <a href="https://www.bidrank.pro/blog" style="color:#2B5B8C;text-decoration:underline;">
          case study
        </a> to see it in action.
      </p>
    </div>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.bidrank.pro/free-tool"
         style="display:inline-block;background:#D4A843;color:#1A3A5C;font-weight:600;
                padding:12px 32px;border-radius:8px;text-decoration:none;font-size:15px;">
        Try the Free Tool →
      </a>
    </div>
    `,
    "New feature highlight + case study inside"
  );
}

export function trialEndingEmail(userName: string, daysLeft: number) {
  const discountCode = daysLeft <= 3 ? "STAY20" : "WELCOME20";
  return brandEmailHtml(
    `
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1A3A5C;">
      ${daysLeft <= 3 ? "Only " + daysLeft + " days left on your trial" : "Your trial is ending soon"}
    </h2>
    <p style="margin:0 0 16px;color:#4A5568;line-height:1.6;">
      Hey ${userName},<br><br>
      ${daysLeft <= 3
        ? "Your BidRank trial ends in just " + daysLeft + " day" + (daysLeft === 1 ? "" : "s") + ". Don't lose access to unlimited analyses, export, and team features."
        : "You've been using BidRank for a while now. Here's a reminder that your trial period is coming to an end."
      }
    </p>
    ${daysLeft <= 3 ? `
    <div style="background:linear-gradient(135deg,#1A3A5C,#2B5B8C);border-radius:12px;padding:24px;margin:16px 0;text-align:center;">
      <p style="margin:0 0 8px;color:#D4A843;font-weight:700;font-size:14px;text-transform:uppercase;letter-spacing:1px;">
        Exclusive Extension Offer
      </p>
      <p style="margin:0 0 12px;color:#fff;font-size:24px;font-weight:700;">
        20% off your first 3 months
      </p>
      <p style="margin:0 0 16px;color:rgba(255,255,255,0.7);font-size:14px;">
        Use code <span style="background:rgba(255,255,255,0.2);padding:4px 12px;border-radius:4px;font-weight:600;color:#D4A843;">${discountCode}</span> at checkout
      </p>
      <a href="https://www.bidrank.pro/pricing"
         style="display:inline-block;background:#D4A843;color:#1A3A5C;font-weight:600;
                padding:12px 32px;border-radius:8px;text-decoration:none;font-size:15px;">
        Upgrade Now →
      </a>
    </div>
    ` : `
    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.bidrank.pro/pricing"
         style="display:inline-block;background:#D4A843;color:#1A3A5C;font-weight:600;
                padding:12px 32px;border-radius:8px;text-decoration:none;font-size:15px;">
        View Plans →
      </a>
    </div>
    `}
    <p style="margin:0;color:#64748B;font-size:13px;line-height:1.5;">
      Questions? Reply to this email or visit our
      <a href="https://www.bidrank.pro/support" style="color:#2B5B8C;text-decoration:underline;">
        support page
      </a>.
    </p>
    `,
    daysLeft <= 3
      ? `Only ${daysLeft} days left — 20% off inside`
      : "Your trial is ending — upgrade to keep access"
  );
}

export function exitSurveyOfferEmail(userName: string) {
  return brandEmailHtml(
    `
    <h2 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#1A3A5C;">
      Sorry to see you go, ${userName}
    </h2>
    <p style="margin:0 0 16px;color:#4A5568;line-height:1.6;">
      We noticed your subscription was cancelled. We'd love to understand why —
      your feedback directly shapes what we build next.
    </p>
    <div style="text-align:center;margin:24px 0;">
      <a href="https://www.bidrank.pro/support?feedback=exit"
         style="display:inline-block;background:#1A3A5C;color:#fff;font-weight:600;
                padding:12px 32px;border-radius:8px;text-decoration:none;font-size:15px;">
        Take 30-Second Exit Survey
      </a>
    </div>
    <div style="background:#F5F7FA;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="margin:0 0 8px;font-weight:600;color:#1A3A5C;font-size:15px;">
        Before you go — 2 months free
      </p>
      <p style="margin:0;color:#4A5568;font-size:14px;line-height:1.6;">
        If timing was the issue, we'd love to give you 2 more months on us.
        Just reply to this email and we'll extend your access — no questions asked.
      </p>
    </div>
    <p style="margin:0;color:#64748B;font-size:13px;line-height:1.5;">
      Your account and analysis history are always preserved. Come back anytime.
    </p>
    `,
    "We'd love you back — 2 months free inside"
  );
}