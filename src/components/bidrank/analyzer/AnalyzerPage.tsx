"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Upload,
  FileUp,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Hash,
  Shield,
  ArrowRight,
  Download,
  RotateCcw,
  AlertCircle,
  Info,
  Target,
  TrendingUp,
  ListChecks,
  Lightbulb,
  ChevronDown,
  FileSpreadsheet,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Eye,
  CircleDot,
  ArrowUpDown,
} from "lucide-react";
import { useUserPlan } from "@/hooks/useUserPlan";
import { analytics } from "@/lib/analytics";
import { UpgradePrompt, UpgradeBanner } from "@/components/bidrank/upgrade/UpgradePrompt";
import { FirstUploadCelebration, TourOverlay } from "@/components/bidrank/onboarding/FirstUploadCelebration";
import { SocialShareButtons } from "@/components/bidrank/sharing/SocialShareButtons";

type AnalyzerState = "upload" | "processing" | "results";

const processingSteps = [
  "Reading document...",
  "Extracting requirements...",
  "Checking compliance...",
  "Calculating readiness score...",
  "Generating report...",
];

interface ApiResult {
  executiveSummary: string;
  readinessScore: number;
  scoreBreakdown: {
    complianceCompleteness: number;
    capabilityMatch: number;
    requirementClarity: number;
    historicalPatterns: number;
  };
  keyMetrics: {
    contractValue: string | null;
    submissionDeadline: string | null;
    agency: string | null;
    naicsCode: string | null;
    naicsDescription: string | null;
    setAsideType: string | null;
  };
  complianceChecklist: Array<{
    item: string;
    status: "pass" | "warn" | "fail";
  }>;
  complianceCategories: Array<{
    name: string;
    score: number;
  }>;
  risks: Array<{
    level: "High" | "Medium" | "Low";
    title: string;
    description: string;
  }>;
  riskHeatmap: Array<{
    category: string;
    level: "Critical" | "High" | "Medium" | "Low";
  }>;
  bidRecommendation: {
    verdict: "BID" | "NO-BID" | "CONDITIONAL" | "NEEDS REVIEW";
    confidence: number;
    reasoning: string;
    actionItems: string[];
  };
  requirements: Array<{
    id: string;
    section: string;
    text: string;
    priority: "Critical" | "Important" | "Nice-to-Have";
    status: "Met" | "Partial" | "Missing";
  }>;
  recommendations: string[];
}

const MOCK_RESULT: ApiResult = {
  executiveSummary:
    "This Department of Defense RFP for Computer Systems Design Services represents a significant opportunity for 8(a)-certified small businesses with demonstrated experience in secure cloud migration and federal IT modernization. The solicitation requires Secret-level clearance for key personnel and emphasizes technical approach (40% weight) over price. The 30-day submission timeline is aggressive but manageable for firms with existing proposal infrastructure.",
  readinessScore: 72,
  scoreBreakdown: {
    complianceCompleteness: 85,
    capabilityMatch: 68,
    requirementClarity: 75,
    historicalPatterns: 60,
  },
  keyMetrics: {
    contractValue: "$2.4M",
    submissionDeadline: "Aug 15, 2026",
    agency: "Dept. of Defense",
    naicsCode: "541512",
    naicsDescription: "Computer Systems Design",
    setAsideType: "8(a) Only",
  },
  complianceChecklist: [
    { item: "FAR Part 12 — Commercial Items requirements addressed", status: "pass" },
    { item: "Small Business Size Standards Met", status: "pass" },
    { item: "Past Performance References — 2 of 3 required", status: "warn" },
    { item: "Security Clearance Documentation Missing", status: "fail" },
    { item: "Technical Approach Section Addressed", status: "pass" },
    { item: "Pricing Structure Incomplete — missing indirect rates", status: "warn" },
    { item: "Key Personnel Resumes Included", status: "pass" },
    { item: "Bonding Capacity Not Documented", status: "fail" },
  ],
  complianceCategories: [
    { name: "FAR Clauses", score: 82 },
    { name: "Set-Aside Eligibility", score: 95 },
    { name: "Past Performance", score: 60 },
    { name: "Financial Requirements", score: 45 },
    { name: "Security Requirements", score: 30 },
  ],
  risks: [
    { level: "High", title: "Narrow Technical Requirements", description: "The RFP specifies proprietary technology stack requirements that may limit the pool of qualified bidders but also raise barriers for small businesses without prior experience in this specific system." },
    { level: "High", title: "Aggressive Timeline", description: "The 30-day submission window is shorter than typical for this contract value, suggesting the agency may have a preferred vendor or expects incomplete proposals from new entrants." },
    { level: "Medium", title: "Subcontracting Plan Complexity", description: "The RFP requires a detailed subcontracting plan with specific percentage goals for multiple small business categories." },
    { level: "Medium", title: "Security Clearance Requirement", description: "Secret-level clearance is required for key personnel, which adds 4-8 weeks of lead time and significant cost for staffing the project." },
    { level: "Low", title: "Evaluation Criteria Weight Distribution", description: "Technical approach is weighted highest (40%), which favors firms with strong past performance in similar efforts." },
  ],
  riskHeatmap: [
    { category: "Technical Requirements", level: "High" },
    { category: "Compliance", level: "Medium" },
    { category: "Financial", level: "Low" },
    { category: "Security Clearance", level: "Critical" },
    { category: "Timeline", level: "High" },
    { category: "Subcontracting", level: "Medium" },
    { category: "Past Performance", level: "Medium" },
    { category: "Personnel", level: "Low" },
  ],
  bidRecommendation: {
    verdict: "CONDITIONAL",
    confidence: 78,
    reasoning: "This RFP presents a viable opportunity for your firm given your 8(a) certification and IT service capabilities. However, the Secret clearance requirement and aggressive 30-day timeline introduce significant risk. The technical approach is weighted highest at 40%, which favors your strengths, but you currently lack one of the three required past performance references. With targeted preparation—particularly securing a cleared subcontractor and obtaining an additional reference—this opportunity is worth pursuing.",
    actionItems: [
      "Obtain Secret-cleared subcontractor before submitting",
      "Secure one additional past performance reference in cloud migration",
      "Begin clearance process for key personnel immediately",
      "Develop detailed subcontracting plan exceeding minimum goals",
      "Request pre-proposal conference with contracting officer",
    ],
  },
  requirements: [
    { id: "REQ-001", section: "L", text: "Technical approach narrative not to exceed 30 pages", priority: "Critical", status: "Met" },
    { id: "REQ-002", section: "L", text: "Past performance references (minimum 3 required)", priority: "Critical", status: "Partial" },
    { id: "REQ-003", section: "M", text: "Firm fixed pricing with cost breakdown", priority: "Critical", status: "Met" },
    { id: "REQ-004", section: "H", text: "Secret-level clearance for key personnel", priority: "Critical", status: "Missing" },
    { id: "REQ-005", section: "L", text: "Small business subcontracting plan", priority: "Important", status: "Partial" },
    { id: "REQ-006", section: "M", text: "Key personnel resumes with 5-year experience", priority: "Important", status: "Met" },
    { id: "REQ-007", section: "C", text: "Cloud migration experience demonstration", priority: "Important", status: "Met" },
    { id: "REQ-008", section: "L", text: "Bonding capacity documentation", priority: "Important", status: "Missing" },
    { id: "REQ-009", section: "M", text: "Quality assurance surveillance plan", priority: "Nice-to-Have", status: "Partial" },
    { id: "REQ-010", section: "H", text: "ISO 27001 certification or equivalent", priority: "Nice-to-Have", status: "Missing" },
  ],
  recommendations: [
    "Address the security clearance requirement immediately — begin the clearance process for key personnel or identify cleared subcontractors to avoid staffing delays.",
    "Strengthen past performance by obtaining at least one additional reference in a similar technical domain before submission.",
    "Develop a detailed subcontracting plan that exceeds the minimum percentage goals — this is a meaningful differentiator in evaluation scoring.",
    "Consider partnering with a firm that has direct experience with the specified technology stack to mitigate the narrow requirements risk.",
    "Request a pre-proposal conference with the contracting officer to clarify ambiguous requirements and demonstrate your genuine interest.",
  ],
};

