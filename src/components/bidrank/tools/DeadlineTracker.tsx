"use client";

import { useState, useMemo, useRef, useCallback } from "react";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Calendar,
  Upload,
  Plus,
  Trash2,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  List,
  LayoutGrid,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CalendarPlus,
} from "lucide-react";

type DeadlineType = "Submission" | "Pre-proposal Conference" | "Questions Due" | "Final Revision";
type DeadlineStatus = "upcoming" | "this-week" | "overdue" | "completed";

interface DeadlineEntry {
  id: string;
  name: string;
  date: string;
  type: DeadlineType;
  rfpReference: string;
  status: DeadlineStatus;
}

const DEADLINE_TYPES: DeadlineType[] = [
  "Submission",
  "Pre-proposal Conference",
  "Questions Due",
  "Final Revision",
];

const MOCK_DEADLINES: DeadlineEntry[] = [
  {
    id: "d1",
    name: "Final Proposal Submission",
    date: "2026-07-18",
    type: "Submission",
    rfpReference: "SOL-2026-12345 — DHS IT Managed Services",
    status: "this-week",
  },
  {
    id: "d2",
    name: "Pre-proposal Conference",
    date: "2026-07-14",
    type: "Pre-proposal Conference",
    rfpReference: "SOL-2026-12345 — DHS IT Managed Services",
    status: "completed",
  },
  {
    id: "d3",
    name: "Questions Due",
    date: "2026-07-25",
    type: "Questions Due",
    rfpReference: "SOL-2026-23456 — VA Cloud Modernization",
    status: "upcoming",
  },
  {
    id: "d4",
    name: "Final Revision Deadline",
    date: "2026-07-08",
    type: "Final Revision",
    rfpReference: "SOL-2026-34567 — DoD Cybersecurity Operations",
    status: "overdue",
  },
  {
    id: "d5",
    name: "Proposal Submission",
    date: "2026-08-15",
    type: "Submission",
    rfpReference: "SOL-2026-23456 — VA Cloud Modernization",
    status: "upcoming",
  },
];

function getStatusConfig(status: DeadlineStatus) {
  switch (status) {
    case "upcoming":
      return {
        label: "Upcoming",
        color: "text-br-success bg-br-success/10 border-br-success/20",
        dotColor: "bg-br-success",
      };
    case "this-week":
      return {
        label: "This Week",
        color: "text-br-warning bg-br-warning/10 border-br-warning/20",
        dotColor: "bg-br-warning",
      };
    case "overdue":
      return {
        label: "Overdue",
        color: "text-br-error bg-br-error/10 border-br-error/20",
        dotColor: "bg-br-error",
      };
    case "completed":
      return {
        label: "Completed",
        color: "text-br-text-secondary bg-br-light border-br-border",
        dotColor: "bg-br-light",
      };
  }
}

