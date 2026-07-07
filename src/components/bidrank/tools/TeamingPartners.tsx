"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Users,
  Shield,
  Cloud,
  Code,
  BarChart3,
  Lock,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Handshake,
  Star,
} from "lucide-react";

type PageState = "input" | "results";

interface CapabilityItem {
  name: string;
  have: boolean;
  required: boolean;
}

interface PartnerSuggestion {
  id: string;
  partnerType: string;
  icon: React.ReactNode;
  capabilities: string[];
  compatibilityScore: number;
  reason: string;
  idealSize: string;
}

const MOCK_CAPABILITIES: CapabilityItem[] = [
  { name: "IT Managed Services", have: true, required: true },
  { name: "Help Desk Support", have: true, required: true },
  { name: "Secret Clearance Personnel", have: false, required: true },
  { name: "Cloud Migration (AWS/Azure)", have: false, required: true },
  { name: "Cybersecurity Operations", have: true, required: true },
  { name: "Section 508 Compliance", have: true, required: true },
  { name: "Data Analytics & BI", have: false, required: false },
  { name: "Project Management (PMP)", have: true, required: true },
  { name: "Software Development", have: false, required: true },
  { name: "FedRAMP Experience", have: false, required: true },
];

const MOCK_PARTNERS: PartnerSuggestion[] = [
  {
    id: "p1",
    partnerType: "Cloud Infrastructure Partner",
    icon: <Cloud className="h-6 w-6" />,
    capabilities: [
      "AWS GovCloud Migration",
      "Azure Federal",
      "FedRAMP High Authorization",
      "Infrastructure as Code",
      "Cloud Cost Optimization",
    ],
    compatibilityScore: 95,
    reason:
      "The RFP requires cloud migration expertise and FedRAMP experience that your firm currently lacks. This partner type would fill your most critical gap.",
    idealSize: "Small to mid-size (50-200 employees)",
  },
  {
    id: "p2",
    partnerType: "Cleared Software Developer",
    icon: <Code className="h-6 w-6" />,
    capabilities: [
      "Full-Stack Development",
      "Secret & Top Secret Cleared Staff",
      "DevSecOps Pipelines",
      "Agile Methodology",
      "API Integration",
    ],
    compatibilityScore: 88,
    reason:
      "The software development requirements combined with clearance needs make this a strong complementary partner. Their cleared developers would round out your team.",
    idealSize: "Small business (15-75 employees)",
  },
  {
    id: "p3",
    partnerType: "Data Analytics & BI Firm",
    icon: <BarChart3 className="h-6 w-6" />,
    capabilities: [
      "Business Intelligence Dashboards",
      "Data Warehouse Design",
      "Machine Learning & AI",
      "Reporting & Visualization",
      "Data Governance",
    ],
    compatibilityScore: 72,
    reason:
      "While not a mandatory requirement, the RFP mentions data analytics capabilities as a desirable factor. This partner would strengthen your technical approach.",
    idealSize: "Small business (10-50 employees)",
  },
];

const MOCK_GAP_SUMMARY = {
  covered: 5,
  gaps: 5,
  criticalGaps: 3,
};

