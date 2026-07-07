import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  Building2,
  DollarSign,
  Phone,
  UserCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "BidRank vs Enterprise GovCon Tools | BidRank",
  description:
    "Compare BidRank with enterprise GovCon tools. Get enterprise-level RFP analysis without the enterprise price tag, sales calls, or complexity.",
  openGraph: {
    title: "BidRank vs Enterprise GovCon Tools | BidRank",
    description:
      "Compare BidRank with enterprise GovCon tools. Get enterprise-level RFP analysis without the enterprise price tag, sales calls, or complexity.",
    url: "https://www.bidrank.pro/compare/enterprise-tools",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BidRank vs Enterprise GovCon Tools | BidRank",
    description:
      "Compare BidRank with enterprise GovCon tools. Get enterprise-level RFP analysis without the enterprise price tag, sales calls, or complexity.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/compare/enterprise-tools",
  },
};

const comparisonRows = [
  {
    feature: "Price",
    enterprise: "$500–$5,000+/month",
    bidrank: "From $49/month",
    winner: "bidrank" as const,
  },
  {
    feature: "Setup Time",
    enterprise: "Weeks of onboarding",
    bidrank: "Instant — sign up and go",
    winner: "bidrank" as const,
  },
  {
    feature: "Sales Call Required",
    enterprise: "Yes, mandatory demo",
    bidrank: "No — self-serve signup",
    winner: "bidrank" as const,
  },
  {
    feature: "AI-Powered Analysis",
    enterprise: "Varies by tool",
    bidrank: "Yes — every analysis",
    winner: "bidrank" as const,
  },
  {
    feature: "Built for Small Business",
    enterprise: "Built for mid-market+",
    bidrank: "Specifically for small biz",
    winner: "bidrank" as const,
  },
  {
    feature: "Contract Required",
    enterprise: "Annual commitment often",
    bidrank: "Month-to-month, cancel anytime",
    winner: "bidrank" as const,
  },
  {
    feature: "Compliance Checklists",
    enterprise: "Add-on or enterprise tier",
    bidrank: "Included in Pro plan",
    winner: "bidrank" as const,
  },
  {
    feature: "Risk Scoring",
    enterprise: "Enterprise-only feature",
    bidrank: "Included in all plans",
    winner: "bidrank" as const,
  },
  {
    feature: "Bid/No-Bid Recommendation",
    enterprise: "Manual or add-on",
    bidrank: "AI-powered, included",
    winner: "bidrank" as const,
  },
  {
    feature: "Obligation Tracking",
    enterprise: "Available",
    bidrank: "Planned — roadmap",
    winner: "enterprise" as const,
  },
  {
    feature: "Team Collaboration",
    enterprise: "Full suite",
    bidrank: "Planned — roadmap",
    winner: "enterprise" as const,
  },
];

const advantages = [
  {
    icon: DollarSign,
    title: "10x Lower Price",
    description:
      "Enterprise tools charge $500–$5,000+/month. BidRank starts at $49/month. Same AI analysis, fraction of the cost.",
  },
  {
    icon: Clock,
    title: "Instant Setup",
    description:
      "No sales calls. No onboarding process. No implementation timeline. Sign up, upload an RFP, get results — in under 5 minutes.",
  },
  {
    icon: UserCheck,
    title: "Built for Small Business",
    description:
      "Enterprise tools serve the top 5% of GovCon. BidRank is designed specifically for 8(a), HUBZone, SDVOSB, and WOSB firms.",
  },
  {
    icon: Phone,
    title: "No Sales Team Required",
    description:
      "Self-serve signup. Transparent pricing. No high-pressure demos or contract negotiations. Start winning on your terms.",
  },
  {
    icon: Sparkles,
    title: "AI-First, Not Legacy-First",
    description:
      "Enterprise tools bolt AI onto legacy platforms. BidRank was built AI-first from day one — every feature leverages AI.",
  },
  {
    icon: Zap,
    title: "Focused, Not Bloated",
    description:
      "We do one thing exceptionally well: RFP analysis. No feature bloat, no unused modules, no confusing navigation.",
  },
];

