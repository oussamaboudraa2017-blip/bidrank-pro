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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  FileText,
  Sparkles,
  Copy,
  Save,
  BookOpen,
  CheckCircle,
  Clock,
  Trash2,
} from "lucide-react";

const REQUIREMENT_TYPES = [
  "Small Business Size",
  "8(a) Eligibility",
  "HUBZone Compliance",
  "SDVOSB Status",
  "Security Clearance",
  "Bonding Capacity",
  "Insurance Requirements",
  "Past Performance",
];

interface SavedNarrative {
  id: string;
  type: string;
  preview: string;
  date: string;
}

const MOCK_NARRATIVES: Record<string, string> = {
  "Small Business Size":
    '[Company Name] certifies that it is a small business concern as defined by the Small Business Administration (SBA) under 13 CFR Part 121. Based on our most recent fiscal year revenues of [$X million], our employee count of [Y] employees, and our primary NAICS code [541512 — Computer Systems Design Services], we confirm that [Company Name] is well below the applicable size standard of $27.5 million in average annual receipts.\n\nThis certification is made in accordance with FAR 52.219-6, and we acknowledge that any willful misrepresentation may result in debarment proceedings under FAR 9.406-2. We further certify that we will notify the Contracting Officer within 30 days of any change that would affect our small business size status.\n\nSupporting documentation, including our most recent SBA profile, financial statements, and Dun & Bradstreet report, is available upon request.',
  "8(a) Eligibility":
    '[Company Name] is an 8(a) certified firm within the SBA\'s 8(a) Business Development Program, having received our initial certification on [Date]. Our 8(a) certification number is [XXX-XXXX], and our program participation term extends through [Date].\n\nAs a qualified 8(a) participant, we have demonstrated social and economic disadvantage as outlined in 13 CFR Part 124. [Company Name] is owned by [Owner Name], who holds a [X]% ownership interest and serves as the President/CEO. [Owner/Her/His] personal net worth, excluding equity in the firm and primary residence, does not exceed the SBA threshold of $750,000.\n\nUnder the 8(a) program, [Company Name] has successfully completed [X] federal contracts valued at over [$Y million] in total. Our past performance demonstrates our ability to fulfill the requirements of this solicitation while contributing to the SBA\'s goal of fostering business development among socially and economically disadvantaged firms.',
  "HUBZone Compliance":
    '[Company Name] certifies that its principal office is located within a Historically Underutilized Business Zone (HUBZone) as designated by the SBA. Our principal office address is [Address], which falls within HUBZone census tract [XXXX.XX].\n\nIn accordance with FAR 52.219-3, at least 35% of our employees currently reside in a HUBZone. As of [Date], [X] of our [Y] total employees (representing [Z]%) are HUBZone residents. [Company Name] maintains a current HUBZone certification (SBA Certificate Number: [XXXXXX]) and is listed in the SBA\'s HUBZone directory at sam.gov.\n\nWe commit to maintaining our HUBZone employee residency percentage throughout the performance of this contract and will notify the Contracting Officer within 30 days of any change that could affect our HUBZone eligibility.',
  "SDVOSB Status":
    '[Company Name] is a verified Service-Disabled Veteran-Owned Small Business (SDVOSB) as confirmed through the Department of Veterans Affairs (VA) Verification Program. Our VA VIP Verification ID is [XXXXXXXXX], and our verification status is current as of [Date].\n\nThe firm is owned and controlled by [Owner Name], a service-disabled veteran who served in the [Branch of Service] from [Start Date] to [End Date]. [Owner\'s] service-connected disability rating is [X]%, as determined by the VA. [Owner Name] holds a [Y]% ownership interest in [Company Name] and serves as the [Title], making all day-to-day management and long-term strategic decisions for the firm.\n\nAs an SDVOSB, [Company Name] has demonstrated a strong track record of federal contract performance, having completed [X] contracts valued at [$Y million] over the past [Z] years. We are committed to upholding the highest standards of quality and service delivery in support of the federal government\'s procurement goals for veteran-owned businesses.',
  "Security Clearance":
    '[Company Name] maintains a robust security program that meets the requirements of the National Industrial Security Program (NISP) as outlined in 32 CFR Part 117 (formerly the NISPOM, DoD 5220.22-M). Our Facility Security Clearance (FCL) is held at the [Secret/Top Secret] level, issued by the [Defense Counterintelligence and Security Agency (DCSA)] on [Date]. Our CAGE Code is [XXXXXX]. and our Facility ID is [XXXXXXXX].\n\n[Company Name] currently employs [X] individuals who hold active [Secret/Top Secret] security clearances. Our Key Personnel for this effort include:\n\n• [Name], Program Manager — [Secret/Top Secret] clearance, adjudicated [Date]\n• [Name], Technical Lead — [Secret/Top Secret] clearance, adjudicated [Date]\n• [Name], Cybersecurity Lead — [Secret/Top Secret] clearance, adjudicated [Date]\n\nOur Facility Security Officer (FSO), [Name], holds an active [Top Secret] clearance and maintains our security program in full compliance with all applicable NISP requirements. We have established relationships with industrial security providers to ensure timely processing of new clearance investigations and reinvestigations.',
  "Bonding Capacity":
    "[Company Name] maintains bonding capacity through [Surety Company Name], a Treasury-listed surety rated A- (Excellent) by AM Best. Our current aggregate bonding capacity is [$X million], with a single-project bonding limit of [$Y million].\n\nOur surety relationship has been in place for [Z] years, during which we have maintained an exemplary claims history. Our most recent bonding reference is Bond Number [XXXXXXX], issued on [Date], for our contract with [Agency] valued at [$Amount].\n\nFor this effort, [Company Name] can provide the following bonds as required:\n\n• Bid Bond: 100% of the bid price\n• Performance Bond: 100% of the contract price\n• Payment Bond: 100% of the contract price\n\nWe have reviewed the bonding requirements of this solicitation and confirm that our current bonding capacity is sufficient to support the full value of this contract, including all option periods.",
  "Insurance Requirements":
    "[Company Name] maintains comprehensive insurance coverage that meets or exceeds the requirements specified in FAR 52.228-7 and any additional requirements outlined in this solicitation. Our current insurance program includes the following:\n\n• Commercial General Liability: $[X] million per occurrence / $[Y] million aggregate\n• Professional Liability (Errors & Omissions): $[X] million per claim / $[Y] million aggregate\n• Workers' Compensation: Statutory limits as required by [State] law, with employer's liability of $[Z] per accident\n• Automobile Liability: $[X] million combined single limit\n• Umbrella/Excess Liability: $[X] million\n\nAll insurance policies are issued by carriers rated A- (Excellent) or better by AM Best. Our insurance broker, [Broker Name], can provide Certificates of Insurance within 48 hours of contract award. [Company Name] agrees to maintain these coverage levels throughout the entire period of performance and to name the United States Government as an additional insured as required.\n\nProof of insurance, including Certificates of Insurance and policy endorsements, is available upon request.",
  "Past Performance":
    "[Company Name] has a demonstrated track record of successful performance on federal contracts of similar scope, complexity, and magnitude to the requirements of this solicitation. The following representative past performance references highlight our relevant experience:\n\n1. [Contract Title] — [Agency], [Value], [Period]\nDescription: [Brief description of work performed, deliverables, and outcomes]. This contract was rated [Exceptional/Satisfactory] on the most recent CPARS evaluation, with specific commendations for [achievement 1] and [achievement 2].\n\n2. [Contract Title] — [Agency], [Value], [Period]\nDescription: [Brief description]. This effort resulted in [quantifiable outcome] and was completed [ahead of schedule / within budget / both].\n\n3. [Contract Title] — [Agency], [Value], [Period]\nDescription: [Brief description]. Key accomplishments included [achievement] and [achievement].\n\nAcross all past performance efforts, [Company Name] has maintained an average CPARS rating of [Exceptional/Satisfactory], with zero instances of defective pricing, contract terminations, or corrective action requests. Contracting Officer contacts for each referenced contract are provided in Volume [X] of our proposal.",
};

