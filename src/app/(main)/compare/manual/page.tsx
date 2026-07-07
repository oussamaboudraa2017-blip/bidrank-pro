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
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  FileText,
} from "lucide-react";

export const metadata = {
  title: "BidRank vs Manual RFP Analysis | BidRank",
  description:
    "Compare BidRank's AI-powered RFP analysis with manual review. Save 6 hours per RFP, improve accuracy, and bid smarter.",
  openGraph: {
    title: "BidRank vs Manual RFP Analysis | BidRank",
    description:
      "Compare BidRank's AI-powered RFP analysis with manual review. Save 6 hours per RFP, improve accuracy, and bid smarter.",
    url: "https://www.bidrank.pro/compare/manual",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BidRank vs Manual RFP Analysis | BidRank",
    description:
      "Compare BidRank's AI-powered RFP analysis with manual review. Save 6 hours per RFP, improve accuracy, and bid smarter.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/compare/manual",
  },
};

const comparisonRows = [
  {
    feature: "Time to Analyze One RFP",
    manual: "4–6 hours",
    bidrank: "Under 3 minutes",
    winner: "bidrank" as const,
  },
  {
    feature: "Compliance Requirement Detection",
    manual: "Manual cross-referencing",
    bidrank: "Automatic extraction & checklist",
    winner: "bidrank" as const,
  },
  {
    feature: "Risk Identification",
    manual: "Often missed or subjective",
    bidrank: "Structured risk scoring",
    winner: "bidrank" as const,
  },
  {
    feature: "Bid/No-Bid Recommendation",
    manual: "Gut feeling, inconsistent",
    bidrank: "Data-driven scoring model",
    winner: "bidrank" as const,
  },
  {
    feature: "Cost per Analysis",
    manual: "$150–$300 (consultant rate × hours)",
    bidrank: "Included in subscription",
    winner: "bidrank" as const,
  },
  {
    feature: "Scalability",
    manual: "Limited by team size",
    bidrank: "Unlimited analyses",
    winner: "bidrank" as const,
  },
  {
    feature: "Consistency",
    manual: "Varies by analyst experience",
    bidrank: "Same standard every time",
    winner: "bidrank" as const,
  },
  {
    feature: "Past Performance Matching",
    manual: "Memory-dependent",
    bidrank: "Systematic capability mapping",
    winner: "bidrank" as const,
  },
  {
    feature: "Setup Time",
    manual: "None, but slow every time",
    bidrank: "2 minutes, fast forever",
    winner: "bidrank" as const,
  },
  {
    feature: "Learning Curve",
    manual: "Years of GovCon experience needed",
    bidrank: "Works for beginners and experts",
    winner: "bidrank" as const,
  },
];

const stats = [
  { icon: Clock, value: "6 hrs", label: "Saved per RFP", detail: "vs. manual review" },
  { icon: Target, value: "95%", label: "Compliance coverage", detail: "requirement detection" },
  { icon: DollarSign, value: "$200+", label: "Saved per analysis", detail: "vs. consultant fees" },
  { icon: TrendingUp, value: "3x", label: "More proposals", detail: "submitted per month" },
];

export default function CompareManualPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-br-accent/10 text-br-accent border-br-accent/20 mb-4 text-xs">
            Comparison
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            BidRank vs Manual
            <br />
            RFP Analysis
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Stop spending hours on each solicitation. See exactly how BidRank
            compares to the old way of doing things.
          </p>
        </div>
      </section>

      {/* Key Stats */}
      <section className="bg-br-surface py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-br-surface border-br-border rounded-xl shadow-br-sm p-6 text-center"
              >
                <stat.icon className="h-6 w-6 text-br-accent mx-auto mb-3" />
                <p className="text-3xl sm:text-4xl font-bold text-br-primary">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-br-dark mt-1">
                  {stat.label}
                </p>
                <p className="text-xs text-br-text-secondary mt-0.5">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-br-light py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-8 text-center">
            Feature-by-Feature Comparison
          </h2>

          <div className="rounded-xl border-br-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-br-light hover:bg-br-hover">
                  <TableHead className="text-br-dark font-semibold text-sm">
                    Feature
                  </TableHead>
                  <TableHead className="text-br-dark font-semibold text-sm text-center">
                    <span className="flex items-center justify-center gap-1.5">
                      <FileText className="h-4 w-4" />
                      Manual Analysis
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
                      {row.manual}
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
        </div>
      </section>

      {/* Time Comparison Visual */}
      <section className="bg-br-surface py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-10 text-center">
            The Time Difference
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-br-surface border-br-border rounded-xl shadow-br-sm p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-br-light mx-auto flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-br-text-secondary" />
              </div>
              <p className="text-5xl font-bold text-br-text-secondary mb-2">6 hrs</p>
              <p className="text-sm font-semibold text-br-text-secondary mb-1">
                Manual RFP Review
              </p>
              <p className="text-xs text-br-text-secondary">
                Reading, highlighting, cross-referencing, note-taking
              </p>
            </div>
            <div className="bg-br-surface border-br-border border-2 border-br-accent rounded-xl shadow-br-sm p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-br-accent/10 mx-auto flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-br-accent" />
              </div>
              <p className="text-5xl font-bold text-br-accent mb-2">3 min</p>
              <p className="text-sm font-semibold text-br-primary mb-1">
                BidRank Analysis
              </p>
              <p className="text-xs text-br-text-secondary">
                Upload, AI analysis, compliance checklist, risk score
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-lg text-br-primary font-semibold">
              That&apos;s a{" "}
              <span className="text-br-accent text-2xl font-bold">120x</span>{" "}
              speed improvement per RFP
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
            Stop Analyzing RFPs Manually
          </h2>
          <p className="text-lg text-br-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
            Every hour you spend manually reviewing an RFP is an hour you
            could spend writing a winning proposal. Let AI do the heavy
            lifting.
          </p>
          <Link href="/pricing">
            <Button
              size="lg"
              className="bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold text-lg px-8 py-6"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}