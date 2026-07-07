import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  AlertTriangle,
  Shield,
  Target,
  DollarSign,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "BidRank vs Generic Proposal Tools | BidRank",
  description:
    "Generic proposal tools like Proposify, PandaDoc, and Responsive are built for commercial proposals — not federal RFPs. See why they fail federal contractors.",
  openGraph: {
    title: "BidRank vs Generic Proposal Tools | BidRank",
    description:
      "Generic proposal tools like Proposify, PandaDoc, and Responsive are built for commercial proposals — not federal RFPs. See why they fail federal contractors.",
    url: "https://www.bidrank.pro/compare/generic-tools",
    siteName: "BidRank",
    type: "website",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/compare/generic-tools",
  },
};

const advantages = [
  {
    icon: Shield,
    title: "FAR & DFARS Compliance",
    description:
      "Generic tools have zero awareness of federal acquisition regulations. BidRank checks every clause automatically.",
  },
  {
    icon: Target,
    title: "Set-Aside Eligibility Detection",
    description:
      "Proposify can't tell if you qualify as 8(a), HUBZone, or SDVOSB. BidRank identifies every set-aside opportunity.",
  },
  {
    icon: Target,
    title: "Evaluation Factor Mapping",
    description:
      "Section M analysis is critical for federal bids. Generic tools treat all requirements equally.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Scoring & Heatmaps",
    description:
      "Federal proposals carry unique risks: security clearances, bonding, past performance thresholds. Generic tools miss all of it.",
  },
  {
    icon: DollarSign,
    title: "Federal Pricing Rules",
    description:
      "T&M, FFP, CPAF — federal pricing structures are fundamentally different from commercial. BidRank understands them.",
  },
  {
    icon: Phone,
    title: "No Enterprise Sales Call Required",
    description:
      "Proposify starts at $159/mo with annual commitments. PandaDoc requires a demo. BidRank starts free, instant access.",
  },
];

const comparisonRows = [
  {
    feature: "FAR/DFARS clause checking",
    proposify: "no",
    pandadoc: "no",
    responsive: "no",
    bidrank: "yes-green",
  },
  {
    feature: "Set-aside eligibility detection",
    proposify: "no",
    pandadoc: "no",
    responsive: "no",
    bidrank: "yes-green",
  },
  {
    feature: "Section L & M analysis",
    proposify: "no",
    pandadoc: "no",
    responsive: "no",
    bidrank: "yes-green",
  },
  {
    feature: "Risk scoring",
    proposify: "no",
    pandadoc: "no",
    responsive: "no",
    bidrank: "yes-green",
  },
  {
    feature: "Federal compliance scoring",
    proposify: "no",
    pandadoc: "no",
    responsive: "no",
    bidrank: "yes-green",
  },
  {
    feature: "Proposal templates",
    proposify: "yes",
    pandadoc: "yes",
    responsive: "yes",
    bidrank: "na",
    bidrankDetail: "N/A — focused on analysis",
  },
  {
    feature: "E-signature integration",
    proposify: "yes",
    pandadoc: "yes",
    responsive: "yes",
    bidrank: "na",
    bidrankDetail: "N/A",
  },
  {
    feature: "CRM integrations",
    proposify: "yes",
    pandadoc: "yes",
    responsive: "yes",
    bidrank: "planned",
  },
  {
    feature: "Commercial proposal support",
    proposify: "yes",
    pandadoc: "yes",
    responsive: "yes",
    bidrank: "na",
    bidrankDetail: "Federal only",
  },
  {
    feature: "Federal-only focus",
    proposify: "no",
    pandadoc: "no",
    responsive: "no",
    bidrank: "yes-green",
  },
  {
    feature: "Starting price",
    proposify: "$159/mo",
    pandadoc: "$19/mo",
    responsive: "$15/user/mo",
    bidrank: "free",
    bidrankDetail: "Free",
  },
  {
    feature: "No sales call required",
    proposify: "no",
    pandadoc: "no",
    responsive: "no",
    bidrank: "yes-green",
  },
];