const MOCK_SAVED: SavedNarrative[] = [
  {
    id: "s1",
    type: "Small Business Size",
    preview:
      "[Company Name] certifies that it is a small business concern as defined by the SBA under 13 CFR Part 121...",
    date: "2025-12-15",
  },
  {
    id: "s2",
    type: "Security Clearance",
    preview:
      "[Company Name] maintains a robust security program that meets the requirements of the National Industrial...",
    date: "2025-12-10",
  },
  {
    id: "s3",
    type: "8(a) Eligibility",
    preview:
      "[Company Name] is an 8(a) certified firm within the SBA's 8(a) Business Development Program...",
    date: "2025-11-28",
  },
];

export default function ComplianceNarrative() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [context, setContext] = useState("");
  const [generatedNarrative, setGeneratedNarrative] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedNarratives, setSavedNarratives] =
    useState<SavedNarrative[]>(MOCK_SAVED);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!selectedType) return;
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setGeneratedNarrative(MOCK_NARRATIVES[selectedType] || "");
      setIsGenerating(false);
    }, 1500);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = () => {
    if (!generatedNarrative || !selectedType) return;
    const newSaved: SavedNarrative = {
      id: crypto.randomUUID(),
      type: selectedType,
      preview:
        generatedNarrative.substring(0, 100) + "...",
      date: new Date().toISOString().split("T")[0],
    };
    setSavedNarratives((prev) => [newSaved, ...prev]);
  };

  const handleDelete = (id: string) => {
    setSavedNarratives((prev) => prev.filter((n) => n.id !== id));
  };

  const handleLoadSaved = (saved: SavedNarrative) => {
    setSelectedType(saved.type);
    setGeneratedNarrative(MOCK_NARRATIVES[saved.type] || "");
  };

  return (
    <div className="min-h-screen bg-br-light">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
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
              <BreadcrumbPage>Compliance Narrative Generator</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-heading text-br-primary">
              Compliance Narrative Generator
            </h1>
            <Badge className="bg-br-accent text-br-dark hover:bg-br-accent/90">
              Pro+
            </Badge>
          </div>
          <p className="text-br-text-secondary">
            Generate professional, FAR-compliant narrative language for your
            federal proposal compliance sections.
          </p>
        </div>

        {/* Generator Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <FileText className="h-5 w-5 text-br-secondary" />
              Generate Narrative
            </CardTitle>
            <CardDescription>
              Select the requirement type and optionally add context about your
              company for a personalized narrative.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Requirement Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a requirement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {REQUIREMENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Additional Context (Optional)</Label>
                <Textarea
                  placeholder="e.g., Our company name is Acme Federal Solutions, we have 45 employees, and our NAICS is 541512..."
                  rows={3}
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-br-primary hover:bg-br-secondary text-white px-10"
                onClick={handleGenerate}
                disabled={!selectedType || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Narrative
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Narrative */}
        {generatedNarrative && (
          <Card className="mb-8 border-br-accent/50">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-heading flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-br-accent" />
                    Generated: {selectedType}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Edit the narrative below to customize for your proposal
                  </CardDescription>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(generatedNarrative, "generated")}
                  >
                    {copiedId === "generated" ? (
                      <CheckCircle className="mr-1.5 h-4 w-4 text-br-success" />
                    ) : (
                      <Copy className="mr-1.5 h-4 w-4" />
                    )}
                    {copiedId === "generated" ? "Copied" : "Copy"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="mr-1.5 h-4 w-4" />
                    Save to Library
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generatedNarrative}
                onChange={(e) => setGeneratedNarrative(e.target.value)}
                rows={16}
                className="font-mono text-sm leading-relaxed"
              />
            </CardContent>
          </Card>
        )}

        {/* Saved Narratives Library */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-br-secondary" />
              Narrative Library
            </CardTitle>
            <CardDescription>
              Your saved compliance narratives. Click to load and edit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {savedNarratives.length === 0 ? (
              <div className="text-center py-8 text-br-text-secondary">
                <BookOpen className="mx-auto h-8 w-8 mb-2 opacity-40" />
                <p className="text-sm">
                  No saved narratives yet. Generate and save your first one above.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {savedNarratives.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-start gap-3 rounded-lg border p-4 hover:bg-br-light transition-colors cursor-pointer group"
                    onClick={() => handleLoadSaved(saved)}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-br-primary/10 text-br-primary shrink-0 mt-0.5">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-br-primary">
                          {saved.type}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          Saved
                        </Badge>
                      </div>
                      <p className="text-sm text-br-text-secondary line-clamp-2">
                        {saved.preview}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2 text-xs text-br-text-secondary">
                        <Clock className="h-3 w-3" />
                        {saved.date}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-br-error hover:text-br-error hover:bg-br-error/5 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(saved.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}