import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_NAME = "BidRank";
const FROM_EMAIL = "onboarding@bidrank.pro";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping send to:", to);
    return { success: false, message: "Email service not configured" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      replyTo: replyTo || "support@bidrank.pro",
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return { success: false, message: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("[email] Send failed:", error);
    return { success: false, message: "Internal error" };
  }
}

// ── Brand-styled email wrapper ─────────────────────
export function brandEmailHtml(bodyHtml: string, previewText?: string) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${previewText ? `<meta name="preview" content="${previewText}">` : ""}
  <style>
    body { margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px 16px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; }
    .header { background: #0f2b46; padding: 32px 32px 24px; text-align: center; }
    .header h1 { color: #d4af37; font-size: 24px; font-weight: 800; margin: 0; }
    .header p { color: #94a3b8; font-size: 13px; margin: 4px 0 0; }
    .body { padding: 32px; }
    .body h2 { color: #0f2b46; font-size: 20px; margin: 0 0 12px; font-weight: 700; }
    .body h3 { color: #0f2b46; font-size: 16px; margin: 24px 0 8px; font-weight: 600; }
    .body p { color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
    .body ul { color: #334155; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 0 0 16px; }
    .body li { margin-bottom: 4px; }
    .btn { display: inline-block; background: #d4af37; color: #0f2b46; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 700; font-size: 15px; }
    .btn:hover { background: #c4a030; }
    .btn-outline { display: inline-block; background: transparent; color: #0f2b46; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 2px solid #d4af37; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
    .footer { padding: 24px 32px; text-align: center; }
    .footer p { color: #94a3b8; font-size: 12px; line-height: 1.6; margin: 0; }
    .footer a { color: #d4af37; text-decoration: none; }
    .highlight { background: #fffbeb; border-left: 4px solid #d4af37; padding: 12px 16px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    .highlight p { margin: 0; font-size: 14px; }
    .stat-grid { display: flex; gap: 12px; margin: 16px 0; }
    .stat-box { flex: 1; background: #f8fafc; border-radius: 8px; padding: 12px; text-align: center; }
    .stat-box .num { font-size: 22px; font-weight: 800; color: #0f2b46; }
    .stat-box .label { font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>BidRank<span style="color:#fff">.pro</span></h1>
        <p>AI-Powered RFP Intelligence</p>
      </div>
      <div class="body">
        ${bodyHtml}
      </div>
      <div class="footer">
        <p>BidRank.pro — AI-powered RFP analysis for federal contractors</p>
        <p style="margin-top:8px;">
          <a href="https://www.bidrank.pro/analyzer">Analyze an RFP</a> &nbsp;·&nbsp;
          <a href="https://www.bidrank.pro/pricing">Pricing</a> &nbsp;·&nbsp;
          <a href="%%unsubscribe_url%%">Unsubscribe</a>
        </p>
        <p style="margin-top:8px;">AI-generated analysis is informational only. Not legal or professional advice.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}