function CellValue({ type, detail }: { type: string; detail?: string }) {
  switch (type) {
    case "yes-green":
      return (
        <span className="flex items-center justify-center gap-1.5 text-br-success font-medium">
          <CheckCircle className="h-4 w-4" />
          Yes
        </span>
      );
    case "no":
      return (
        <span className="flex items-center justify-center gap-1.5 text-br-error">
          <XCircle className="h-4 w-4" />
          No
        </span>
      );
    case "yes":
      return (
        <span className="flex items-center justify-center gap-1.5 text-br-success">
          <CheckCircle className="h-4 w-4" />
          Yes
        </span>
      );
    case "na":
      return <span className="text-br-text-secondary text-sm">{detail}</span>;
    case "planned":
      return <span className="text-br-text-secondary text-sm">Planned</span>;
    case "free":
      return (
        <span className="text-br-accent font-semibold text-sm">{detail}</span>
      );
    default:
      return <span className="text-sm text-br-text-secondary">{detail}</span>;
  }
}

export default function CompareGenericToolsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-br-accent/10 text-br-accent border-br-accent/20 mb-4 text-xs">
            Comparison
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Generic Proposal Tools Fail
            <br />
            <span className="text-br-accent">Federal Contractors</span>
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Proposify, PandaDoc, and Responsive are built for commercial
            proposals. Federal RFPs have entirely different requirements — FAR
            clauses, compliance scoring, set-aside eligibility, and security
            clearances.
          </p>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="bg-br-surface py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-3">
              Why Generic Tools Can&apos;t Compete
            </h2>
            <p className="text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
              Federal procurement is a different world. Generic proposal tools
              lack the domain expertise federal contractors need.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {advantages.map((adv) => (
              <Card
                key={adv.title}
                className="bg-br-surface border-br-border border-l-4 border-l-br-accent rounded-xl shadow-br-sm"
              >
                <CardContent className="p-6">
                  <adv.icon className="h-6 w-6 text-br-accent mb-3" />
                  <h3 className="font-heading font-bold text-br-primary mb-2">
                    {adv.title}
                  </h3>
                  <p className="text-sm text-br-text-secondary leading-relaxed">
                    {adv.description}
                  </p>
                </CardContent>
              </Card>
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
                    Proposify
                  </TableHead>
                  <TableHead className="text-br-dark font-semibold text-sm text-center">
                    PandaDoc
                  </TableHead>
                  <TableHead className="text-br-dark font-semibold text-sm text-center">
                    Responsive
                  </TableHead>
                  <TableHead className="bg-br-accent/5 text-br-dark font-semibold text-sm text-center">
                    <span className="flex items-center justify-center gap-1.5">
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
                    <TableCell className="text-sm text-center">
                      <CellValue type={row.proposify} />
                    </TableCell>
                    <TableCell className="text-sm text-center">
                      <CellValue type={row.pandadoc} />
                    </TableCell>
                    <TableCell className="text-sm text-center">
                      <CellValue type={row.responsive} />
                    </TableCell>
                    <TableCell className="text-sm text-center bg-br-accent/5">
                      <CellValue
                        type={row.bidrank}
                        detail={row.bidrankDetail}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-br-text-secondary text-center mt-4">
            Comparison based on publicly available pricing and features as of
            2026. Prices may vary by plan and usage.
          </p>
        </div>
      </section>

      {/* Honest Section */}
      <section className="bg-br-surface py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-br-primary/5 rounded-2xl p-8 sm:p-10 border border-br-primary/10">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-br-primary mb-4">
              When Generic Tools Are Better
            </h2>
            <p className="text-br-text-secondary leading-relaxed mb-4">
              We believe in transparency. If you&apos;re writing commercial
              proposals — SaaS quotes, agency pitches, or client contracts —
              Proposify, PandaDoc, and Responsive are excellent tools. They offer
              beautiful templates, e-signatures, and CRM integrations that
              BidRank doesn&apos;t.
            </p>
            <p className="text-br-text-secondary leading-relaxed mb-4">
              But if you&apos;re a federal contractor responding to RFPs, those
              features don&apos;t help you. You need{" "}
              <strong className="text-br-primary">
                FAR compliance, set-aside detection, and evaluation factor
                analysis
              </strong>{" "}
              — things generic tools simply weren&apos;t built to do.
            </p>
            <p className="text-sm text-br-text-secondary leading-relaxed">
              BidRank is purpose-built for federal procurement. If that&apos;s
              your world, there&apos;s no comparison.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white mb-4">
            See the Difference
          </h2>
          <p className="text-lg text-br-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
            Upload your first RFP for free and see what generic tools miss.
            No sales call, no credit card, no commitment.
          </p>
          <Link href="/free-tool">
            <Button
              size="lg"
              className="bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold text-lg px-8 py-6"
            >
              Try BidRank Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}