export default function TeamingPartners() {
  const [state, setState] = useState<PageState>("input");
  const [rfpText, setRfpText] = useState("");

  const handleAnalyze = () => {
    setState("results");
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-br-success";
    if (score >= 75) return "text-br-warning";
    return "text-br-warning";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 90) return "bg-br-success";
    if (score >= 75) return "bg-br-warning";
    return "bg-br-warning";
  };

  return (
    <div className="min-h-screen bg-br-light">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/analyzer">Tools</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Teaming Partner Finder</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-heading text-br-primary">
                Teaming Partner Finder
              </h1>
              <Badge className="bg-br-accent text-br-dark hover:bg-br-accent/90">
                Pro+
              </Badge>
            </div>
            <p className="text-br-text-secondary">
              Identify capability gaps and discover ideal teaming partners for
              your next federal proposal.
            </p>
          </div>
          {state === "results" && (
            <Button
              variant="outline"
              onClick={() => setState("input")}
              className="shrink-0"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          )}
        </div>

        {/* Input State */}
        {state === "input" && (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-br-secondary" />
                Paste RFP Requirements
              </CardTitle>
              <CardDescription>
                Paste the RFP requirements, capability section, or describe the
                capability gaps you need to fill. Our AI will analyze what you
                have versus what&apos;s needed and suggest partner types.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rfp-text">RFP Requirements / Capability Description</Label>
                <Textarea
                  id="rfp-text"
                  placeholder={`Paste the RFP section here, or describe your needs. For example:\n\n"The RFP requires IT managed services with cloud migration (AWS GovCloud), cybersecurity operations, and custom software development. All personnel need Secret clearance. The agency wants FedRAMP High compliance and Section 508 accessibility."`}
                  rows={10}
                  value={rfpText}
                  onChange={(e) => setRfpText(e.target.value)}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="bg-br-primary hover:bg-br-secondary text-white px-10"
                  onClick={handleAnalyze}
                  disabled={!rfpText.trim()}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Find Partners
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results State */}
        {state === "results" && (
          <div className="space-y-6">
            {/* Gap Summary */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-br-success/10">
                    <CheckCircle2 className="h-5 w-5 text-br-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono-data text-br-primary">
                      {MOCK_GAP_SUMMARY.covered}
                    </p>
                    <p className="text-sm text-br-text-secondary">
                      Capabilities Covered
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-br-error/10">
                    <XCircle className="h-5 w-5 text-br-error" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono-data text-br-primary">
                      {MOCK_GAP_SUMMARY.gaps}
                    </p>
                    <p className="text-sm text-br-text-secondary">
                      Capability Gaps
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-br-warning/10">
                    <AlertTriangle className="h-5 w-5 text-br-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono-data text-br-primary">
                      {MOCK_GAP_SUMMARY.criticalGaps}
                    </p>
                    <p className="text-sm text-br-text-secondary">Critical Gaps</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Capability Gap Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Shield className="h-5 w-5 text-br-secondary" />
                  Capability Gap Analysis
                </CardTitle>
                <CardDescription>
                  What you have vs. what the RFP requires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {MOCK_CAPABILITIES.map((cap) => (
                    <div
                      key={cap.name}
                      className={`flex items-center gap-3 rounded-lg border p-3 ${
                        cap.have
                          ? "border-br-success/20 bg-br-success/5"
                          : cap.required
                          ? "border-br-error/20 bg-br-error/5"
                          : "border-br-border bg-br-light/50"
                      }`}
                    >
                      {cap.have ? (
                        <CheckCircle2 className="h-4 w-4 text-br-success shrink-0" />
                      ) : cap.required ? (
                        <XCircle className="h-4 w-4 text-br-error shrink-0" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-br-text-secondary shrink-0" />
                      )}
                      <span className="text-sm text-br-dark flex-1">
                        {cap.name}
                      </span>
                      {cap.required && (
                        <Badge
                          variant={cap.have ? "secondary" : "destructive"}
                          className="text-xs shrink-0"
                        >
                          {cap.have ? "Have" : "Need"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Partner Suggestions */}
            <div>
              <h2 className="text-xl font-bold font-heading text-br-primary mb-4 flex items-center gap-2">
                <Handshake className="h-5 w-5 text-br-accent" />
                Suggested Partner Types
              </h2>
              <div className="grid gap-6 lg:grid-cols-3">
                {MOCK_PARTNERS.map((partner) => (
                  <Card key={partner.id} className="flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-br-primary/10 text-br-primary">
                            {partner.icon}
                          </div>
                          <CardTitle className="text-base font-heading">
                            {partner.partnerType}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      {/* Compatibility Score */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-br-text-secondary">
                            Compatibility
                          </span>
                          <span
                            className={`text-sm font-bold font-mono-data ${getScoreColor(partner.compatibilityScore)}`}
                          >
                            {partner.compatibilityScore}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-br-light">
                          <div
                            className={`h-2 rounded-full transition-all ${getScoreBarColor(partner.compatibilityScore)}`}
                            style={{
                              width: `${partner.compatibilityScore}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Reason */}
                      <p className="text-sm text-br-text-secondary">
                        {partner.reason}
                      </p>

                      {/* Capabilities */}
                      <div>
                        <p className="text-xs font-semibold text-br-primary mb-2">
                          Capabilities They Bring:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {partner.capabilities.map((cap) => (
                            <Badge
                              key={cap}
                              variant="outline"
                              className="text-xs"
                            >
                              {cap}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Ideal Size */}
                      <div className="flex items-center gap-2 text-xs text-br-text-secondary pt-1 border-t">
                        <Users className="h-3.5 w-3.5" />
                        <span>{partner.idealSize}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Card className="bg-br-primary text-white">
              <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
                <Lock className="h-8 w-8 text-br-accent shrink-0" />
                <div className="text-center sm:text-left flex-1">
                  <p className="font-semibold text-lg">
                    Sign up to connect with partners
                  </p>
                  <p className="text-sm text-white/80">
                    Access our network of vetted federal contractors, send
                    teaming invitations, and collaborate on joint proposals.
                  </p>
                </div>
                <Button className="bg-br-accent hover:bg-br-accent/90 text-br-dark shrink-0">
                  Sign Up Free
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}