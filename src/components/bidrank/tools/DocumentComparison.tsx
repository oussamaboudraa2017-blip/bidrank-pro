"use client";

import { useState, useCallback, useRef } from "react";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Upload,
  FileText,
  ArrowLeftRight,
  Plus,
  Minus,
  Pencil,
  CheckCircle,
  Lock,
  ChevronLeft,
} from "lucide-react";

type PageState = "upload" | "comparison";

interface DiffLine {
  id: string;
  section: string;
  type: "added" | "removed" | "modified" | "unchanged";
  oldText?: string;
  newText?: string;
}

const MOCK_DIFFS: DiffLine[] = [
  {
    id: "1",
    section: "1.0 Scope of Work",
    type: "modified",
    oldText:
      "The contractor shall provide IT support services for up to 500 users across three federal facilities.",
    newText:
      "The contractor shall provide IT support services for up to 1,200 users across five federal facilities, including two newly designated locations.",
  },
  {
    id: "2",
    section: "2.1 Security Requirements",
    type: "added",
    newText:
      "All personnel assigned to this contract must hold an active Top Secret clearance. Personnel without current clearance will not be permitted access to any government-furnished equipment or data.",
  },
  {
    id: "3",
    section: "2.2 Background Checks",
    type: "removed",
    oldText:
      "Contractor personnel shall undergo a standard NACI background investigation prior to receiving facility access credentials.",
  },
  {
    id: "4",
    section: "3.0 Deliverables",
    type: "modified",
    oldText:
      "Monthly status reports are due within 5 business days of the close of each reporting period.",
    newText:
      "Bi-weekly status reports are due within 3 business days of the close of each reporting period. Reports must follow the template provided in Attachment C.",
  },
  {
    id: "5",
    section: "4.0 Period of Performance",
    type: "unchanged",
    oldText:
      "The base period of performance shall be twelve (12) months from the effective date of the contract, with four (4) twelve-month option periods.",
    newText:
      "The base period of performance shall be twelve (12) months from the effective date of the contract, with four (4) twelve-month option periods.",
  },
  {
    id: "6",
    section: "5.0 Pricing Structure",
    type: "added",
    newText:
      "All pricing shall be submitted using a Firm Fixed Price (FFP) structure. The government will not accept Time & Materials or Labor Hour pricing models for this effort.",
  },
  {
    id: "7",
    section: "5.1 Travel Costs",
    type: "removed",
    oldText:
      "Travel costs shall be reimbursed at the applicable GSA per diem rate. Contractor shall submit travel vouchers within 30 days.",
  },
  {
    id: "8",
    section: "6.0 Key Personnel",
    type: "modified",
    oldText:
      "The Program Manager must have a minimum of 5 years of federal IT project management experience.",
    newText:
      "The Program Manager must have a minimum of 10 years of federal IT project management experience and hold a PMP certification from PMI.",
  },
];

const SUMMARY = {
  sectionsChanged: 3,
  newRequirements: 3,
  removedRequirements: 2,
};

