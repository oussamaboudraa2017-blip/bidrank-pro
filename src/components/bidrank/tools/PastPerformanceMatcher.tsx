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
import { Input } from "@/components/ui/input";
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
  Plus,
  Trash2,
  Search,
  Target,
  Building2,
  ChevronLeft,
  FileText,
  Briefcase,
  Percent,
  Lightbulb,
} from "lucide-react";

interface ContractEntry {
  id: string;
  title: string;
  agency: string;
  value: string;
  naics: string;
  description: string;
  periodStart: string;
  periodEnd: string;
}

interface RfpRequirement {
  id: string;
  text: string;
  category: string;
}

interface MatchResult {
  requirementId: string;
  requirement: string;
  matchedContract: string;
  relevanceScore: number;
  narrative: string;
}

const INITIAL_CONTRACT: ContractEntry = {
  id: crypto.randomUUID(),
  title: "",
  agency: "",
  value: "",
  naics: "",
  description: "",
  periodStart: "",
  periodEnd: "",
};

const MOCK_REQUIREMENTS: RfpRequirement[] = [
  {
    id: "r1",
    text: "Experience providing IT managed services to federal agencies with 500+ users",
    category: "Technical Capability",
  },
  {
    id: "r2",
    text: "Demonstrated experience with cloud migration (AWS/Azure) in a federal environment",
    category: "Cloud Experience",
  },
  {
    id: "r3",
    text: "Proven track record in cybersecurity operations meeting FISMA/NIST 800-53 requirements",
    category: "Security",
  },
  {
    id: "r4",
    text: "Experience with Section 508 accessibility compliance in federal IT projects",
    category: "Compliance",
  },
  {
    id: "r5",
    text: "Prior performance managing a $2M+ annual task order under an IDIQ vehicle",
    category: "Contract Management",
  },
];

const MOCK_MATCHES: MatchResult[] = [
  {
    requirementId: "r1",
    requirement:
      "Experience providing IT managed services to federal agencies with 500+ users",
    matchedContract: "DHS Enterprise IT Support Services",
    relevanceScore: 94,
    narrative:
      "Based on your past performance at the Department of Homeland Security, you can demonstrate extensive experience providing comprehensive IT managed services to over 800 federal users across multiple facilities. Your successful delivery of 24/7 help desk support, infrastructure management, and end-user computing services directly aligns with the requirement for scalable IT service delivery.",
  },
  {
    requirementId: "r2",
    requirement:
      "Demonstrated experience with cloud migration (AWS/Azure) in a federal environment",
    matchedContract: "VA Cloud Modernization Initiative",
    relevanceScore: 88,
    narrative:
      "Based on your past performance at the Department of Veterans Affairs, you can demonstrate hands-on cloud migration experience, having successfully migrated 12 legacy applications to AWS GovCloud while maintaining FedRAMP compliance. This experience provides a strong foundation for meeting the cloud migration requirements outlined in this RFP.",
  },
  {
    requirementId: "r3",
    requirement:
      "Proven track record in cybersecurity operations meeting FISMA/NIST 800-53 requirements",
    matchedContract: "DoD Cybersecurity Operations Center",
    relevanceScore: 82,
    narrative:
      "Based on your past performance at the Department of Defense, you can demonstrate a strong track record in cybersecurity operations, including continuous monitoring, incident response, and compliance with NIST 800-53 controls. Your team maintained an Authority to Operate (ATO) with zero critical findings for 18 consecutive months.",
  },
  {
    requirementId: "r4",
    requirement:
      "Experience with Section 508 accessibility compliance in federal IT projects",
    matchedContract: "HHS Public Portal Redesign",
    relevanceScore: 71,
    narrative:
      "Based on your past performance at HHS, you can demonstrate experience ensuring Section 508 compliance during the redesign of public-facing web portals. Your team conducted VPAT assessments and achieved WCAG 2.1 AA compliance across all deliverables.",
  },
  {
    requirementId: "r5",
    requirement:
      "Prior performance managing a $2M+ annual task order under an IDIQ vehicle",
    matchedContract: "GSA ASTRO IDIQ — IT Operations TO",
    relevanceScore: 96,
    narrative:
      "Based on your past performance under the GSA ASTRO IDIQ vehicle, you can demonstrate successful management of task orders exceeding $3.5M annually. You delivered all CLINs on schedule and within budget, receiving an Exceptional rating on the most recent CPARS evaluation.",
  },
];

type PageState = "form" | "results";

