import { brandEmailHtml } from "@/lib/email";

export function onboardingEmail6(name: string) {
  return {
    subject: "Your Trial Ends Soon — Here's 20% Off Your First Month",
    html: brandEmailHtml(
      `<h2>Your Free Trial Is Ending, ${name}</h2>
<p>You've explored BidRank — now it's time to make it a permanent part of your GovCon workflow. Your trial includes 5 free analyses, and we want to make upgrading easy.</p>

<h3>Exclusive: 20% Off Your First Month</h3>
<p>Use the code below at checkout to lock in your discount:</p>

<div style="text-align:center; margin:24px 0;">
  <div style="display:inline-block; background:#0f2b46; color:#d4af37; font-size:28px; font-weight:800; padding:16px 32px; border-radius:8px; letter-spacing:4px; font-family:monospace;">
    WELCOME20
  </div>
</div>

<h3>What You Get With a Paid Plan</h3>
<ul>
  <li><strong>Basic ($49/mo):</strong> 15 analyses/month, PDF exports, email support</li>
  <li><strong>Pro ($99/mo):</strong> Unlimited analyses, team collaboration, priority support, advanced scoring</li>
</ul>

<p>Most BidRank users recoup their subscription cost on their <strong>first successful bid</strong> using our compliance insights. The question isn't whether you can afford it — it's whether you can afford not to have it.</p>

<p style="text-align:center;">
  <a href="https://www.bidrank.pro/pricing?code=WELCOME20" class="btn">Upgrade Now — 20% Off →</a>
</p>

<hr class="divider" />

<p style="font-size:13px; color:#64748b;">This discount expires in 72 hours and applies to your first month only. Valid on Basic and Pro plans.</p>`,
      "Your trial ends soon — 20% off"
    ),
  };
}