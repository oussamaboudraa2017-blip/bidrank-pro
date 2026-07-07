"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Upload,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Mail,
  Shield,
  Zap,
  Lock,
  Download,
  Lightbulb,
  Clock,
  FileCheck,
  BarChart3,
  Users,
  Sparkles,
  FileSearch,
  Loader2,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { NewsletterSubscribe } from "@/components/bidrank/newsletter/NewsletterSubscribe";
import type { V2AnalysisResult } from "@/lib/gemini";

// ── State machine ─────────────────────────────────────
type FreeToolState = "upload" | "uploading" | "processing" | "results" | "error";

const processingSteps = [
  "\u{1F4C4} Extracting document structure... (10s)",
  "\u{1F50D} Analyzing Section L requirements... (20s)",
  "\u2696\uFE0F Checking FAR compliance... (30s)",
  "\u{1F4CA} Generating risk assessment... (complete)",
];

const LOCKED_FEATURES = [
  { icon: FileCheck, label: "Complete compliance matrix (all pages)" },
  { icon: BarChart3, label: "Detailed risk heatmap with mitigations" },
  { icon: Sparkles, label: "Bid/No-Bid recommendation with confidence score" },
  { icon: FileSearch, label: "Requirement extractor with export" },
  { icon: Lightbulb, label: "Executive summary with key action items" },
  { icon: Users, label: "Team sharing and collaboration" },
];

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function FreeToolPage() {
  const [state, setState] = useState<FreeToolState>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [animatedScore, setAnimatedScore] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<V2AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Page view analytics ─────────────────────────────────────
  useEffect(() => {
    trackEvent("free_tool_page_view", { category: "product" });
  }, []);

  // ── File validation ─────────────────────────────────────────
  const validateFile = (f: File): string | null => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    const validExtensions = [".pdf", ".docx", ".xlsx", ".txt"];
    const ext = "." + f.name.split(".").pop()?.toLowerCase();

    if (!validTypes.includes(f.type) && !validExtensions.includes(ext)) {
      return "Unsupported format. Please upload a PDF, DOCX, or XLSX file.";
    }
    if (f.size > MAX_FILE_SIZE_BYTES) {
      return `File too large (${(f.size / (1024 * 1024)).toFixed(1)} MB). Maximum size is ${MAX_FILE_SIZE_MB} MB.`;
    }
    return null;
  };

  const setValidFile = useCallback((f: File | null) => {
    setFileError(null);
    if (!f) {
      setFile(null);
      return;
    }
    const error = validateFile(f);
    if (error) {
      trackEvent("free_tool_upload_fail", { category: "product", metadata: { reason: error.substring(0, 100) } });
      setFileError(error);
      setFile(null);
      return;
    }
    setFile(f);
  }, []);

  // ── Drag & drop handlers ────────────────────────────────────
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) setValidFile(dropped);
    },
    [setValidFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0] || null;
      if (f) {
        trackEvent("free_tool_upload_start", { category: "product", metadata: { fileType: f.type, fileSize: f.size } });
      }
      setValidFile(f);
    },
    [setValidFile]
  );

  const analysisDoneRef = useRef(false);

  const startAnalysis = useCallback(async () => {
    if (!file || analysisDoneRef.current) return;
    analysisDoneRef.current = true;

    try { trackEvent("free_tool_upload_success", { category: "product" }); } catch {}

    // Phase 1: Upload animation
    setState("uploading");
    setUploadProgress(0);
    setApiError(null);
    setAnimatedScore(0);

    const uploadInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) { clearInterval(uploadInterval); return 90; }
        return prev + Math.random() * 30 + 10;
      });
    }, 200);

    const processingTimer = setTimeout(() => {
      clearInterval(uploadInterval);
      setUploadProgress(100);
      setState("processing");
      setCurrentStep(0);
      setProgress(0);
      const stepInterval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= processingSteps.length - 1) { clearInterval(stepInterval); return prev; }
          setProgress(((prev + 1) / processingSteps.length) * 100);
          return prev + 1;
        });
      }, 3000);
    }, 1200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/free-analyze", { method: "POST", body: formData });
      const data = await res.json();

      clearTimeout(processingTimer);

      if (!res.ok) {
        setApiError(data.error || "Analysis failed. Please try again.");
        setState("error");
        try { trackEvent("free_tool_analysis_error", { category: "product", metadata: { error: data.error?.substring(0, 100) } }); } catch {}
        return;
      }

      setResult(data);
      setProgress(100);

      const targetScore = data.metadata?.compliance_score || 0;
      let current = 0;
      const scoreInterval = setInterval(() => {
        current += 2;
        if (current >= targetScore) { current = targetScore; clearInterval(scoreInterval); }
        setAnimatedScore(current);
      }, 20);

      setState("results");

      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

      try { trackEvent("free_tool_analysis_complete", { category: "product", metadata: { score: data.metadata?.compliance_score } }); } catch {}
    } catch (err) {
      clearTimeout(processingTimer);
      setApiError("Network error. Please check your connection and try again.");
      setState("error");
      try { trackEvent("free_tool_analysis_error", { category: "product", metadata: { error: "network_error" } }); } catch {}
    }
  }, [file]);

  const resetTool = () => {
    analysisDoneRef.current = false;
    setState("upload");
    setFile(null);
    setFileError(null);
    setCurrentStep(0);
    setProgress(0);
    setAnimatedScore(0);
    setUploadProgress(0);
    setEmailStatus("idle");
    setEmail("");
    setApiError(null);
    setResult(null);
  };

  // ── Email capture ───────────────────────────────────────────
  const handleSendEmail = async () => {
    if (!email.trim()) return;
    setEmailStatus("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "free_tool_report" }),
      });
      if (res.ok) {
        setEmailStatus("sent");
        trackEvent("free_tool_email_capture", { category: "growth", metadata: { source: "free_tool_report" } });
      } else {
        setEmailStatus("error");
      }
    } catch {
      setEmailStatus("error");
    }
  };

  // ── Derived values from real data ───────────────────────────
  const score = result?.metadata?.compliance_score ?? 0;
  const riskLevel = result?.metadata?.risk_level ?? "MEDIUM";

  const scoreColor =
    score >= 75
      ? "text-br-success"
      : score >= 50
        ? "text-br-warning"
        : "text-br-error";

  const riskBadge = {
    HIGH: { label: "High Risk", color: "bg-br-error/10 text-br-error border border-br-error/30" },
    MEDIUM: { label: "Medium Risk", color: "bg-br-warning/10 text-br-warning border border-br-warning/30" },
    LOW: { label: "Low Risk", color: "bg-br-success/10 text-br-success border border-br-success/30" },
  }[riskLevel] || { label: "Medium Risk", color: "bg-br-warning/10 text-br-warning border border-br-warning/30" };

  // Merge all findings sorted by severity
  const allFindings = [
    ...(result?.critical_findings || []).map((f) => ({ ...f, _level: 0 })),
    ...(result?.high_findings || []).map((f) => ({ ...f, _level: 1 })),
    ...(result?.medium_findings || []).map((f) => ({ ...f, _level: 2 })),
    ...(result?.low_findings || []).map((f) => ({ ...f, _level: 3 })),
  ].slice(0, 5);

  const recommendations = result?.top_recommendations || [];

  // FAR compliance items
  const farItems = result?.far_compliance
    ? Object.entries(result.far_compliance).map(([clause, data]) => ({
        clause,
        ...data,
      }))
    : [];

  const formatProcessingTime = (timeStr?: string) => {
    if (!timeStr) return "< 1 min";
    return timeStr.replace("s", "s");
  };

  const findingIcon = (level: number) => {
    if (level === 0) return <XCircle className="w-5 h-5 text-br-error shrink-0 mt-0.5" />;
    if (level === 1) return <AlertTriangle className="w-5 h-5 text-br-accent shrink-0 mt-0.5" />;
    if (level === 2) return <AlertTriangle className="w-5 h-5 text-br-warning shrink-0 mt-0.5" />;
    return <CheckCircle className="w-5 h-5 text-br-success shrink-0 mt-0.5" />;
  };

  const farStatusIcon = (status: string) => {
    if (status === "COMPLIANT") return <CheckCircle className="w-4 h-4 text-br-success shrink-0" />;
    if (status === "MISSING") return <XCircle className="w-4 h-4 text-br-error shrink-0" />;
    return <div className="w-4 h-4 shrink-0 rounded-full border-2 border-br-text-secondary/40" />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── HERO SECTION ──────────────────────────────────────── */}
      <section className="bg-br-primary py-12 md:py-16 px-4" aria-label="Free RFP Analyzer">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-6 h-6 text-br-accent" />
            <span className="text-br-accent text-sm font-semibold uppercase tracking-wider">
              Free Tool — No Sign-Up Required
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 font-heading">
            Analyze Any Federal RFP in 60 Seconds — Free
          </h1>
          <h2 className="text-br-secondary text-lg md:text-xl max-w-2xl mx-auto mb-8 font-heading">
            No signup. No credit card. Instant compliance score, risk assessment, and key findings.
          </h2>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-br-accent/50 text-br-accent hover:bg-br-accent/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your RFP
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const sampleRFPText = `SOLICITATION NUMBER: W912DY-25-R-0001
DEPARTMENT OF DEFENSE
Department of the Army
FORT SAM HOUSTON, TX 78234

SUBJECT: Request for Proposal (RFP) - Enterprise IT Infrastructure Support Services

Section L - Instructions, Conditions, and Notices to Offerors

L.1 PURPOSE
The purpose of this solicitation is to obtain enterprise IT infrastructure support services for the United States Army Medical Department (AMEDD) at Fort Sam Houston, Texas. The contractor shall provide all personnel, equipment, tools, materials, supervision, and other items and services necessary to perform the work as specified herein.

L.2 BACKGROUND
The Department of the Army requires comprehensive IT infrastructure support to maintain and enhance the operational capability of AMEDD information systems. This includes network operations, systems administration, cybersecurity services, cloud services management, and end-user support across multiple facilities.

L.3 SCOPE OF WORK
L.3.1 The contractor shall provide 24x7x365 network operations center (NOC) support for all AMEDD network infrastructure.
L.3.2 All contractor personnel performing work under this contract shall possess a minimum of Secret security clearance in accordance with NISPOM.
L.3.3 The contractor shall maintain compliance with CMMC Level 2 requirements and DFARS 252.204-7012.
L.3.4 FedRAMP Moderate authorization is required for all cloud services utilized under this contract.
L.3.5 The estimated contract value is $15,000,000 over a five-year period of performance.

L.4 SECURITY REQUIREMENTS
L.4.1 This is a Department of Defense contract. All contractor personnel must hold an active Secret security clearance. Personnel accessing sensitive information may require Top Secret/SCI clearance.
L.4.2 The contractor shall maintain a valid Facility Clearance (FCL) at the Secret level throughout the period of performance.
L.4.3 All information systems must comply with DFARS 252.204-7012 and implement NIST SP 800-171 security controls.

L.5 SUBCONTRACTING PLAN
In accordance with FAR 52.219-9, the successful offeror shall submit a subcontracting plan since the contract value exceeds $750,000. The plan must address small business, 8(a), HUBZone, SDVOSB, and WOSB participation goals.

L.6 EVALUATION CRITERIA
Proposals shall be evaluated based on the following factors listed in descending order of importance:
(1) Technical Approach
(2) Past Performance
(3) Cost/Price
(4) Small Business Participation

L.7 SAM REGISTRATION
All offerors must be registered in the System for Award Management (SAM) at www.sam.gov in accordance with FAR 52.204-24. Offerors must maintain active registration throughout the period of contract performance.

L.8 SET-ASIDE STATUS
This solicitation is issued as a Small Business Set-Aside under NAICS Code 541512 (Computer Systems Design Services). The small business size standard is $27.5 million in average annual receipts.

L.9 SUBMISSION REQUIREMENTS
All proposals must be submitted electronically through the SAM.gov contract opportunities portal no later than 2:00 PM Central Time on August 15, 2026. Late proposals will not be considered.

Section M - Evaluation Criteria for Award
M.1 The Government will award a single firm-fixed-price contract resulting from this solicitation to the responsible offeror whose offer conforms to the solicitation and is most advantageous to the Government, cost and other factors considered.

M.2 The evaluation factors and their relative weights are:
- Technical Approach: 40%
- Past Performance: 30%
- Cost/Price: 20%
- Small Business Participation: 10%

Section I - Contract Clauses
I.1 The following FAR clauses apply to this contract:
- FAR 52.204-24 (Representation Regarding Certain Telecommunications and Video Surveillance Services or Equipment)
- FAR 52.204-21 (Basic Safeguarding of Covered Contractor Information Systems)
- FAR 52.212-3 (Offeror Representations and Certifications - Commercial Items)
- FAR 52.219-9 (Small Business Subcontracting Plan)
- DFARS 252.204-7012 (Safeguarding Covered Defense Information and Cyber Incident Reporting)`;
                // Create as .txt file so it passes through without needing PDF parsing
                const mockFile = new File(
                  [sampleRFPText],
                  "Sample_ARMY_IT_RFP.txt",
                  { type: "text/plain" }
                );
                setFile(mockFile);
                setFileError(null);
              }}
              className="text-br-text-secondary hover:text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Try Sample RFP
            </Button>
          </div>
          {/* Trust badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-sm text-br-text-secondary/80">
              <Lock className="w-4 h-4 text-br-accent/70" />
              <span>AES-256 Encrypted</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-br-border/40" aria-hidden="true" />
            <div className="flex items-center gap-2 text-sm text-br-text-secondary/80">
              <FileText className="w-4 h-4 text-br-accent/70" />
              <span>PDF / DOCX / XLSX Supported</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-br-border/40" aria-hidden="true" />
            <div className="flex items-center gap-2 text-sm text-br-text-secondary/80">
              <Zap className="w-4 h-4 text-br-accent/70" />
              <span>10MB Max</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <main className="flex-1 bg-br-light">
        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,.xlsx,.txt"
            onChange={(e) => {
              handleFileChange(e);
              document.getElementById("upload-zone")?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            aria-label="Upload RFP document"
          />

          {/* ── UPLOAD STATE ──────────────────────────────────── */}
          {state === "upload" && (
            <div className="space-y-8">
              <div
                id="upload-zone"
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-10 md:p-14 text-center transition-all cursor-pointer ${
                  dragOver
                    ? "border-br-secondary bg-br-hover scale-[1.01]"
                    : fileError
                      ? "border-red-300 bg-red-50/50 hover:border-red-400"
                      : "border-br-border bg-br-surface hover:border-br-secondary hover:bg-br-hover hover:shadow-lg"
                }`}
                role="button"
                tabIndex={0}
                aria-label="Drag and drop RFP file or click to browse"
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              >
                <Upload
                  className={`w-14 h-14 mx-auto mb-4 transition-colors ${
                    dragOver ? "text-br-primary" : fileError ? "text-red-400" : "text-br-text-secondary"
                  }`}
                />
                <p className="text-br-primary font-semibold text-lg mb-1">
                  {dragOver ? "Drop your RFP here" : "Drag & drop your RFP here"}
                </p>
                <p className="text-sm text-br-text-secondary mb-4">or click to browse files</p>
                <div className="inline-flex items-center gap-1.5 text-xs text-br-text-secondary bg-br-light rounded-full px-3 py-1">
                  <FileText className="w-3.5 h-3.5" />
                  PDF, DOCX, XLSX — Max {MAX_FILE_SIZE_MB} MB
                </div>

                {fileError && (
                  <div className="mt-4 inline-flex items-center gap-2 bg-br-error/10 text-br-error rounded-lg px-4 py-2.5 border border-br-error/30 text-sm">
                    <XCircle className="w-4 h-4 shrink-0" />
                    {fileError}
                  </div>
                )}

                {file && !fileError && (
                  <div className="mt-6 inline-flex items-center gap-2 bg-br-light rounded-lg px-4 py-2.5 border border-br-border">
                    <FileText className="w-4 h-4 text-br-secondary" />
                    <span className="text-sm font-medium text-br-dark">{file.name}</span>
                    <span className="text-xs text-br-text-secondary">({(file.size / 1024).toFixed(0)} KB)</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); setFileError(null); }}
                      className="text-br-text-secondary hover:text-red-500 ml-1"
                      aria-label="Remove selected file"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={startAnalysis}
                  disabled={!file}
                  className="bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold text-base px-10 py-6 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-br-accent/20 hover:shadow-br-accent/30 transition-shadow"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Get Free Compliance Score
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ── UPLOADING STATE ───────────────────────────────── */}
          {state === "uploading" && (
            <div className="py-16">
              <Card className="w-full p-8 md:p-10 text-center bg-br-surface border-br-border shadow-br-sm rounded-xl">
                <div className="mx-auto w-16 h-16 rounded-full bg-br-primary/10 flex items-center justify-center mb-6">
                  <Upload className="w-8 h-8 text-br-primary animate-bounce" />
                </div>
                <h2 className="text-2xl font-bold text-br-primary mb-2 font-heading">
                  Uploading Your Document
                </h2>
                <p className="text-br-text-secondary text-sm mb-6">{file?.name}</p>
                <div className="max-w-sm mx-auto">
                  <Progress value={Math.min(uploadProgress, 100)} className="h-2.5" />
                  <p className="text-xs text-br-text-secondary mt-3">
                    {Math.min(Math.round(uploadProgress), 100)}% uploaded
                  </p>
                </div>
              </Card>
            </div>
          )}

          {/* ── PROCESSING STATE ──────────────────────────────── */}
          {state === "processing" && (
            <div className="py-12">
              <Card className="w-full p-8 md:p-10 text-center bg-br-surface border-br-border shadow-br-sm rounded-xl">
                <div className="mx-auto w-16 h-16 rounded-full bg-br-primary/10 flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-br-primary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-br-primary mb-2 font-heading">
                  Analyzing Your Document
                </h2>
                <p className="text-br-text-secondary text-sm mb-8">{file?.name}</p>

                <div className="max-w-sm mx-auto space-y-6">
                  <Progress value={progress} className="h-2.5" />
                  <div className="space-y-3 text-left">
                    {processingSteps.map((step, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 text-sm transition-all duration-300 ${
                          i <= currentStep ? "opacity-100" : "opacity-30"
                        }`}
                      >
                        {i < currentStep ? (
                          <CheckCircle className="w-5 h-5 text-br-success shrink-0" />
                        ) : i === currentStep ? (
                          <Loader2 className="w-5 h-5 text-br-primary shrink-0 animate-spin" />
                        ) : (
                          <div className="w-5 h-5 shrink-0 rounded-full border-2 border-br-border" />
                        )}
                        <span className={i <= currentStep ? "text-br-dark font-medium" : "text-br-text-secondary"}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-br-text-secondary text-center">Almost there...</p>
                </div>
              </Card>
            </div>
          )}

          {/* ── ERROR STATE ───────────────────────────────────── */}
          {state === "error" && (
            <div className="py-16">
              <Card className="w-full p-8 md:p-10 text-center bg-br-surface border-br-border shadow-br-sm rounded-xl">
                <div className="mx-auto w-16 h-16 rounded-full bg-br-error/10 flex items-center justify-center mb-6">
                  <XCircle className="w-8 h-8 text-br-error" />
                </div>
                <h2 className="text-2xl font-bold text-br-primary mb-2 font-heading">
                  Analysis Failed
                </h2>
                <p className="text-br-text-secondary text-sm mb-6 max-w-md mx-auto">{apiError}</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button onClick={resetTool} variant="default" className="font-semibold">
                    Try Again
                  </Button>
                  <Link href="/pricing">
                    <Button variant="outline" className="font-semibold">
                      View Pricing Plans
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          )}

          {/* ── RESULTS STATE ────────────────────────────────── */}
          {state === "results" && result && (
            <div id="results-section" className="space-y-8">
              {/* Score + Risk Badge */}
              <Card className="bg-br-surface border border-br-border shadow-br-sm rounded-xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10">
                    {/* Score Circle */}
                    <div className="relative w-36 h-36 md:w-44 md:h-44 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120" role="img" aria-label={`Compliance score: ${score} out of 100`}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: 'var(--br-secondary)' }} />
                            <stop offset="100%" style={{ stopColor: 'var(--br-accent)' }} />
                          </linearGradient>
                        </defs>
                        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--br-border)" strokeWidth="10" />
                        <circle
                          cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGradient)" strokeWidth="10"
                          strokeLinecap="round" strokeDasharray={`${(animatedScore / 100) * 327} 327`}
                          className="transition-all duration-75"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-4xl md:text-5xl font-bold font-mono-data ${scoreColor}`}>{animatedScore}</span>
                        <span className="text-xs text-br-text-secondary">/ 100</span>
                      </div>
                    </div>

                    {/* Score Summary */}
                    <div className="text-center sm:text-left flex-1">
                      <h2 className="text-2xl font-bold text-br-primary mb-2 font-heading">
                        Instant Compliance Score & Risk Assessment
                      </h2>
                      <div className="mb-3">
                        <Badge className={`${riskBadge.color} hover:${riskBadge.color} text-sm px-3 py-1`}>
                          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                          {riskBadge.label}
                        </Badge>
                      </div>
                      {result.metadata?.agency && (
                        <p className="text-sm text-br-dark mb-1">
                          <span className="font-semibold">Agency:</span> {result.metadata.agency}
                        </p>
                      )}
                      {result.metadata?.contract_value && (
                        <p className="text-sm text-br-dark mb-1">
                          <span className="font-semibold">Contract Value:</span> {result.metadata.contract_value}
                        </p>
                      )}
                      {result.metadata?.naics_code && (
                        <p className="text-sm text-br-dark mb-3">
                          <span className="font-semibold">NAICS:</span> {result.metadata.naics_code}
                        </p>
                      )}
                      {/* Meta stats */}
                      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-br-text-secondary">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" />
                          <span className="font-semibold text-br-primary">{result.metadata?.pages_analyzed} of {result.metadata?.total_pages} pages</span> analyzed
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Analyzed in {formatProcessingTime(result.metadata?.processing_time)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {(result.critical_findings?.length || 0)} critical, {(result.high_findings?.length || 0)} high findings
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Critical Findings */}
              {result.critical_findings && result.critical_findings.length > 0 && (
                <Card className="bg-br-surface border-2 border-br-error/30 shadow-br-sm rounded-xl">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-lg font-bold text-br-error mb-5 flex items-center gap-2 font-heading">
                      <XCircle className="w-5 h-5" />
                      Critical Findings ({result.critical_findings.length})
                    </h3>
                    <div className="space-y-4">
                      {result.critical_findings.map((f, i) => (
                        <div key={i} className="p-4 rounded-lg bg-br-error/5 border border-br-error/20">
                          <p className="text-sm font-semibold text-br-dark mb-2">
                            {f.indicator} {f.finding}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-br-text-secondary">
                            <p><span className="font-medium text-br-dark">Source:</span> {f.source}</p>
                            <p><span className="font-medium text-br-dark">Timeline:</span> {f.timeline}</p>
                            <p><span className="font-medium text-br-dark">Consequence:</span> {f.consequence}</p>
                            <p><span className="font-medium text-br-dark">Action:</span> {f.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Key Findings (top 5 across all severities) */}
              {allFindings.length > 0 && (
                <Card className="bg-br-surface border border-br-border shadow-br-sm rounded-xl">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-lg font-bold text-br-primary mb-5 flex items-center gap-2 font-heading">
                      <Shield className="w-5 h-5 text-br-secondary" />
                      Top Findings
                    </h3>
                    <div className="space-y-3">
                      {allFindings.map((f, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-br-surface border border-br-border">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-br-light text-xs font-bold text-br-text-secondary shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {findingIcon(f._level)}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-br-dark">
                              {f.indicator} {f.finding}
                            </span>
                            <p className="text-xs text-br-text-secondary mt-1">Source: {f.source} | {f.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* FAR Compliance */}
              {farItems.length > 0 && (
                <Card className="bg-br-surface border border-br-border shadow-br-sm rounded-xl">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-lg font-bold text-br-primary mb-5 flex items-center gap-2 font-heading">
                      <FileCheck className="w-5 h-5 text-br-secondary" />
                      FAR Compliance Check
                    </h3>
                    <div className="space-y-3">
                      {farItems.map((item) => (
                        <div key={item.clause} className="flex items-center gap-3 p-3 rounded-lg bg-br-surface border border-br-border">
                          {farStatusIcon(item.status)}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-br-dark">{item.clause}</span>
                            <p className="text-xs text-br-text-secondary">
                              {item.status === "COMPLIANT" ? "Present and compliant" : item.status === "MISSING" ? "Required but missing" : "Not required for this RFP"}
                            </p>
                          </div>
                          <Badge
                            variant={item.status === "COMPLIANT" ? "default" : item.status === "MISSING" ? "destructive" : "secondary"}
                            className="text-xs shrink-0"
                          >
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top 3 Recommendations */}
              {recommendations.length > 0 && (
                <Card className="bg-br-surface border border-br-border shadow-br-sm rounded-xl border-l-4 border-l-br-accent">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-lg font-bold text-br-primary mb-3 flex items-center gap-2 font-heading">
                      <Lightbulb className="w-5 h-5 text-br-accent" />
                      Top Recommendations
                    </h3>
                    <div className="space-y-4">
                      {recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-br-accent/10 text-br-accent text-xs font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <p className="text-sm text-br-dark leading-relaxed">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── LOCKED FEATURES TEASER (CONVERSION GATE) ── */}
              <Card className="bg-br-surface border-2 border-br-accent/40 shadow-br-sm rounded-xl overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-br-primary mb-2 font-heading">
                        Full Analysis Includes
                      </h3>
                      <p className="text-sm text-br-text-secondary leading-relaxed mb-5">
                        Create a free account to unlock the complete analysis
                        with all compliance details, risk scoring, and
                        exportable reports.
                      </p>
                      <ul className="space-y-3">
                        {LOCKED_FEATURES.map(({ icon: Icon, label }) => (
                          <li key={label} className="flex items-center gap-3 text-sm text-br-dark">
                            <Lock className="w-4 h-4 text-br-secondary shrink-0" />
                            <Icon className="w-4 h-4 text-br-text-secondary shrink-0" />
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="shrink-0 flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                      <Link
                        href="/sign-up"
                        onClick={() => trackEvent("free_tool_signup_click", { category: "growth" })}
                      >
                        <Button variant="default" size="lg" className="font-semibold text-base px-8 py-5 w-full md:w-auto">
                          Create Free Account to Unlock
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                      <Link
                        href="/pricing"
                        onClick={() => trackEvent("free_tool_pricing_click", { category: "growth" })}
                        className="text-sm text-br-secondary hover:text-br-primary hover:underline flex items-center gap-1"
                      >
                        View Pricing Plans
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* ── EMAIL CAPTURE ─────────────────────────────── */}
              <Card className="bg-br-surface border border-br-border shadow-br-sm rounded-xl">
                <CardContent className="p-6 md:p-8">
                  <div className="text-center max-w-md mx-auto">
                    <div className="mx-auto w-12 h-12 rounded-full bg-br-primary/10 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-br-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-br-primary mb-2 font-heading">
                      Email me the full report + bonus: The Ultimate RFP Checklist
                    </h3>
                    <p className="text-sm text-br-text-secondary mb-5">
                      Get your analysis results delivered to your inbox, plus
                      our free 47-point federal compliance checklist.
                    </p>

                    {emailStatus === "sent" ? (
                      <div className="flex items-center justify-center gap-2 text-br-success bg-br-success/10 rounded-lg py-3 px-4">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Check your inbox! Report and checklist sent.</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailStatus === "error") setEmailStatus("idle");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleSendEmail()}
                          aria-label="Email address for free report and checklist"
                          className="flex-1 h-11"
                        />
                        <Button
                          onClick={handleSendEmail}
                          disabled={!email.trim() || emailStatus === "sending"}
                          className="bg-br-primary hover:bg-br-secondary text-white font-medium h-11 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {emailStatus === "sending" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Mail className="w-4 h-4 mr-2" />}
                          {emailStatus === "sending" ? "Sending..." : "Send My Report"}
                        </Button>
                      </div>
                    )}

                    {emailStatus === "error" && (
                      <p className="text-xs text-br-error mt-2">Something went wrong. Please try again.</p>
                    )}

                    <p className="text-xs text-br-text-secondary mt-3">We never spam. Unsubscribe anytime.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter CTA */}
              <div className="mt-6 max-w-xl mx-auto w-full">
                <NewsletterSubscribe variant="free_tool" source="free_tool_newsletter" />
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-br-text-secondary text-center pb-4 leading-relaxed max-w-2xl mx-auto">
                The Compliance Score and findings are AI-generated indicators
                based on document text. They are not a prediction of contract
                award and should not be the sole basis for any bid/no-bid
                decision. Always consult a qualified government contracts
                professional.
              </p>

              {/* Analyze Another */}
              <div className="text-center pb-4">
                <Button variant="outline" onClick={resetTool} className="border-br-primary text-br-primary">
                  Analyze Another RFP
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}