export default function PastPerformanceMatcher() {
  const [state, setState] = useState<PageState>("form");
  const [contracts, setContracts] = useState<ContractEntry[]>([
    { ...INITIAL_CONTRACT },
  ]);

  const addContract = () => {
    setContracts([...contracts, { ...INITIAL_CONTRACT, id: crypto.randomUUID() }]);
  };

  const removeContract = (id: string) => {
    if (contracts.length <= 1) return;
    setContracts(contracts.filter((c) => c.id !== id));
  };

  const updateContract = (id: string, field: keyof ContractEntry, value: string) => {
    setContracts(
      contracts.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-br-success bg-br-success/10";
    if (score >= 75) return "text-br-warning bg-br-warning/10";
    return "text-br-error bg-br-error/10";
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
              <BreadcrumbPage>Past Performance Matcher</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-heading text-br-primary">
                Past Performance Matcher
              </h1>
              <Badge className="bg-br-accent text-br-dark hover:bg-br-accent/90">
                Pro+
              </Badge>
            </div>
            <p className="text-br-text-secondary">
              Input your past contracts and match them against current RFP
              requirements with AI-powered relevance scoring.
            </p>
          </div>
          {state === "results" && (
            <Button
              variant="outline"
              onClick={() => setState("form")}
              className="shrink-0"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Edit Contracts
            </Button>
          )}
        </div>

        {/* Form State */}
        {state === "form" && (
          <div className="space-y-6">
            {contracts.map((contract, index) => (
              <Card key={contract.id} className="relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-heading flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-br-secondary" />
                      Contract #{index + 1}
                    </CardTitle>
                    {contracts.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContract(contract.id)}
                        className="text-br-error hover:text-br-error hover:bg-br-error/5"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${contract.id}`}>Contract Title</Label>
                      <Input
                        id={`title-${contract.id}`}
                        placeholder="e.g., DHS Enterprise IT Support"
                        value={contract.title}
                        onChange={(e) =>
                          updateContract(contract.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`agency-${contract.id}`}>Agency</Label>
                      <Input
                        id={`agency-${contract.id}`}
                        placeholder="e.g., Department of Homeland Security"
                        value={contract.agency}
                        onChange={(e) =>
                          updateContract(contract.id, "agency", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`value-${contract.id}`}>Contract Value</Label>
                      <Input
                        id={`value-${contract.id}`}
                        placeholder="e.g., $2,500,000"
                        value={contract.value}
                        onChange={(e) =>
                          updateContract(contract.id, "value", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`naics-${contract.id}`}>NAICS Code</Label>
                      <Input
                        id={`naics-${contract.id}`}
                        placeholder="e.g., 541512"
                        value={contract.naics}
                        onChange={(e) =>
                          updateContract(contract.id, "naics", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`start-${contract.id}`}>Period Start</Label>
                      <Input
                        id={`start-${contract.id}`}
                        type="date"
                        value={contract.periodStart}
                        onChange={(e) =>
                          updateContract(contract.id, "periodStart", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`end-${contract.id}`}>Period End</Label>
                      <Input
                        id={`end-${contract.id}`}
                        type="date"
                        value={contract.periodEnd}
                        onChange={(e) =>
                          updateContract(contract.id, "periodEnd", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`desc-${contract.id}`}>Description</Label>
                    <Textarea
                      id={`desc-${contract.id}`}
                      placeholder="Describe the scope, key accomplishments, and deliverables of this contract..."
                      rows={3}
                      value={contract.description}
                      onChange={(e) =>
                        updateContract(contract.id, "description", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={addContract}
                className="border-dashed"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Contract
              </Button>
              <Button
                size="lg"
                className="bg-br-primary hover:bg-br-secondary text-white px-10"
                onClick={() => setState("results")}
              >
                <Search className="mr-2 h-5 w-5" />
                Find Matches
              </Button>
            </div>
          </div>
        )}

        {/* Results State */}
        {state === "results" && (
          <div className="space-y-6">
            {/* RFP Requirements (Left) + Matched Performance (Right) */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Left: RFP Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Target className="h-5 w-5 text-br-secondary" />
                    Current RFP Requirements
                  </CardTitle>
                  <CardDescription>
                    Key requirements extracted from the RFP
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {MOCK_REQUIREMENTS.map((req) => (
                    <div
                      key={req.id}
                      className="rounded-lg border p-3 hover:bg-br-light transition-colors"
                    >
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {req.category}
                      </Badge>
                      <p className="text-sm text-br-dark">{req.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Right: Matched Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <FileText className="h-5 w-5 text-br-accent" />
                    Matched Past Performance
                  </CardTitle>
                  <CardDescription>
                    Your contracts matched with relevance scores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {MOCK_MATCHES.map((match) => (
                    <div
                      key={match.requirementId}
                      className="rounded-lg border p-3 space-y-2 hover:bg-br-light transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {MOCK_REQUIREMENTS.find((r) => r.id === match.requirementId)?.category}
                        </Badge>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold font-mono-data ${getScoreColor(match.relevanceScore)}`}
                        >
                          <Percent className="h-3 w-3" />
                          {match.relevanceScore}% match
                        </span>
                      </div>
                      <p className="text-sm font-medium text-br-primary">
                        {match.matchedContract}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Suggested Narratives */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-br-accent" />
                  Suggested Narrative Structure
                </CardTitle>
                <CardDescription>
                  AI-generated narrative suggestions based on your matched past
                  performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {MOCK_MATCHES.map((match, idx) => (
                  <div
                    key={match.requirementId}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-br-primary text-white text-sm font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-br-primary">
                          {MOCK_REQUIREMENTS.find((r) => r.id === match.requirementId)?.text}
                        </p>
                        <p className="text-xs text-br-text-secondary mt-0.5">
                          Matched with: {match.matchedContract}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold font-mono-data ${getScoreColor(match.relevanceScore)}`}
                      >
                        {match.relevanceScore}%
                      </span>
                    </div>
                    <div className="rounded bg-br-light p-3 pl-11">
                      <p className="text-sm text-br-dark leading-relaxed">
                        {match.narrative}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}