export default function CompareEnterpriseToolsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-br-accent/10 text-br-accent border-br-accent/20 mb-4 text-xs">
            Comparison
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Enterprise Power Without
            <br />
            <span className="text-br-accent">Enterprise Complexity</span>
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Tools like Rogue, GovDash, and Civio serve the top 5% of federal
            contractors. BidRank serves everyone else — with the AI power
            you&apos;d expect from tools costing 10x more.
          </p>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="bg-br-surface py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-3">
              Why Contractors Choose BidRank
            </h2>
            <p className="text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
              We&apos;re not trying to be everything to everyone. We&apos;re
              building the best RFP analysis tool for small federal contractors.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv) => (
              <div
                key={adv.title}
                className="bg-br-surface border-br-border border-l-4 border-l-br-accent rounded-xl shadow-br-sm p-6"
              >
                <adv.icon className="h-6 w-6 text-br-accent mb-3" />
                <h3 className="font-heading font-bold text-br-primary mb-2">{adv.title}</h3>
                <p className="text-sm text-br-text-secondary leading-relaxed">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-br-light py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-8 text-center">
            Feature Comparison
          </h2>

          <div className="rounded-xl border-br-border bg-br-surface overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-br-light hover:bg-br-hover">
                  <TableHead className="text-br-dark font-semibold text-sm">
                    Feature
                  </TableHead>
                  <TableHead className="text-br-dark font-semibold text-sm text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Building2 className="h-4 w-4" />
                      Enterprise Tools
                    </span>
                  </TableHead>
                  <TableHead className="bg-br-accent/5 text-br-dark font-semibold text-sm text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <Zap className="h-4 w-4 text-br-accent" />
                      BidRank
                    </span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map((row, i) => (
                  <TableRow
                    key={row.feature}
                    className={
                      i % 2 === 0 ? "bg-br-surface" : "bg-br-light/50"
                    }
                  >
                    <TableCell className="font-medium text-sm text-br-dark">
                      {row.feature}
                    </TableCell>
                    <TableCell className="text-sm text-br-text-secondary text-center">
                      {row.enterprise}
                    </TableCell>
                    <TableCell className="text-sm text-center bg-br-accent/5">
                      <span
                        className={
                          row.winner === "bidrank"
                            ? "text-br-success font-medium"
                            : "text-br-text-secondary"
                        }
                      >
                        {row.bidrank}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-br-text-secondary text-center mt-4">
            Enterprise tools referenced include platforms like Rogue, GovDash, and
            Civio. Comparison based on publicly available pricing and features as
            of 2026.
          </p>
        </div>
      </section>

      {/* Honest Section */}
      <section className="bg-br-surface py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-br-primary/5 rounded-2xl p-8 sm:p-10 border border-br-primary/10">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-br-primary mb-4">
              When You Might Need an Enterprise Tool
            </h2>
            <p className="text-br-text-secondary leading-relaxed mb-4">
              We believe in transparency. If you&apos;re a large government
              contractor managing 50+ active contracts, need obligation
              tracking, or require multi-team collaboration with granular
              permissions, an enterprise tool might be a better fit.
            </p>
            <p className="text-br-text-secondary leading-relaxed mb-4">
              But if you&apos;re a small business — an 8(a), HUBZone, SDVOSB,
              or WOSB firm — trying to evaluate and win more federal
              contracts, BidRank gives you{" "}
              <strong className="text-br-primary">
                90% of the analytical power at 10% of the price
              </strong>
              .
            </p>
            <p className="text-sm text-br-text-secondary leading-relaxed">
              We&apos;re actively building team collaboration and obligation
              tracking features. Sign up now and grow with us.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
            See Why Contractors Choose BidRank
          </h2>
          <p className="text-lg text-br-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
            No sales calls. No contracts. No enterprise pricing. Just powerful
            AI analysis built for your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/pricing">
              <Button
                size="lg"
                className="bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold text-lg px-8 py-6"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/compare/manual">
              <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white hover:bg-white/10 hover:text-white text-lg px-8 py-6"
              >
                vs. Manual Analysis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}