export default function DocumentComparison() {
  const [state, setState] = useState<PageState>("upload");
  const [leftFile, setLeftFile] = useState<File | null>(null);
  const [rightFile, setRightFile] = useState<File | null>(null);
  const [leftDrag, setLeftDrag] = useState(false);
  const [rightDrag, setRightDrag] = useState(false);
  const leftInputRef = useRef<HTMLInputElement>(null);
  const rightInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (side: "left" | "right") =>
      (e: React.DragEvent) => {
        e.preventDefault();
        if (side === "left") setLeftDrag(false);
        else setRightDrag(false);
        const file = e.dataTransfer.files[0];
        if (file) {
          if (side === "left") setLeftFile(file);
          else setRightFile(file);
        }
      },
    []
  );

  const handleFileSelect = useCallback(
    (side: "left" | "right") =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          if (side === "left") setLeftFile(file);
          else setRightFile(file);
        }
      },
    []
  );

  const handleCompare = () => {
    setState("comparison");
  };

  const getDiffStyle = (type: DiffLine["type"]) => {
    switch (type) {
      case "added":
        return "bg-br-success/5 border-l-4 border-br-success";
      case "removed":
        return "bg-br-error/5 border-l-4 border-br-error line-through opacity-70";
      case "modified":
        return "bg-br-warning/5 border-l-4 border-br-warning";
      default:
        return "bg-br-surface border-l-4 border-br-border";
    }
  };

  const getDiffIcon = (type: DiffLine["type"]) => {
    switch (type) {
      case "added":
        return <Plus className="h-4 w-4 text-br-success shrink-0" />;
      case "removed":
        return <Minus className="h-4 w-4 text-br-error shrink-0" />;
      case "modified":
        return <Pencil className="h-4 w-4 text-br-warning shrink-0" />;
      default:
        return <CheckCircle className="h-4 w-4 text-br-text-secondary shrink-0" />;
    }
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
              <BreadcrumbPage>Document Comparison</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-heading text-br-primary">
                Document Comparison
              </h1>
              <Badge className="bg-br-accent text-br-dark hover:bg-br-accent/90">
                Pro+
              </Badge>
            </div>
            <p className="text-br-text-secondary">
              Compare previous proposals with new RFPs to instantly identify
              changes, new requirements, and removed sections.
            </p>
          </div>
          {state === "comparison" && (
            <Button
              variant="outline"
              onClick={() => setState("upload")}
              className="shrink-0"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              New Comparison
            </Button>
          )}
        </div>

        {/* Upload State */}
        {state === "upload" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left Upload Zone */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <FileText className="h-5 w-5 text-br-secondary" />
                  Previous Proposal
                </CardTitle>
                <CardDescription>
                  Upload your previous proposal (PDF or DOCX)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                    leftDrag
                      ? "border-br-primary bg-br-primary/5"
                      : leftFile
                      ? "border-br-success bg-br-success/5"
                      : "border-br-border hover:border-br-secondary hover:bg-br-light"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setLeftDrag(true);
                  }}
                  onDragLeave={() => setLeftDrag(false)}
                  onDrop={handleDrop("left")}
                  onClick={() => leftInputRef.current?.click()}
                >
                  <input
                    ref={leftInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={handleFileSelect("left")}
                  />
                  {leftFile ? (
                    <>
                      <CheckCircle className="mb-2 h-10 w-10 text-br-success" />
                      <p className="text-sm font-medium text-br-dark">
                        {leftFile.name}
                      </p>
                      <p className="text-xs text-br-text-secondary">
                        {(leftFile.size / 1024).toFixed(1)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-3 h-10 w-10 text-br-text-secondary" />
                      <p className="text-sm font-medium text-br-dark">
                        Drag & drop your file here
                      </p>
                      <p className="text-xs text-br-text-secondary mt-1">
                        or click to browse
                      </p>
                      <p className="text-xs text-br-text-secondary mt-2">
                        Supports PDF, DOCX
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right Upload Zone */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <FileText className="h-5 w-5 text-br-accent" />
                  New RFP
                </CardTitle>
                <CardDescription>
                  Upload the new RFP document (PDF or DOCX)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                    rightDrag
                      ? "border-br-accent bg-br-accent/5"
                      : rightFile
                      ? "border-br-success bg-br-success/5"
                      : "border-br-border hover:border-br-accent hover:bg-br-light"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setRightDrag(true);
                  }}
                  onDragLeave={() => setRightDrag(false)}
                  onDrop={handleDrop("right")}
                  onClick={() => rightInputRef.current?.click()}
                >
                  <input
                    ref={rightInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={handleFileSelect("right")}
                  />
                  {rightFile ? (
                    <>
                      <CheckCircle className="mb-2 h-10 w-10 text-br-success" />
                      <p className="text-sm font-medium text-br-dark">
                        {rightFile.name}
                      </p>
                      <p className="text-xs text-br-text-secondary">
                        {(rightFile.size / 1024).toFixed(1)} KB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="mb-3 h-10 w-10 text-br-text-secondary" />
                      <p className="text-sm font-medium text-br-dark">
                        Drag & drop your file here
                      </p>
                      <p className="text-xs text-br-text-secondary mt-1">
                        or click to browse
                      </p>
                      <p className="text-xs text-br-text-secondary mt-2">
                        Supports PDF, DOCX
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Compare Button */}
            <div className="md:col-span-2 flex justify-center">
              <Button
                size="lg"
                className="bg-br-primary hover:bg-br-secondary text-white px-10"
                onClick={handleCompare}
                disabled={!leftFile || !rightFile}
              >
                <ArrowLeftRight className="mr-2 h-5 w-5" />
                Compare Documents
              </Button>
            </div>
          </div>
        )}

        {/* Comparison State */}
        {state === "comparison" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-br-warning/10">
                    <Pencil className="h-5 w-5 text-br-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono-data text-br-primary">
                      {SUMMARY.sectionsChanged}
                    </p>
                    <p className="text-sm text-br-text-secondary">
                      Sections Changed
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-br-success/10">
                    <Plus className="h-5 w-5 text-br-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono-data text-br-primary">
                      {SUMMARY.newRequirements}
                    </p>
                    <p className="text-sm text-br-text-secondary">
                      New Requirements
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-br-error/10">
                    <Minus className="h-5 w-5 text-br-error" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono-data text-br-primary">
                      {SUMMARY.removedRequirements}
                    </p>
                    <p className="text-sm text-br-text-secondary">
                      Removed Requirements
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-br-success" />
                <span className="text-br-text-secondary">Added</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-br-error" />
                <span className="text-br-text-secondary">Removed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-br-warning" />
                <span className="text-br-text-secondary">Modified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-sm bg-br-light" />
                <span className="text-br-text-secondary">Unchanged</span>
              </div>
            </div>

            {/* Diff Entries */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-heading">Comparison Results</CardTitle>
                <CardDescription>
                  Showing {MOCK_DIFFS.length} sections from both documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {MOCK_DIFFS.map((diff) => (
                  <div
                    key={diff.id}
                    className={`rounded-lg p-4 ${getDiffStyle(diff.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getDiffIcon(diff.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-br-primary">
                            {diff.section}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {diff.type}
                          </Badge>
                        </div>

                        {/* Side-by-side for modified */}
                        {diff.type === "modified" && (
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="rounded bg-br-error/10 p-3">
                              <p className="text-xs font-medium text-br-error mb-1">
                                Previous
                              </p>
                              <p className="text-sm text-br-dark">
                                {diff.oldText}
                              </p>
                            </div>
                            <div className="rounded bg-br-success/10 p-3">
                              <p className="text-xs font-medium text-br-success mb-1">
                                New
                              </p>
                              <p className="text-sm text-br-dark">
                                {diff.newText}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Added */}
                        {diff.type === "added" && (
                          <div className="rounded bg-br-success/10 p-3">
                            <p className="text-sm text-br-dark">
                              {diff.newText}
                            </p>
                          </div>
                        )}

                        {/* Removed */}
                        {diff.type === "removed" && (
                          <div className="rounded bg-br-error/10 p-3">
                            <p className="text-sm text-br-dark line-through opacity-70">
                              {diff.oldText}
                            </p>
                          </div>
                        )}

                        {/* Unchanged */}
                        {diff.type === "unchanged" && (
                          <p className="text-sm text-br-text-secondary">
                            {diff.oldText}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-br-primary text-white">
              <CardContent className="flex flex-col sm:flex-row items-center gap-4 p-6">
                <Lock className="h-8 w-8 text-br-accent shrink-0" />
                <div className="text-center sm:text-left flex-1">
                  <p className="font-semibold text-lg">
                    Sign up to unlock full comparison
                  </p>
                  <p className="text-sm text-white/80">
                    Get AI-powered deep analysis with clause-level tracking,
                    risk impact scoring, and automated change summaries.
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