/* ── Helper: Compliance circle SVG ─────────── */
function ComplianceCircle({ value, size = 120 }: { value: number; size?: number }) {
  const radius = (size / 2) - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? "#0D9488" : value >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold font-mono-data" style={{ color }}>{value}</span>
        <span className="text-[10px] text-br-text-secondary">/ 100</span>
      </div>
    </div>
  );
}

/* ── Helper: Horizontal progress bar ───────── */
function CategoryBar({ name, score }: { name: string; score: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-br-dark truncate">{name}</span>
        <span className="text-xs font-semibold text-br-dark font-mono-data shrink-0 ml-2">{score}%</span>
      </div>
      <div className="h-2 bg-br-light rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 bg-br-secondary"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

/* ── Helper: Heatmap cell color ────────────── */
function HeatmapDot({ level }: { level: string }) {
  const colorMap: Record<string, string> = {
    Critical: "bg-br-error",
    High: "bg-br-warning",
    Medium: "bg-br-warning",
    Low: "bg-br-success",
  };
  const bg = colorMap[level] ?? "bg-br-light";
  return (
    <div className="flex items-center justify-center h-9 w-full">
      <div className={`w-6 h-6 rounded-full ${bg} shadow-sm`} />
    </div>
  );
}

/* ── Helper: Export analysis to PDF ───────── */
function exportToPdf(r: ApiResult) {
  const overallCompliance = r.complianceCategories.length
    ? Math.round(r.complianceCategories.reduce((s, c) => s + c.score, 0) / r.complianceCategories.length)
    : 0;

  const riskColor = (level: string) =>
    level === "Critical" ? "#dc2626" : level === "High" ? "#f59e0b" : level === "Medium" ? "#f59e0b" : "#16a34a";

  const statusIcon = (s: string) =>
    s === "pass" ? "\u2705" : s === "warn" ? "\u26A0\uFE0F" : "\u274C";

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>BidRank RFP Analysis Report</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;padding:40px;max-width:800px;margin:0 auto;font-size:14px;line-height:1.6}
  h1{font-size:24px;font-weight:700;color:#1e3a5f;margin-bottom:4px}
  .subtitle{color:#64748b;font-size:13px;margin-bottom:24px}
  .disclaimer{background:#fefce8;border:1px solid #fbbf24;border-radius:8px;padding:12px;font-size:11px;color:#92400e;margin-bottom:24px}
  h2{font-size:16px;font-weight:600;color:#1e3a5f;margin:24px 0 12px;padding-bottom:6px;border-bottom:2px solid #1e3a5f}
  .metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
  .metric{background:#f8fafc;border-radius:8px;padding:12px;text-align:center}
  .metric-label{font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px}
  .metric-value{font-size:15px;font-weight:600;color:#1e293b;margin-top:2px}
  .score-row{display:flex;gap:16px;align-items:center;margin:16px 0}
  .score-big{font-size:48px;font-weight:700;color:#1e3a5f}
  .breakdown{display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1}
  .breakdown-item{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid #f1f5f9}
  .breakdown-item span:last-child{font-weight:600}
  .verdict{padding:16px;border-radius:8px;border:2px solid #1e3a5f;margin:16px 0}
  .verdict-badge{display:inline-block;padding:4px 12px;border-radius:20px;color:#fff;font-weight:700;font-size:13px;margin-bottom:8px}
  .checklist{width:100%;border-collapse:collapse;margin:8px 0}
  .checklist td,.checklist th{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}
  .checklist th{background:#f8fafc;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase;letter-spacing:0.5px}
  .risk-item{padding:12px;margin:8px 0;border-radius:8px;border-left:4px solid;background:#f8fafc}
  .risk-title{font-weight:600;font-size:14px;margin-bottom:4px}
  .risk-desc{font-size:13px;color:#475569}
  .req-table{width:100%;border-collapse:collapse;margin:8px 0}
  .req-table td,.req-table th{padding:6px 10px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:12px}
  .req-table th{background:#f8fafc;font-weight:600;color:#475569;font-size:11px;text-transform:uppercase}
  .rec-list{padding-left:20px}
  .rec-list li{margin:6px 0;font-size:13px}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center}
  @media print{
    body{padding:20px}
    @page{
      size:auto;
      margin:0;
    }
    .print-footer{
      position:fixed;
      bottom:0;left:0;right:0;
      text-align:center;
      font-size:10px;
      color:#94a3b8;
      padding:8px 20mm;
      border-top:1px solid #e2e8f0;
      background:#fff;
    }
  }
</style></head><body>
<h1>BidRank RFP Analysis Report</h1>
<p class="subtitle">Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
<div class="disclaimer">The Bid Readiness Score and analysis are AI-generated indicators based on RFP text and self-reported business profile. They are not a prediction of contract award and should not be the sole basis for any bid/no-bid decision.</div>

<h2>Executive Summary</h2>
<p>${r.executiveSummary || "No summary available."}</p>

<h2>Key Metrics</h2>
<div class="metrics">
  ${r.keyMetrics.contractValue ? `<div class="metric"><div class="metric-label">Contract Value</div><div class="metric-value">${r.keyMetrics.contractValue}</div></div>` : ""}
  ${r.keyMetrics.submissionDeadline ? `<div class="metric"><div class="metric-label">Deadline</div><div class="metric-value">${r.keyMetrics.submissionDeadline}</div></div>` : ""}
  ${r.keyMetrics.agency ? `<div class="metric"><div class="metric-label">Agency</div><div class="metric-value">${r.keyMetrics.agency}</div></div>` : ""}
  ${r.keyMetrics.naicsCode ? `<div class="metric"><div class="metric-label">NAICS Code</div><div class="metric-value">${r.keyMetrics.naicsCode}</div></div>` : ""}
  ${r.keyMetrics.naicsDescription ? `<div class="metric"><div class="metric-label">NAICS Description</div><div class="metric-value">${r.keyMetrics.naicsDescription}</div></div>` : ""}
  ${r.keyMetrics.setAsideType ? `<div class="metric"><div class="metric-label">Set-Aside</div><div class="metric-value">${r.keyMetrics.setAsideType}</div></div>` : ""}
</div>

<h2>Bid Readiness Score</h2>
<div class="score-row">
  <div class="score-big">${r.readinessScore}<span style="font-size:20px;color:#64748b">/100</span></div>
  <div class="breakdown">
    <div class="breakdown-item"><span>Compliance Completeness</span><span>${r.scoreBreakdown.complianceCompleteness}%</span></div>
    <div class="breakdown-item"><span>Capability Match</span><span>${r.scoreBreakdown.capabilityMatch}%</span></div>
    <div class="breakdown-item"><span>Requirement Clarity</span><span>${r.scoreBreakdown.requirementClarity}%</span></div>
    <div class="breakdown-item"><span>Historical Patterns</span><span>${r.scoreBreakdown.historicalPatterns === 0 ? 'N/A' : r.scoreBreakdown.historicalPatterns + '%'}</span></div>
  </div>
</div>

<h2>Bid/No-Bid Recommendation</h2>
<div class="verdict" style="border-color:${r.bidRecommendation.verdict === "BID" ? "#16a34a" : r.bidRecommendation.verdict === "NO-BID" ? "#dc2626" : "#f59e0b"}">
  <span class="verdict-badge" style="background:${r.bidRecommendation.verdict === "BID" ? "#16a34a" : r.bidRecommendation.verdict === "NO-BID" ? "#dc2626" : "#f59e0b"}">${r.bidRecommendation.verdict}</span>
  <p style="font-size:13px;color:#64748b">Confidence: ${Math.min(100, Math.round(r.bidRecommendation.confidence))}%</p>
  <p style="margin-top:8px;font-size:13px">${r.bidRecommendation.reasoning}</p>
</div>
${r.bidRecommendation.actionItems?.length ? `<h3 style="margin-top:12px;font-size:14px;font-weight:600">Required Actions</h3><ul class="rec-list">${r.bidRecommendation.actionItems.map((a: string) => `<li>${a}</li>`).join("")}</ul>` : ""}

<h2>Compliance Score: ${overallCompliance}/100</h2>
${r.complianceCategories.length ? `<div class="breakdown">${r.complianceCategories.map((c: { name: string; score: number }) => `<div class="breakdown-item"><span>${c.name}</span><span>${c.score}%</span></div>`).join("")}</div>` : "<p style='color:#64748b;font-size:13px'>No compliance categories available.</p>"}

${r.complianceChecklist.length ? `<h2>Detailed Compliance Checklist</h2><table class="checklist"><thead><tr><th>Status</th><th>Item</th></tr></thead><tbody>${r.complianceChecklist.map((c: { item: string; status: string }) => `<tr><td>${statusIcon(c.status)}</td><td>${c.item}</td></tr>`).join("")}</tbody></table>` : ""}

${r.risks.length ? `<h2>Risk Details</h2>${r.risks.map((risk: { level: string; title: string; description: string }) => `<div class="risk-item" style="border-left-color:${riskColor(risk.level)}"><div class="risk-title">${risk.level}: ${risk.title}</div><div class="risk-desc">${risk.description}</div></div>`).join("")}` : ""}

${r.riskHeatmap.length ? `<h2>Risk Heatmap</h2><table class="req-table"><thead><tr><th>Category</th><th>Risk Level</th></tr></thead><tbody>${r.riskHeatmap.map((h: { category: string; level: string }) => `<tr><td>${h.category}</td><td style="color:${h.level === 'Critical' ? '#dc2626' : h.level === 'High' ? '#f59e0b' : h.level === 'Medium' ? '#f59e0b' : '#16a34a'};font-weight:600">${h.level}</td></tr>`).join("")}</tbody></table>` : ""}

${r.requirements.length ? `<h2>Extracted Requirements (${r.requirements.length})</h2><table class="req-table"><thead><tr><th>Section</th><th>Requirement</th><th>Priority</th><th>Status</th></tr></thead><tbody>${r.requirements.slice(0, 50).map((req: { section: string; text: string; priority: string; status: string }) => `<tr><td>${req.section}</td><td style="white-space:normal;max-width:400px">${req.text}</td><td>${req.priority}</td><td>${req.status === 'Missing' ? 'Action Required' : req.status}</td></tr>`).join("")}${r.requirements.length > 50 ? `<tr><td colspan="4" style="text-align:center;color:#64748b">... and ${r.requirements.length - 50} more requirements</td></tr>` : ""}</tbody></table>` : ""}

${r.recommendations.length ? `<h2>Recommended Next Steps</h2><ol class="rec-list">${r.recommendations.map((rec: string) => `<li>${rec}</li>`).join("")}</ol>` : ""}

<div class="footer">BidRank.pro — AI-Powered RFP Analysis | This report is auto-generated and should be reviewed by qualified personnel.</div>
<div class="print-footer">BidRank RFP Analysis Report — bidrank.pro</div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.print();
    };
  }
}

/* ── Helper: Verdict config ────────────────── */
function getVerdictConfig(verdict: ApiResult["bidRecommendation"]["verdict"]) {
  switch (verdict) {
    case "BID":
      return {
        label: "BID",
        icon: ThumbsUp,
        border: "border-br-success",
        bg: "bg-br-success/5",
        accent: "text-br-success",
        badgeBg: "bg-br-success text-white",
      };
    case "NO-BID":
      return {
        label: "NO-BID",
        icon: ThumbsDown,
        border: "border-br-error",
        bg: "bg-br-error/5",
        accent: "text-br-error",
        badgeBg: "bg-br-error text-white",
      };
    case "CONDITIONAL":
      return {
        label: "CONDITIONAL",
        icon: HelpCircle,
        border: "border-br-warning",
        bg: "bg-br-warning/5",
        accent: "text-br-warning",
        badgeBg: "bg-br-warning text-white",
      };
    case "NEEDS REVIEW":
      return {
        label: "NEEDS REVIEW",
        icon: Eye,
        border: "border-br-primary",
        bg: "bg-br-primary/5",
        accent: "text-br-text-secondary",
        badgeBg: "bg-br-primary text-white",
      };
  }
}

/* ── Helper: Priority badge ────────────────── */
function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, string> = {
    Critical: "bg-br-error/10 text-br-error border-br-error/30",
    Important: "bg-br-warning/10 text-br-warning border-br-warning/30",
    "Nice-to-Have": "bg-br-success/10 text-br-success border-br-success/30",
  };
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config[priority] ?? ""}`}>
      {priority}
    </Badge>
  );
}

/* ── Helper: Status badge ──────────────────── */
function StatusBadge({ status }: { status: string }) {
  const label: Record<string, string> = {
    Met: "Met",
    Partial: "Partial",
    Missing: "Action Required",
  };
  const config: Record<string, string> = {
    Met: "bg-br-success/10 text-br-success border-br-success/30",
    Partial: "bg-br-warning/10 text-br-warning border-br-warning/30",
    Missing: "bg-br-error/10 text-br-error border-br-error/30",
  };
  return (
    <Badge variant="outline" className={`text-xs font-medium ${config[status] ?? ""}`}>
      {label[status] ?? status}
    </Badge>
  );
}

export default function AnalyzerPage() {
  const { data: session } = useSession();
  const isSignedIn = !!session?.user;
  const userPlan = useUserPlan();
  const [state, setState] = useState<AnalyzerState>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [reqFilter, setReqFilter] = useState<string>("All");
  const [reqSortKey, setReqSortKey] = useState<"id" | "priority" | "status">("id");
  const [reqSortDir, setReqSortDir] = useState<"asc" | "desc">("asc");
  const [expandedRisks, setExpandedRisks] = useState<Set<number>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Upgrade prompt state ──
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [upgradeTrigger, setUpgradeTrigger] = useState<"analysis_limit" | "export" | "team" | "file_size">("analysis_limit");

  // ── First upload celebration ──
  const [showCelebration, setShowCelebration] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const analysisCountRef = useRef(0);

  // Merge API response with safe defaults for fields the legacy API may omit
  const _raw = apiResult ?? MOCK_RESULT;
  const result: ApiResult = {
    executiveSummary: _raw.executiveSummary ?? "",
    readinessScore: _raw.readinessScore ?? 0,
    scoreBreakdown: _raw.scoreBreakdown ?? { complianceCompleteness: 0, capabilityMatch: 0, requirementClarity: 0, historicalPatterns: 0 },
    keyMetrics: _raw.keyMetrics ?? { contractValue: null, submissionDeadline: null, agency: null, naicsCode: null, naicsDescription: null, setAsideType: null },
    complianceChecklist: _raw.complianceChecklist ?? [],
    complianceCategories: _raw.complianceCategories ?? [],
    risks: _raw.risks ?? [],
    riskHeatmap: _raw.riskHeatmap ?? [],
    bidRecommendation: _raw.bidRecommendation ?? { verdict: "NEEDS REVIEW", confidence: 0, reasoning: "", actionItems: [] },
    requirements: _raw.requirements ?? [],
    recommendations: _raw.recommendations ?? [],
  };

  const handleAnalyze = useCallback(async () => {
    if (!file && !text.trim()) return;

    // ── Trigger 4: File size check (before upload) ──
    if (file && userPlan.limits && file.size > userPlan.limits.maxFileSizeKB * 1024) {
      setUpgradeTrigger("file_size");
      setUpgradeOpen(true);
      return;
    }

    // ── Trigger 1: Analysis limit check ──
    if (userPlan.hasReachedLimit) {
      setUpgradeTrigger("analysis_limit");
      setUpgradeOpen(true);
      return;
    }

    analytics.analysisStarted();
    setState("processing");
    setCurrentStep(0);
    setProgress(0);
    setApiResult(null);
    setIsLive(false);

    // Start the step animation
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= processingSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        setProgress(((prev + 1) / processingSteps.length) * 100);
        return prev + 1;
      });
    }, 700);

    try {
      let res: Response;

      if (file) {
        // Upload file via FormData so the API can read its contents
        const formData = new FormData();
        formData.append("file", file);
        if (text.trim()) {
          formData.append("text", text.trim());
        }
        res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
      } else {
        // Send text as JSON
        res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: text.trim(),
          }),
        });
      }

      clearInterval(stepInterval);
      setProgress(100);
      setCurrentStep(processingSteps.length - 1);

      if (res.ok) {
        const data = await res.json();
        setApiResult(data);
        setIsLive(true);
        analysisCountRef.current += 1;
        userPlan.refetch();
        analytics.analysisCompleted(data.readinessScore);

        // ── First upload celebration ──
        if (isSignedIn && analysisCountRef.current === 1) {
          setTimeout(() => setShowCelebration(true), 800);
        }
      } else {
        const err = await res.json().catch(() => ({ error: "Analysis failed" }));
        console.warn("[Analyzer] API error:", err.error);
        // If 401, the user needs to sign in
        if (res.status === 401) {
          window.location.href = "/sign-in?redirect_url=%2F%23analyze";
          return;
        }
        // If 429, show upgrade prompt
        if (res.status === 429) {
          setUpgradeTrigger("analysis_limit");
          setUpgradeOpen(true);
          setState("upload");
          return;
        }
      }
    } catch {
      console.warn("[Analyzer] API unreachable, using mock data");
    }

    // Small delay for visual polish before showing results
    setTimeout(() => setState("results"), 500);
  }, [file, text, userPlan, isSignedIn]);

  useEffect(() => {
    return () => {}; // No separate timer — animation is now inside handleAnalyze
  }, [state]);

  const resetAnalyzer = () => {
    setState("upload");
    setFile(null);
    setText("");
    setCurrentStep(0);
    setProgress(0);
    setApiResult(null);
    setIsLive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const score = result.readinessScore;
  const scoreLabel = score >= 70 ? "Ready to Pursue" : score >= 40 ? "Needs Work" : "Not Ready";
  const scoreColor = score >= 70 ? "text-br-success" : score >= 40 ? "text-br-warning" : "text-br-error";
  const scoreBg = score >= 70 ? "bg-br-success/10 border-br-success/30" : score >= 40 ? "bg-br-warning/10 border-br-warning/30" : "bg-br-error/10 border-br-error/30";

  /* ── Requirement table helpers ───────────── */
  const sectionLabel = (s: string) => {
    const map: Record<string, string> = { C: "Contract", L: "Section L", M: "Section M", H: "Section H" };
    return map[s] ?? s;
  };

  const priorityOrder: Record<string, number> = { Critical: 0, Important: 1, "Nice-to-Have": 2 };
  const statusOrder: Record<string, number> = { Missing: 0, Partial: 1, Met: 2 };

  const filteredReqs = result.requirements
    .filter((r) => {
      if (reqFilter === "All") return true;
      if (reqFilter === "Must") return r.priority === "Critical";
      if (reqFilter === "Should") return r.priority === "Important";
      if (reqFilter === "May") return r.priority === "Nice-to-Have";
      return true;
    })
    .sort((a, b) => {
      const dir = reqSortDir === "asc" ? 1 : -1;
      if (reqSortKey === "id") return a.id.localeCompare(b.id) * dir;
      if (reqSortKey === "priority") return (priorityOrder[a.priority] - priorityOrder[b.priority]) * dir;
      return (statusOrder[a.status] - statusOrder[b.status]) * dir;
    });

  const handleReqSort = (key: "id" | "priority" | "status") => {
    if (reqSortKey === key) {
      setReqSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setReqSortKey(key);
      setReqSortDir("asc");
    }
  };

  const toggleRisk = (idx: number) => {
    setExpandedRisks((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  /* ── Heatmap severity columns ────────────── */
  const severityLevels = ["Critical", "High", "Medium", "Low"] as const;

  /* ── PROCESSING STATE ──────────────────────── */
  if (state === "processing") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-lg p-8 text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-br-primary/10 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-br-primary animate-pulse" />
            </div>
            <CardTitle className="text-2xl text-br-primary">Analyzing Your RFP...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="h-2" />
            <div className="space-y-3 text-left">
              {processingSteps.map((step, i) => (
                <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= currentStep ? "opacity-100" : "opacity-30"}`}>
                  {i < currentStep ? (
                    <CheckCircle2 className="w-5 h-5 text-br-success shrink-0" />
                  ) : i === currentStep ? (
                    <div className="w-5 h-5 shrink-0 border-2 border-br-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-5 h-5 shrink-0 rounded-full border-2 border-br-border" />
                  )}
                  <span className={i <= currentStep ? "text-br-dark font-medium" : "text-br-text-secondary"}>{step}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-br-text-secondary">Expected time: 30 seconds – 3 minutes</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* ── RESULTS STATE ─────────────────────────── */
  if (state === "results") {
    const verdictCfg = getVerdictConfig(result.bidRecommendation.verdict);
    const VerdictIcon = verdictCfg.icon;
    const overallComplianceScore = result.complianceCategories.length
      ? Math.round(
          result.complianceCategories.reduce((sum, c) => sum + c.score, 0) /
            result.complianceCategories.length
        )
      : 0;

    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* ── Analysis limit banner ── */}
        {userPlan.authenticated && userPlan.hasReachedLimit && (
          <UpgradeBanner trigger="analysis_limit" />
        )}

        <div className="text-center">
          <h1 className="text-3xl font-bold font-heading text-br-primary mb-2">RFP Analysis Complete</h1>
          <p className="text-br-text-secondary">Review your AI-generated analysis below</p>
          {!isLive && (
            <p className="text-xs text-br-warning mt-1 flex items-center justify-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Showing sample data — connect Gemini API for live analysis
            </p>
          )}

          {/* Social sharing */}
          <div className="mt-4 flex justify-center">
            <SocialShareButtons
              data={{
                analysisId: "mock-analysis-id",
                fileName: file?.name || "Pasted RFP Text",
                readinessScore: result.readinessScore,
                agency: result.keyMetrics.agency,
                verdict: result.bidRecommendation.verdict,
              }}
            />
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-br-warning/5 border border-br-warning/30 rounded-lg p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-br-warning shrink-0 mt-0.5" />
          <p className="text-sm text-br-dark">
            The Bid Readiness Score and analysis are AI-generated indicators based on RFP text and self-reported business profile. They are not a prediction of contract award and should not be the sole basis for any bid/no-bid decision.
          </p>
        </div>

        {/* Executive Summary */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Info className="w-5 h-5 text-br-secondary" />Executive Summary</CardTitle></CardHeader>
          <CardContent><p className="text-sm text-br-dark leading-relaxed">{result.executiveSummary}</p></CardContent>
        </Card>

        {/* Bid Readiness Score */}
        <Card className={`${scoreBg} border`}>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Target className="w-5 h-5 text-br-primary" />Bid Readiness Score</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#E2E8F0" strokeWidth="10" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={score >= 70 ? "#0D9488" : score >= 40 ? "#F59E0B" : "#EF4444"} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(score / 100) * 327} 327`} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-bold font-mono-data ${scoreColor}`}>{score}</span>
                  <span className="text-xs text-br-text-secondary">/ 100</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <span className={`text-lg font-semibold ${scoreColor}`}>{scoreLabel}</span>
                  <p className="text-xs text-br-text-secondary mt-1 flex items-start gap-1">
                    <AlertCircle className="w-3 h-3 mt-0.5 shrink-0" />
                    This is an AI-generated indicator of how prepared your submission appears. It is not a prediction of whether you will win.
                  </p>
                </div>
                <div className="space-y-2">
                  {Object.entries(result.scoreBreakdown).map(([key, val]) => {
                    const isHistorical = key === 'historicalPatterns';
                    const displayVal = isHistorical && val === 0 ? null : val;
                    return (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-br-text-secondary w-40 shrink-0 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                      <div className="flex-1 h-2 bg-br-light rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${isHistorical && val === 0 ? 'bg-br-border' : 'bg-br-secondary'}`} style={{ width: `${displayVal ?? 50}%` }} />
                      </div>
                      <span className="text-xs font-medium text-br-dark font-mono-data w-12 text-right">
                        {displayVal !== null ? `${displayVal}%` : 'N/A'}
                      </span>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bid/No-Bid Recommendation */}
        <Card className={`border-2 ${verdictCfg.border} ${verdictCfg.bg}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CircleDot className={`w-5 h-5 ${verdictCfg.accent}`} />
              Bid/No-Bid Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Verdict badge + confidence */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg ${verdictCfg.badgeBg}`}>
                <VerdictIcon className="w-5 h-5" />
                <span className="text-lg font-bold tracking-wide">{verdictCfg.label}</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-br-dark">{result.bidRecommendation.confidence}% confidence</p>
                <p className="text-xs text-br-text-secondary">Based on {result.risks.length} risk factors and {result.complianceCategories.length} compliance areas</p>
              </div>
            </div>

            {/* Reasoning */}
            <p className="text-sm text-br-dark leading-relaxed">{result.bidRecommendation.reasoning}</p>

            {/* Action items checklist */}
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-br-dark uppercase tracking-wider">Required Actions Before Bidding</p>
              {result.bidRecommendation.actionItems.map((item, i) => (
                <label key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-br-surface/60 cursor-pointer transition-colors">
                  <Checkbox className="mt-0.5 shrink-0" />
                  <span className="text-sm text-br-dark">{item}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {result.keyMetrics.contractValue && (
            <Card><CardContent className="p-4 text-center"><DollarSign className="w-5 h-5 text-br-secondary mx-auto mb-2" /><p className="text-xs text-br-text-secondary">Contract Value</p><p className="text-sm font-semibold text-br-dark">{result.keyMetrics.contractValue}</p></CardContent></Card>
          )}
          {result.keyMetrics.submissionDeadline && (
            <Card><CardContent className="p-4 text-center"><Calendar className="w-5 h-5 text-br-secondary mx-auto mb-2" /><p className="text-xs text-br-text-secondary">Deadline</p><p className="text-sm font-semibold text-br-dark">{result.keyMetrics.submissionDeadline}</p></CardContent></Card>
          )}
          {result.keyMetrics.agency && (
            <Card><CardContent className="p-4 text-center"><Building2 className="w-5 h-5 text-br-secondary mx-auto mb-2" /><p className="text-xs text-br-text-secondary">Agency</p><p className="text-sm font-semibold text-br-dark">{result.keyMetrics.agency}</p></CardContent></Card>
          )}
          {result.keyMetrics.naicsCode && (
            <Card><CardContent className="p-4 text-center"><Hash className="w-5 h-5 text-br-secondary mx-auto mb-2" /><p className="text-xs text-br-text-secondary">NAICS Code</p><p className="text-sm font-semibold text-br-dark">{result.keyMetrics.naicsCode}</p></CardContent></Card>
          )}
          {result.keyMetrics.setAsideType && (
            <Card className="border-br-accent/50"><CardContent className="p-4 text-center"><Shield className="w-5 h-5 text-br-accent mx-auto mb-2" /><p className="text-xs text-br-text-secondary">Set-Aside Type</p><Badge className="bg-br-accent text-br-primary text-xs font-semibold">{result.keyMetrics.setAsideType}</Badge></CardContent></Card>
          )}
        </div>

        {/* Compliance Score Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks className="w-5 h-5 text-br-secondary" />
              Compliance Score Card
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall compliance circle */}
            <div className="flex flex-col items-center">
              <ComplianceCircle value={overallComplianceScore} size={110} />
              <p className="text-sm font-semibold text-br-dark mt-2">
                Overall Compliance: {overallComplianceScore}%
              </p>
              <p className="text-xs text-br-text-secondary">Average across {result.complianceCategories.length} categories</p>
            </div>

            {/* Category breakdown grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {result.complianceCategories.map((cat) => (
                <div key={cat.name} className="p-3 rounded-lg border border-br-border bg-br-light/50">
                  <CategoryBar name={cat.name} score={cat.score} />
                </div>
              ))}
            </div>

            {/* Detailed checklist */}
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-br-dark uppercase tracking-wider mb-3">Detailed Checklist</p>
              <div className="space-y-3">
                {result.complianceChecklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-br-light">
                    {item.status === "pass" ? (
                      <CheckCircle2 className="w-5 h-5 text-br-success shrink-0 mt-0.5" />
                    ) : item.status === "warn" ? (
                      <AlertTriangle className="w-5 h-5 text-br-warning shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-br-error shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm text-br-dark">{item.item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-br-secondary" />
              Risk Heatmap
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Heatmap grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[500px]">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_repeat(4,72px)] gap-1 mb-1">
                  <div />
                  {severityLevels.map((level) => (
                    <div
                      key={level}
                      className="text-center text-xs font-semibold text-br-dark py-1.5 rounded"
                    >
                      {level}
                    </div>
                  ))}
                </div>
                {/* Category rows */}
                {result.riskHeatmap.map((risk) => (
                  <div key={risk.category} className="grid grid-cols-[1fr_repeat(4,72px)] gap-1 mb-1">
                    <div className="flex items-center text-xs font-medium text-br-dark pr-2 truncate">
                      {risk.category}
                    </div>
                    {severityLevels.map((level) => (
                      <div key={level} className="rounded bg-br-light">
                        {risk.level === level ? <HeatmapDot level={level} /> : <div className="h-9 w-full flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-br-light/50" />
                        </div>}
                      </div>
                    ))}
                  </div>
                ))}
                {/* Legend */}
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <span className="text-xs text-br-text-secondary">Legend:</span>
                  {[
                    { label: "Critical", color: "bg-br-error" },
                    { label: "High", color: "bg-br-warning" },
                    { label: "Medium", color: "bg-br-warning" },
                    { label: "Low", color: "bg-br-success" },
                  ].map(({ label, color }) => (
                    <div key={label} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${color}`} />
                      <span className="text-xs text-br-text-secondary">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Expandable risk details */}
            <div className="border-t pt-4 space-y-2">
              <p className="text-xs font-semibold text-br-dark uppercase tracking-wider mb-3">Risk Details</p>
              {result.risks.map((risk, i) => (
                <Collapsible
                  key={i}
                  open={expandedRisks.has(i)}
                  onOpenChange={() => toggleRisk(i)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-br-border hover:bg-br-light transition-colors">
                      <ChevronDown className={`w-4 h-4 text-br-text-secondary transition-transform ${expandedRisks.has(i) ? "rotate-180" : ""}`} />
                      <Badge
                        variant={risk.level === "High" ? "destructive" : risk.level === "Medium" ? "secondary" : "outline"}
                        className="text-xs shrink-0"
                      >
                        {risk.level}
                      </Badge>
                      <span className="font-semibold text-sm text-br-dark flex-1 text-left">{risk.title}</span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="pl-11 pr-3 pb-3 pt-1">
                      <p className="text-sm text-br-text-secondary leading-relaxed">{risk.description}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Requirement Extractor */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileSpreadsheet className="w-5 h-5 text-br-secondary" />
              Requirement Extractor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {["All", "Must", "Should", "May"].map((f) => (
                  <Button
                    key={f}
                    variant={reqFilter === f ? "default" : "outline"}
                    size="sm"
                    className={`text-xs h-8 ${reqFilter === f ? "bg-br-primary hover:bg-br-primary/90 text-white" : "border-br-border text-br-dark"}`}
                    onClick={() => setReqFilter(f)}
                  >
                    {f === "Must" ? "Must (Critical)" : f === "Should" ? "Should (Important)" : f === "May" ? "May (Nice-to-Have)" : f}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="text-xs h-8 border-br-border text-br-dark">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export to CSV
              </Button>
            </div>

            {/* Table */}
            <div className="max-h-96 overflow-y-auto rounded-lg border border-br-border">
              <Table>
                <TableHeader className="sticky top-0 bg-br-light z-10">
                  <TableRow>
                    <TableHead className="w-20">
                      <button className="flex items-center gap-1 text-xs font-semibold text-br-dark hover:text-br-primary transition-colors" onClick={() => handleReqSort("id")}>
                        ID <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead className="w-20 text-xs">Section</TableHead>
                    <TableHead className="text-xs">Requirement</TableHead>
                    <TableHead className="w-28">
                      <button className="flex items-center gap-1 text-xs font-semibold text-br-dark hover:text-br-primary transition-colors" onClick={() => handleReqSort("priority")}>
                        Priority <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                    <TableHead className="w-24">
                      <button className="flex items-center gap-1 text-xs font-semibold text-br-dark hover:text-br-primary transition-colors" onClick={() => handleReqSort("status")}>
                        Status <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReqs.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="text-xs font-mono text-br-text-secondary">{req.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs font-medium border-br-primary/30 text-br-primary">
                          {sectionLabel(req.section)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-br-dark max-w-xs sm:max-w-md lg:max-w-none whitespace-normal leading-relaxed">{req.text}</TableCell>
                      <TableCell><PriorityBadge priority={req.priority} /></TableCell>
                      <TableCell><StatusBadge status={req.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-br-text-secondary text-right">
              Showing {filteredReqs.length} of {result.requirements.length} requirements
            </p>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lightbulb className="w-5 h-5 text-br-accent" />Recommended Next Steps</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 p-2">
                <div className="w-6 h-6 rounded-full bg-br-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ArrowRight className="w-3.5 h-3.5 text-br-accent" />
                </div>
                <p className="text-sm text-br-dark leading-relaxed">{rec}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 py-4">
          <Button
            variant="outline"
            className="border-br-primary text-br-primary"
            onClick={() => {
              if (userPlan.isFree) {
                setUpgradeTrigger("export");
                setUpgradeOpen(true);
                return;
              }
              analytics.analysisExported("pdf");
              exportToPdf(result);
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Report (PDF)
            {userPlan.isFree && <Badge variant="secondary" className="ml-2 text-xs">Starter+</Badge>}
          </Button>
          <Button onClick={resetAnalyzer} className="bg-br-accent hover:bg-br-accent/90 text-br-primary">
            <RotateCcw className="w-4 h-4 mr-2" />Analyze Another RFP
          </Button>
        </div>

        {/* ── Upgrade Dialog ── */}
        <UpgradePrompt
          open={upgradeOpen}
          onOpenChange={setUpgradeOpen}
          trigger={upgradeTrigger}
        />

        {/* ── First Upload Celebration ── */}
        <FirstUploadCelebration
          open={showCelebration}
          onClose={() => setShowCelebration(false)}
          score={result.readinessScore}
          onAnalyzeAnother={() => {
            setShowCelebration(false);
            resetAnalyzer();
          }}
          onTourStart={() => {
            setShowCelebration(false);
            setTourStep(0);
            setShowTour(true);
          }}
        />

        {/* ── Tour Overlay ── */}
        <TourOverlay
          open={showTour}
          onClose={() => setShowTour(false)}
          step={tourStep}
          setStep={setTourStep}
        />

        <div className="border-t pt-4 pb-2">
          <p className="text-xs text-br-text-secondary text-center">
            The Bid Readiness Score and analysis are AI-generated indicators based on RFP text and self-reported business profile. They are not a prediction of contract award and should not be the sole basis for any bid/no-bid decision.
          </p>
        </div>
      </div>
    );
  }

  /* ── UPLOAD STATE ──────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* ── Limit reached banner ── */}
      {userPlan.authenticated && userPlan.hasReachedLimit && (
        <UpgradeBanner trigger="analysis_limit" />
      )}

      <div className="bg-br-primary rounded-xl p-8 mb-8 text-center">
        <FileUp className="w-12 h-12 text-br-accent mx-auto mb-4" />
        <h1 className="text-3xl font-bold font-heading text-white mb-2">Upload Your RFP</h1>
        <p className="text-br-text-secondary">Get an AI analysis in minutes. PDF, Word, or Excel.</p>
        {userPlan.authenticated && userPlan.limits && (
          <p className="text-br-text-secondary text-sm mt-2">
            {userPlan.analysesThisMonth} of {userPlan.limits.maxAnalysesPerMonth} analyses used this month
          </p>
        )}
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer mb-4 ${dragOver ? "border-br-primary bg-br-primary/5" : "border-br-border bg-br-light hover:border-br-primary/50"}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.xlsx,.csv" aria-label="Upload RFP document" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? "text-br-primary" : "text-br-text-secondary"}`} />
        <p className="text-br-primary font-medium mb-1">Drag &amp; drop your RFP here</p>
        <p className="text-sm text-br-text-secondary mb-4">or</p>
        <Button variant="outline" className="border-br-primary text-br-primary">Browse Files</Button>
        <p className="text-xs text-br-text-secondary mt-4">PDF, DOCX, XLSX, CSV — Max 50 MB</p>
        {file && (
          <div className="mt-4 inline-flex items-center gap-2 bg-br-surface rounded-lg px-4 py-2 shadow-sm">
            <FileText className="w-4 h-4 text-br-secondary" />
            <span className="text-sm font-medium text-br-dark">{file.name}</span>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-br-text-secondary hover:text-br-error">
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 border-t" />
        <span className="text-sm text-br-text-secondary">or paste RFP text below</span>
        <div className="flex-1 border-t" />
      </div>

      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste the full text of your RFP here..." aria-label="RFP text content" className="min-h-[150px] resize-y mb-2" />
      <div className="text-right">
        <span className="text-xs text-br-text-secondary">{text.length.toLocaleString()} characters</span>
      </div>

      {!file && !text.trim() && (
        <p className="text-xs text-br-error mt-2 text-center">Please upload a file or paste RFP text to continue.</p>
      )}

      <div className="text-center mt-8">
        <Button size="lg" onClick={handleAnalyze} disabled={!file && !text.trim()} className="bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold text-base px-10 py-6">
          Analyze RFP <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <Clock className="w-4 h-4 text-br-text-secondary" />
        <p className="text-xs text-br-text-secondary">Free trial: 3 analyses | Basic: 5/month | Pro: 20/month | Enterprise: Unlimited</p>
      </div>
    </div>
  );
}