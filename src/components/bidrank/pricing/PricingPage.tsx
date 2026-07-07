"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { analytics } from "@/lib/analytics";
import {
  Check,
  Shield,
  RefreshCw,
  Lock,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  CreditCard,
  Zap,
  Users,
  Star,
  ArrowRight,
  Minus,
  BadgeDollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ───────────────────────── Plan Feature Types ───────────────────────── */

type FeatureCell =
  | { type: "check" }
  | { type: "text"; value: string }
  | { type: "muted"; value: string }
  | { type: "dash" };

interface PlanFeatureRow {
  label: string;
  free: FeatureCell;
  starter: FeatureCell;
  pro: FeatureCell;
  studio: FeatureCell;
  enterprise: FeatureCell;
}

/* ───────────────────────── Plan Data ───────────────────────── */

const MONTHLY_PRICES: Record<string, number> = {
  free: 0,
  starter: 49,
  pro: 149,
  studio: 399,
};

const ANNUAL_PRICES: Record<string, number> = {
  free: 0,
  starter: 39,
  pro: 119,
  studio: 319,
};

const plans = [
  {
    id: "free",
    name: "Free Forever",
    description: "Try BidRank with no commitment",
    priceMonthly: 0,
    priceAnnual: 0,
    cta: "Get Started Free",
    ctaLink: "/free-tool",
    isExternal: true,
    features: [
      { label: "3 RFP analyses per month", cell: { type: "check" } },
      { label: "Basic compliance score", cell: { type: "check" } },
      { label: "10-page analysis limit", cell: { type: "check" } },
      { label: "Community support", cell: { type: "check" } },
      { label: "No credit card required", cell: { type: "check" } },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "For individual contractors getting started",
    priceMonthly: 49,
    priceAnnual: 39,
    badge: "Most Popular",
    highlighted: true,
    cta: "Start 14-Day Free Trial",
    ctaLink: null,
    features: [
      { label: "Unlimited RFP analyses", cell: { type: "check" } },
      { label: "Full compliance matrix", cell: { type: "check" } },
      { label: "Risk heatmap", cell: { type: "check" } },
      { label: "Bid/No-Bid score", cell: { type: "check" } },
      { label: "100-page analysis limit", cell: { type: "text", value: "100 pages" } },
      { label: "Email support", cell: { type: "check" } },
      { label: "Export to PDF/Excel", cell: { type: "check" } },
      { label: "14-day free trial, no credit card", cell: { type: "check" } },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For growing teams collaborating on bids",
    priceMonthly: 149,
    priceAnnual: 119,
    cta: "Start 14-Day Free Trial",
    ctaLink: null,
    features: [
      { label: "Everything in Starter", cell: { type: "check" } },
      { label: "Up to 3 team members", cell: { type: "text", value: "3 seats" } },
      { label: "Shared workspace", cell: { type: "check" } },
      { label: "Past performance library", cell: { type: "check" } },
      { label: "Teaming recommendations", cell: { type: "check" } },
      { label: "200-page analysis limit", cell: { type: "text", value: "200 pages" } },
      { label: "Priority support", cell: { type: "check" } },
      { label: "14-day free trial", cell: { type: "check" } },
    ],
  },
  {
    id: "studio",
    name: "Studio",
    description: "For established firms scaling operations",
    priceMonthly: 399,
    priceAnnual: 319,
    cta: "Start 14-Day Free Trial",
    ctaLink: null,
    features: [
      { label: "Everything in Pro", cell: { type: "check" } },
      { label: "Up to 10 team members", cell: { type: "text", value: "10 seats" } },
      { label: "API access", cell: { type: "check" } },
      { label: "White-label reports", cell: { type: "check" } },
      { label: "500-page analysis limit", cell: { type: "text", value: "500 pages" } },
      { label: "Dedicated account manager", cell: { type: "check" } },
      { label: "Custom AI training", cell: { type: "check" } },
      { label: "14-day free trial", cell: { type: "check" } },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations with custom needs",
    priceMonthly: -1,
    priceAnnual: -1,
    cta: "Contact Sales",
    ctaLink: "mailto:sales@bidrank.pro?subject=Enterprise Plan Inquiry",
    isExternal: true,
    features: [
      { label: "Everything in Studio", cell: { type: "check" } },
      { label: "Unlimited team members", cell: { type: "text", value: "Unlimited" } },
      { label: "On-premise deployment option", cell: { type: "check" } },
      { label: "SOC 2 + NIST 800-171 compliance", cell: { type: "check" } },
      { label: "Custom integrations", cell: { type: "check" } },
      { label: "Custom pricing", cell: { type: "muted", value: "Tailored to your needs" } },
    ],
  },
];

/* ───────────────────────── FAQ Data ───────────────────────── */

const faqs = [
  {
    question: "What is the Free Forever plan?",
    answer:
      "The Free Forever plan gives you 3 RFP analyses per month at no cost, with no credit card required. You get a basic compliance score and can analyze documents up to 10 pages. It's perfect for trying out BidRank before committing to a paid plan.",
  },
  {
    question: "Do I need a credit card to start a trial?",
    answer:
      "No. All paid plans include a 14-day free trial with no credit card required. You get full access to plan features during the trial period. Only when you decide to continue will you be asked for payment details.",
  },
  {
    question: "What types of RFPs does BidRank support?",
    answer:
      "BidRank supports PDF, Microsoft Word (.docx), Excel (.xlsx), and CSV files. It handles most federal RFP formats including NAVFAC, GSA, DoD, and civilian agency solicitations. For scanned PDFs, optical character recognition is applied. Maximum file size is 50 MB per upload.",
  },
  {
    question: "How does the Bid/No-Bid score work?",
    answer:
      "The Bid/No-Bid score is an AI-generated recommendation based on factors like compliance completeness, capability match, requirement clarity, and historical opportunity patterns. It helps you decide quickly whether an RFP is worth pursuing — saving hours of manual evaluation.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, absolutely. There are no long-term contracts. You can cancel from your account settings at any time. Your access continues until the end of your current billing period. We also offer a 30-day money-back guarantee on all paid plans.",
  },
  {
    question: "What is the 30-day money-back guarantee?",
    answer:
      "If you're not satisfied with BidRank within the first 30 days of a paid subscription, contact our support team for a full refund. No questions asked. This is in addition to the 14-day free trial, so you have plenty of time to evaluate the platform risk-free.",
  },
  {
    question: "Can I switch between plans?",
    answer:
      "Yes, you can upgrade or downgrade at any time from your account settings. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the start of your next billing cycle. Your data and analyses are always preserved.",
  },
  {
    question: "Is my RFP data secure?",
    answer:
      "All uploaded RFP documents are encrypted with AES-256 encryption at rest and in transit. Documents are stored in isolated, encrypted storage and automatically deleted after 90 days unless you opt to keep them. We never sell, share, or use your documents for any purpose other than providing the analysis service.",
  },
  {
    question: "How do team plans work?",
    answer:
      "Pro includes up to 3 team members with a shared workspace for collaborating on bid analyses. Studio includes up to 10 team members. Enterprise offers unlimited seats. All team members can view and contribute to analyses in real time within the shared workspace.",
  },
  {
    question: "What is white-label reporting in Studio?",
    answer:
      "Studio's white-label reports allow you to export RFP analyses with your own company branding — your logo, colors, and company name. This is ideal for consultants and firms that present analyses to clients or leadership stakeholders.",
  },
];

/* ───────────────────────── Comparison Table ───────────────────────── */

const planComparisonRows: PlanFeatureRow[] = [
  { label: "RFP analyses per month", free: { type: "text", value: "3" }, starter: { type: "text", value: "Unlimited" }, pro: { type: "text", value: "Unlimited" }, studio: { type: "text", value: "Unlimited" }, enterprise: { type: "text", value: "Unlimited" } },
  { label: "Analysis page limit", free: { type: "text", value: "10 pages" }, starter: { type: "text", value: "100 pages" }, pro: { type: "text", value: "200 pages" }, studio: { type: "text", value: "500 pages" }, enterprise: { type: "text", value: "Unlimited" } },
  { label: "Basic compliance score", free: { type: "check" }, starter: { type: "check" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Full compliance matrix", free: { type: "dash" }, starter: { type: "check" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Risk heatmap", free: { type: "dash" }, starter: { type: "check" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Bid/No-Bid score", free: { type: "dash" }, starter: { type: "check" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Export to PDF/Excel", free: { type: "dash" }, starter: { type: "check" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Team members", free: { type: "text", value: "1" }, starter: { type: "text", value: "1" }, pro: { type: "text", value: "3" }, studio: { type: "text", value: "10" }, enterprise: { type: "text", value: "Unlimited" } },
  { label: "Shared workspace", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Past performance library", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Teaming recommendations", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "check" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "API access", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "dash" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "White-label reports", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "dash" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Custom AI training", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "dash" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "Dedicated account manager", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "dash" }, studio: { type: "check" }, enterprise: { type: "check" } },
  { label: "SOC 2 + NIST 800-171", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "dash" }, studio: { type: "dash" }, enterprise: { type: "check" } },
  { label: "On-premise deployment", free: { type: "dash" }, starter: { type: "dash" }, pro: { type: "dash" }, studio: { type: "dash" }, enterprise: { type: "check" } },
  { label: "Support", free: { type: "text", value: "Community" }, starter: { type: "text", value: "Email" }, pro: { type: "text", value: "Priority" }, studio: { type: "text", value: "Dedicated" }, enterprise: { type: "text", value: "Dedicated + SLA" } },
  { label: "Free trial", free: { type: "text", value: "N/A" }, starter: { type: "text", value: "14 days" }, pro: { type: "text", value: "14 days" }, studio: { type: "text", value: "14 days" }, enterprise: { type: "muted", value: "Custom" } },
];

const bidrankVsManual = [
  { feature: "Time per RFP analysis", bidrank: "Under 3 minutes", manual: "4-6 hours" },
  { feature: "Compliance checks", bidrank: "200+ automated checkpoints", manual: "Manual review, error-prone" },
  { feature: "Risk identification", bidrank: "AI-powered, instant", manual: "Relies on experience" },
  { feature: "Cost per analysis", bidrank: "Included in subscription", manual: "$500-2,000+ (consultant)" },
  { feature: "Consistency", bidrank: "Same thoroughness every time", manual: "Varies by reviewer" },
  { feature: "Requirement extraction", bidrank: "Auto-extracted, sortable, exportable", manual: "Manual highlighting" },
  { feature: "Bid/No-Bid recommendation", bidrank: "AI-generated with reasoning", manual: "Gut feeling" },
  { feature: "Setup time", bidrank: "Zero \u2014 sign up and upload", manual: "Weeks of team training" },
];

/* ───────────────────────── Feature Cell Renderer ───────────────────────── */

function CellIcon({ cell }: { cell: FeatureCell }) {
  switch (cell.type) {
    case "check":
      return <Check className="h-4 w-4 text-green-600" />;
    case "text":
      return <span className="text-sm font-medium text-br-dark">{cell.value}</span>;
    case "muted":
      return <span className="text-xs text-br-text-secondary italic">{cell.value}</span>;
    case "dash":
      return <span className="text-br-text-secondary">&mdash;</span>;
  }
}

/* ───────────────────────── Checkout handler ───────────────────────── */

const planSlugs: Record<string, string | null> = {
  free: null,
  starter: "starter",
  pro: "pro",
  studio: "studio",
  enterprise: null,
};

/* ───────────────────────── Component ───────────────────────── */

export default function PricingPage() {
  const [faqOpen, setFaqOpen] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [annual, setAnnual] = useState(false);

  useEffect(() => {
    analytics.pricingPageViewed();
  }, []);

  const handleCheckout = async (planId: string) => {
    const slug = planSlugs[planId];
    if (!slug) return;
    setError(null);
    setLoading(slug);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: slug, billing: annual ? "annual" : "monthly" }),
      });
      let data;
      try {
        data = await res.json();
      } catch {
        setError("Server returned an unexpected response (" + res.status + "). Please try again.");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(data.detail || data.error || "Could not start checkout. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(null);
    }
  };

  const getPriceDisplay = (plan: (typeof plans)[number]) => {
    if (plan.priceMonthly === -1) return { price: "Custom", period: "" };
    const price = annual ? plan.priceAnnual : plan.priceMonthly;
    if (price === 0) return { price: "$0", period: "forever" };
    return { price: `$${price}`, period: annual ? "/mo, billed annually" : "/month" };
  };

  return (
    <section id="pricing" aria-label="Pricing plans">
      {/* ─── Header ─── */}
      <div className="bg-br-primary px-6 py-16 text-center">
        <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
          Simple, Transparent Pricing
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-br-text-secondary">
          Start free, scale as you grow. Every paid plan includes a 14-day free trial
          with no credit card required. Cancel anytime.
        </p>

        {/* Money-back guarantee badge */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white">
          <ShieldCheck className="h-4 w-4" />
          30-Day Money-Back Guarantee on all paid plans
        </div>
      </div>

      {/* ─── Billing Toggle ─── */}
      <div className="bg-br-surface border-b border-br-border">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8 flex items-center justify-center gap-4">
          <span className={`text-sm font-medium transition-colors ${!annual ? "text-br-dark" : "text-br-text-secondary"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-br-primary/50 focus:ring-offset-2 ${
              annual ? "bg-br-accent" : "bg-br-light"
            }`}
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-br-surface shadow ring-0 transition duration-200 ease-in-out ${
                annual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${annual ? "text-br-dark" : "text-br-text-secondary"}`}>
            Annual
          </span>
          {annual && (
            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-medium">
              Save 20%
            </Badge>
          )}
        </div>
      </div>

      {/* ─── Error Banner ─── */}
      {error && (
        <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* ─── Pricing Cards ─── */}
      <div className="mx-auto max-w-7xl bg-br-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          {plans.map((plan) => {
            const { price, period } = getPriceDisplay(plan);
            const isLoading = loading === (planSlugs[plan.id] ?? "");
            const isFree = plan.id === "free";
            const isEnterprise = plan.id === "enterprise";

            return (
              <Card
                key={plan.id}
                className={`relative flex flex-col rounded-xl border bg-br-surface shadow-br-sm card-hover ${
                  plan.highlighted
                    ? "border-[3px] border-br-accent scale-[1.03]"
                    : "border-br-border"
                } ${isFree ? "border-green-200 bg-green-50/30" : ""}`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="popular">
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-2 pt-8">
                  <CardTitle className="font-heading text-lg font-semibold text-br-dark">
                    {plan.name}
                  </CardTitle>
                  <p className="text-xs text-br-text-secondary mt-1">{plan.description}</p>
                  <div className="mt-3">
                    <span className={`font-mono-data text-3xl font-bold ${plan.highlighted ? "text-br-accent" : isFree ? "text-green-600" : "text-br-primary"}`}>
                      {price}
                    </span>
                    {period && (
                      <span className="text-sm text-br-text-secondary ml-1">{period}</span>
                    )}
                  </div>
                  {isFree && (
                    <p className="text-xs text-green-600 font-medium mt-1">
                      No credit card required
                    </p>
                  )}
                </CardHeader>

                <CardContent className="flex flex-1 flex-col gap-2">
                  <ul className="divide-y divide-br-border flex-1">
                    {plan.features.map((f) => (
                      <li key={f.label} className="flex items-start gap-2 py-2.5">
                        {f.cell.type === "check" ? (
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        ) : f.cell.type === "dash" ? (
                          <Minus className="h-4 w-4 text-br-text-secondary shrink-0 mt-0.5" />
                        ) : null}
                        <span className={`text-sm ${f.cell.type === "muted" ? "text-br-text-secondary italic" : "text-br-dark"}`}>
                          {f.cell.type === "text" || f.cell.type === "muted"
                            ? `${f.label} — ${f.cell.value}`
                            : f.label}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Trust signals under CTA */}
                  {!isEnterprise && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-br-text-secondary">
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />Cancel anytime
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />No hidden fees
                      </span>
                      <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />Secure via FastSpring
                      </span>
                    </div>
                  )}

                  <div className="mt-4 pt-3">
                    {isFree ? (
                      <Link href={plan.ctaLink || "/free-tool"}>
                        <Button
                          variant="ghost"
                          className="w-full font-semibold"
                          size="lg"
                        >
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    ) : isEnterprise ? (
                      <a href={plan.ctaLink || "#"}>
                        <Button
                          variant="ghost"
                          className="w-full font-semibold"
                          size="lg"
                        >
                          {plan.cta}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        disabled={isLoading}
                        onClick={() => handleCheckout(plan.id)}
                        className="w-full font-semibold"
                        size="lg"
                        variant={plan.id === "starter" ? "default" : plan.id === "pro" ? "secondary" : "ghost"}
                      >
                        {isLoading ? "Processing..." : plan.cta}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ─── Plan Comparison Table ─── */}
      <div className="bg-br-light px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading mb-2 text-center text-2xl font-bold text-br-dark md:text-3xl">
            Which Plan Is Right for You?
          </h2>
          <p className="mb-10 text-center text-br-text-secondary max-w-2xl mx-auto">
            Compare features across all plans to find the perfect fit for your federal contracting needs.
          </p>
          <Card className="overflow-hidden border-br-border shadow-br-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-br-primary text-white">
                    <th className="px-4 py-4 text-left font-semibold min-w-[200px]">Feature</th>
                    <th className="px-4 py-4 text-center font-semibold">Free</th>
                    <th className="px-4 py-4 text-center font-semibold bg-br-accent">Starter</th>
                    <th className="px-4 py-4 text-center font-semibold">Pro</th>
                    <th className="px-4 py-4 text-center font-semibold">Studio</th>
                    <th className="px-4 py-4 text-center font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-br-border">
                  {planComparisonRows.map((row, index) => (
                    <tr
                      key={row.label}
                      className={index % 2 === 0 ? "bg-br-surface" : "bg-br-light/50"}
                    >
                      <td className="px-4 py-3 font-medium text-br-dark whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-center"><CellIcon cell={row.free} /></td>
                      <td className="px-4 py-3 text-center bg-br-accent/5"><CellIcon cell={row.starter} /></td>
                      <td className="px-4 py-3 text-center"><CellIcon cell={row.pro} /></td>
                      <td className="px-4 py-3 text-center"><CellIcon cell={row.studio} /></td>
                      <td className="px-4 py-3 text-center"><CellIcon cell={row.enterprise} /></td>
                    </tr>
                  ))}
                  {/* Price row */}
                  <tr className="bg-br-light font-semibold">
                    <td className="px-4 py-4 text-br-dark">Price</td>
                    <td className="px-4 py-4 text-center text-br-dark font-mono-data">$0</td>
                    <td className="px-4 py-4 text-center bg-br-accent/10 text-br-dark font-mono-data">
                      {annual ? "$39/mo" : "$49/mo"}
                    </td>
                    <td className="px-4 py-4 text-center text-br-dark font-mono-data">
                      {annual ? "$119/mo" : "$149/mo"}
                    </td>
                    <td className="px-4 py-4 text-center text-br-dark font-mono-data">
                      {annual ? "$319/mo" : "$399/mo"}
                    </td>
                    <td className="px-4 py-4 text-center text-br-dark">Custom</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── BidRank vs Manual ─── */}
      <div className="bg-br-surface px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-heading mb-2 text-center text-2xl font-bold text-br-dark md:text-3xl">
            BidRank vs Manual RFP Analysis
          </h2>
          <p className="mb-10 text-center text-br-text-secondary">
            See how much time and money you save with AI-powered analysis.
          </p>
          <Card className="overflow-hidden border-br-border shadow-br-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-br-primary text-white">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold bg-br-accent">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        BidRank
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center font-semibold">Manual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-br-border">
                  {bidrankVsManual.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={index % 2 === 0 ? "bg-br-surface" : "bg-br-light/50"}
                    >
                      <td className="px-6 py-4 font-medium text-br-dark whitespace-nowrap">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center bg-br-accent/5">
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="text-green-700 font-medium">{row.bidrank}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4 text-br-text-secondary shrink-0" />
                          <span className="text-br-text-secondary">{row.manual}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── FAQ Section ─── */}
      <div className="bg-br-light px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading mb-2 text-center text-2xl font-bold text-br-dark md:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mb-8 text-center text-br-text-secondary">
            Everything you need to know about BidRank pricing and plans.
          </p>
          <Accordion
            type="single"
            collapsible
            value={faqOpen}
            onValueChange={setFaqOpen}
            className="bg-br-surface rounded-xl shadow-br-sm"
          >
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="px-6"
              >
                <AccordionTrigger className="font-heading text-sm font-semibold text-br-dark hover:no-underline transition-all md:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-br-text-secondary">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* ─── Trust Signals Row ─── */}
      <div className="bg-br-surface border-t border-br-border px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-br-dark">
              14-day free trial
            </span>
            <span className="text-xs text-br-text-secondary">No credit card required</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <RefreshCw className="h-6 w-6 text-br-text-secondary" />
            </div>
            <span className="text-sm font-medium text-br-dark">
              Cancel anytime
            </span>
            <span className="text-xs text-br-text-secondary">No long-term contracts</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
              <BadgeDollarSign className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-br-dark">
              30-day money-back guarantee
            </span>
            <span className="text-xs text-br-text-secondary">Risk-free commitment</span>
          </div>
          <div className="flex flex-col items-center text-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <Lock className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-br-dark">
              Secure payments
            </span>
            <span className="text-xs text-br-text-secondary">Via FastSpring</span>
          </div>
        </div>
      </div>

      {/* ─── Disclaimer ─── */}
      <div className="border-t border-br-border bg-br-surface px-4 py-6 sm:px-6 lg:px-8">
        <p className="mx-auto max-w-4xl text-xs text-br-text-secondary">
          Prices shown are in USD. Annual billing is paid upfront. Past performance
          of professionals listed does not guarantee future results. BidRank does
          not guarantee contract outcomes.
        </p>
      </div>

      {/* ─── Product Structured Data ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: "BidRank RFP Analysis",
            description: "AI-powered RFP analysis platform for federal contractors. Compliance checks, risk scoring, and actionable insights.",
            url: "https://www.bidrank.pro/pricing",
            brand: {
              "@type": "Brand",
              name: "BidRank",
            },
            offers: [
              {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                name: "Free Forever",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                price: "49",
                priceCurrency: "USD",
                name: "Starter Plan",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                price: "149",
                priceCurrency: "USD",
                name: "Pro Plan",
                availability: "https://schema.org/InStock",
              },
              {
                "@type": "Offer",
                price: "399",
                priceCurrency: "USD",
                name: "Studio Plan",
                availability: "https://schema.org/InStock",
              },
            ],
          }),
        }}
      />

      {/* ─── FAQPage Structured Data ─── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </section>
  );
}