function getTypeIcon(type: DeadlineType) {
  switch (type) {
    case "Submission":
      return <Calendar className="h-4 w-4" />;
    case "Pre-proposal Conference":
      return <LayoutGrid className="h-4 w-4" />;
    case "Questions Due":
      return <AlertTriangle className="h-4 w-4" />;
    case "Final Revision":
      return <FileText className="h-4 w-4" />;
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + "T00:00:00");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function buildGoogleCalendarUrl(deadline: DeadlineEntry) {
  const date = deadline.date.replace(/-/g, "");
  const [year, month, day] = dateStrToParts(deadline.date);
  const end = `${year}${month}${String(Number(day) + 1).padStart(2, "0")}`;
  const text = encodeURIComponent(deadline.name);
  const details = encodeURIComponent(
    `RFP: ${deadline.rfpReference}\nType: ${deadline.type}`
  );
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${date}/${end}&details=${details}`;
}

function dateStrToParts(dateStr: string): [string, string, string] {
  const [y, m, d] = dateStr.split("-");
  return [y, m, d];
}

export default function DeadlineTracker() {
  const [deadlines, setDeadlines] = useState<DeadlineEntry[]>(MOCK_DEADLINES);
  const [showForm, setShowForm] = useState(false);
  const [rfpDrag, setRfpDrag] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("list");

  // Form state
  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formType, setFormType] = useState<DeadlineType | "">("");
  const [formRfp, setFormRfp] = useState("");

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setRfpDrag(false);
    // Simulate extracting deadlines from a file
    setTimeout(() => {
      setShowForm(true);
      setFormName("Auto-extracted: Proposal Submission");
      setFormDate("2026-08-20");
      setFormType("Submission");
      setFormRfp("SOL-2026-45678 — GSA IT Operations");
    }, 800);
  }, []);

  const handleAddDeadline = () => {
    if (!formName || !formDate || !formType) return;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(formDate + "T00:00:00");
    const diffDays = Math.ceil(
      (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    let status: DeadlineStatus = "upcoming";
    if (diffDays < 0) status = "overdue";
    else if (diffDays <= 7) status = "this-week";

    const newEntry: DeadlineEntry = {
      id: crypto.randomUUID(),
      name: formName,
      date: formDate,
      type: formType,
      rfpReference: formRfp,
      status,
    };
    setDeadlines((prev) => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
    setFormName("");
    setFormDate("");
    setFormType("");
    setFormRfp("");
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setDeadlines((prev) => prev.filter((d) => d.id !== id));
  };

  const handleMarkComplete = (id: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "completed" as const } : d))
    );
  };

  // Group deadlines by month for timeline
  const timelineGroups = useMemo(() => {
    const groups: Record<string, DeadlineEntry[]> = {};
    const sorted = [...deadlines].sort((a, b) => a.date.localeCompare(b.date));
    for (const d of sorted) {
      const month = new Date(d.date + "T00:00:00").toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!groups[month]) groups[month] = [];
      groups[month].push(d);
    }
    return groups;
  }, [deadlines]);

  // Sorted for list view
  const sortedDeadlines = useMemo(
    () => [...deadlines].sort((a, b) => a.date.localeCompare(b.date)),
    [deadlines]
  );

  const stats = useMemo(() => {
    return {
      total: deadlines.length,
      upcoming: deadlines.filter((d) => d.status === "upcoming").length,
      thisWeek: deadlines.filter((d) => d.status === "this-week").length,
      overdue: deadlines.filter((d) => d.status === "overdue").length,
      completed: deadlines.filter((d) => d.status === "completed").length,
    };
  }, [deadlines]);

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
              <BreadcrumbPage>RFP Deadline Tracker</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold font-heading text-br-primary">
                RFP Deadline Tracker
              </h1>
              <Badge className="bg-br-accent text-br-dark hover:bg-br-accent/90">
                Pro+
              </Badge>
            </div>
            <p className="text-br-text-secondary">
              Never miss an RFP deadline. Upload documents to auto-extract dates
              or track them manually.
            </p>
          </div>
          <Button
            className="bg-br-primary hover:bg-br-secondary text-white shrink-0"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? (
              <ChevronUp className="mr-2 h-4 w-4" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add Deadline
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-5 mb-6">
          {[
            { label: "Total", value: stats.total, color: "text-br-primary" },
            { label: "Upcoming", value: stats.upcoming, color: "text-br-success" },
            { label: "This Week", value: stats.thisWeek, color: "text-br-warning" },
            { label: "Overdue", value: stats.overdue, color: "text-br-error" },
            { label: "Completed", value: stats.completed, color: "text-br-text-secondary" },
          ].map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4 text-center">
                <p className={`text-2xl font-bold font-mono-data ${s.color}`}>{s.value}</p>
                <p className="text-xs text-br-text-secondary">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Zone for RFP */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div
              className={`flex flex-col sm:flex-row items-center gap-4 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer ${
                rfpDrag
                  ? "border-br-primary bg-br-primary/5"
                  : "border-br-border hover:border-br-secondary hover:bg-br-light"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setRfpDrag(true);
              }}
              onDragLeave={() => setRfpDrag(false)}
              onDrop={handleDrop}
              onClick={() => {
                fileInputRef.current?.click();
                setTimeout(() => {
                  setShowForm(true);
                  setFormName("Auto-extracted: Proposal Submission");
                  setFormDate("2026-08-20");
                  setFormType("Submission");
                  setFormRfp("SOL-2026-45678 — GSA IT Operations");
                }, 300);
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
              />
              <Upload className="h-8 w-8 text-br-text-secondary shrink-0" />
              <div className="text-center sm:text-left">
                <p className="text-sm font-medium text-br-dark">
                  Upload an RFP to auto-extract deadlines
                </p>
                <p className="text-xs text-br-text-secondary">
                  Drag & drop a PDF/DOCX file or click to browse
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Entry Form */}
        {showForm && (
          <Card className="mb-6 border-br-primary/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <CalendarPlus className="h-5 w-5 text-br-secondary" />
                {formName.startsWith("Auto-extracted")
                  ? "Extracted Deadline"
                  : "Add Deadline Manually"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="deadline-name">Deadline Name</Label>
                  <Input
                    id="deadline-name"
                    placeholder="e.g., Final Proposal Submission"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline-date">Date</Label>
                  <Input
                    id="deadline-date"
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formType}
                    onValueChange={(v) => setFormType(v as DeadlineType)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select deadline type" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEADLINE_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline-rfp">RFP Reference</Label>
                  <Input
                    id="deadline-rfp"
                    placeholder="e.g., SOL-2026-12345 — DHS IT Services"
                    value={formRfp}
                    onChange={(e) => setFormRfp(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormName("");
                    setFormDate("");
                    setFormType("");
                    setFormRfp("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-br-primary hover:bg-br-secondary text-white"
                  onClick={handleAddDeadline}
                  disabled={!formName || !formDate || !formType}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Deadline
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deadline List / Timeline */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Clock className="h-5 w-5 text-br-secondary" />
                  Your Deadlines
                </CardTitle>
                <CardDescription>
                  {deadlines.length} deadlines tracked
                </CardDescription>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="list" className="text-xs sm:text-sm">
                    <List className="mr-1.5 h-4 w-4 hidden sm:inline" />
                    List
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="text-xs sm:text-sm">
                    <Calendar className="mr-1.5 h-4 w-4 hidden sm:inline" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {/* List View */}
            {activeTab === "list" && (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {sortedDeadlines.length === 0 ? (
                  <div className="text-center py-8 text-br-text-secondary">
                    <Calendar className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No deadlines yet. Add one above.</p>
                  </div>
                ) : (
                  sortedDeadlines.map((deadline) => {
                    const statusCfg = getStatusConfig(deadline.status);
                    const daysUntil = getDaysUntil(deadline.date);
                    return (
                      <div
                        key={deadline.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-lg border p-4 hover:bg-br-light transition-colors group"
                      >
                        {/* Status dot */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div
                            className={`h-3 w-3 rounded-full ${statusCfg.dotColor} shrink-0`}
                          />
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-br-primary/10 text-br-primary">
                            {getTypeIcon(deadline.type)}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p
                              className={`text-sm font-semibold ${
                                deadline.status === "completed"
                                  ? "text-br-text-secondary line-through"
                                  : "text-br-primary"
                              }`}
                            >
                              {deadline.name}
                            </p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${statusCfg.color}`}
                            >
                              {statusCfg.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-br-text-secondary truncate">
                            {deadline.rfpReference}
                          </p>
                        </div>

                        {/* Date + Actions */}
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <p className="text-sm font-medium text-br-dark">
                              {formatDate(deadline.date)}
                            </p>
                            {deadline.status !== "completed" && (
                              <p
                                className={`text-xs ${
                                  daysUntil < 0
                                    ? "text-br-error font-medium"
                                    : daysUntil <= 7
                                    ? "text-br-warning"
                                    : "text-br-text-secondary"
                                }`}
                              >
                                {daysUntil < 0
                                  ? `${Math.abs(daysUntil)} days overdue`
                                  : daysUntil === 0
                                  ? "Today"
                                  : daysUntil === 1
                                  ? "Tomorrow"
                                  : `${daysUntil} days away`}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {deadline.status !== "completed" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-br-success hover:text-br-success hover:bg-br-success/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleMarkComplete(deadline.id)}
                                title="Mark Complete"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                            {deadline.status === "overdue" && (
                              <span className="text-br-error">
                                <XCircle className="h-4 w-4" />
                              </span>
                            )}
                            {deadline.status === "completed" && (
                              <span className="text-br-text-secondary">
                                <CheckCircle2 className="h-4 w-4" />
                              </span>
                            )}
                            {deadline.status !== "overdue" &&
                              deadline.status !== "completed" && (
                                <a
                                  href={buildGoogleCalendarUrl(deadline)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-br-secondary hover:bg-br-light opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Add to Google Calendar"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-br-error hover:text-br-error hover:bg-br-error/5 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleDelete(deadline.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Timeline View */}
            {activeTab === "timeline" && (
              <div className="space-y-8 max-h-[500px] overflow-y-auto pr-2">
                {Object.keys(timelineGroups).length === 0 ? (
                  <div className="text-center py-8 text-br-text-secondary">
                    <Calendar className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">No deadlines yet. Add one above.</p>
                  </div>
                ) : (
                  Object.entries(timelineGroups).map(([month, items]) => (
                    <div key={month}>
                      <h3 className="text-sm font-bold font-heading text-br-primary mb-3 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {month}
                      </h3>
                      <div className="relative ml-3 border-l-2 border-br-border pl-6 space-y-4">
                        {items.map((deadline) => {
                          const statusCfg = getStatusConfig(deadline.status);
                          return (
                            <div key={deadline.id} className="relative">
                              {/* Timeline dot */}
                              <div
                                className={`absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-br-surface ${statusCfg.dotColor}`}
                              />
                              <div className="rounded-lg border p-4 hover:bg-br-light transition-colors group">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <span className="text-sm font-semibold text-br-primary">
                                        {deadline.name}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${statusCfg.color}`}
                                      >
                                        {statusCfg.label}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {deadline.type}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-br-text-secondary">
                                      {deadline.rfpReference}
                                    </p>
                                    <p className="text-xs text-br-text-secondary mt-1">
                                      {formatDate(deadline.date)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {deadline.status !== "completed" &&
                                      deadline.status !== "overdue" && (
                                        <a
                                          href={buildGoogleCalendarUrl(deadline)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-br-secondary hover:bg-br-light opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                          Google Cal
                                        </a>
                                      )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-br-error hover:text-br-error hover:bg-br-error/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => handleDelete(deadline.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}