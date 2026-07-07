"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users, FileText, UserCheck, AlertTriangle, Sparkles,
  Upload, CheckCircle, ArrowRight, ShieldCheck,
  BarChart3, Bell, LayoutDashboard, Lock, CreditCard, RefreshCw,
  Zap, Target, GraduationCap, HeartHandshake,
  Timer, MessageCircle, Trophy, Quote, Search
} from "lucide-react";
import { NewsletterSubscribe } from "@/components/bidrank/newsletter/NewsletterSubscribe";
import { analytics } from "@/lib/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const uspItems = [
  { icon: Zap, label: "Speed", text: "Upload to insights in under 3 minutes" },
  { icon: Target, label: "Simplicity", text: "One upload. One dashboard. Zero training." },
  { icon: GraduationCap, label: "Specialization", text: "AI trained on federal contracting data" },
  { icon: HeartHandshake, label: "Support", text: "Real humans who've won federal contracts" },
];

const avatarColors = [
  "bg-br-primary",
  "bg-br-secondary",
  "bg-br-accent",
  "bg-br-success",
  "bg-br-warning",
];

function Phase2Section() {
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim()) return;
    setWaitlistStatus("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: waitlistEmail.trim(), source: "phase2_waitlist" }),
      });
      if (res.ok) {
        setWaitlistStatus("sent");
        setWaitlistEmail("");
      } else {
        setWaitlistStatus("error");
      }
    } catch {
      setWaitlistStatus("error");
    }
  };

  return (
    <section className="bg-br-light">
      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="rounded-2xl border border-br-secondary/30 bg-br-surface p-8 shadow-br-sm md:p-12">
          <div className="flex flex-col items-center text-center">
            <Badge className="bg-br-secondary/20 text-br-dark border-br-secondary/40 text-xs mb-4">
              Launching Q3 2026
            </Badge>
            <h2 className="font-heading text-2xl font-bold text-br-dark md:text-3xl">
              Phase 2: Intelligent Opportunity Matching
            </h2>
            <p className="mt-3 max-w-xl text-br-text-secondary">
              We're building the next layer of BidRank — proactive opportunity discovery,
              teaming partner matching, and win rate analytics.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 w-full sm:grid-cols-3">
              {[
                {
                  icon: Bell,
                  title: "Opportunity Alerts",
                  desc: "Daily digest of SAM.gov opportunities matched to your NAICS codes, certifications, and past performance.",
                },
                {
                  icon: UserCheck,
                  title: "Teaming Partner Finder",
                  desc: "Find complementary small businesses to form stronger teams. Matched by capabilities and gaps.",
                },
                {
                  icon: BarChart3,
                  title: "Win Rate Analytics",
                  desc: "Track your win/loss ratio, identify patterns, and get recommendations to improve your competitive position.",
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-br-secondary/20">
                    <item.icon className="size-5 text-br-secondary" />
                  </div>
                  <h3 className="font-heading text-sm font-semibold text-br-dark">{item.title}</h3>
                  <p className="text-xs leading-relaxed text-br-text-secondary">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Waitlist Email Capture */}
            <div className="mt-10 w-full max-w-md">
              <p className="text-sm font-medium text-br-dark mb-3">
                Get early access to Phase 2 features
              </p>
              {waitlistStatus === "sent" ? (
                <p className="text-center text-sm font-medium text-green-600">
                  You're on the list! We'll notify you when Phase 2 launches.
                </p>
              ) : (
                <>
                  <form onSubmit={handleWaitlist} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter your email for early access"
                      value={waitlistEmail}
                      onChange={(e) => {
                        setWaitlistEmail(e.target.value);
                        if (waitlistStatus === "error") setWaitlistStatus("idle");
                      }}
                      required
                      aria-label="Email for Phase 2 waitlist"
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      disabled={waitlistStatus === "sending"}
                      className="whitespace-nowrap"
                    >
                      {waitlistStatus === "sending" ? "Submitting..." : "Notify Me"}
                    </Button>
                  </form>
                  {waitlistStatus === "error" && (
                    <p className="text-xs text-red-500 mt-1.5">Something went wrong. Please try again.</p>
                  )}
                  <p className="text-xs text-br-text-secondary mt-2">
                    No spam. We'll only email you about Phase 2 launch updates.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Homepage() {
  const router = useRouter();
  const [foundingRemaining, setFoundingRemaining] = useState<number | null>(null);

  useEffect(() => {
    analytics.homepageViewed();
    fetch("/api/founding-members")
      .then((r) => r.json())
      .then((d) => setFoundingRemaining(d.remaining))
      .catch(() => {});
  }, []);

  return (
    <div className="scroll-smooth">
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-br-accent px-4 py-3 shadow-br-xl">
        <Button
          size="lg"
          className="w-full bg-br-surface text-br-dark font-semibold hover:bg-white/90 min-h-[44px] text-base shadow-br-sm"
          onClick={() => router.push("/free-tool")}
        >
          Analyze RFP Free <ArrowRight className="ml-1 size-4" />
        </Button>
      </div>

      {/* ────────────────────────────────────────────
          1. HERO SECTION
      ──────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative overflow-hidden bg-br-primary"
      >
        {/* Decorative diagonal */}
        <div
          className="absolute inset-0 bg-br-secondary/12"
          style={{ clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)" }}
        />

        <div className="relative z-10 mx-auto max-w-[700px] px-6 pt-24 pb-16 md:pt-36 md:pb-20">
          {/* Tagline */}
          <p className="text-br-secondary font-medium text-sm uppercase tracking-widest mb-4 animate-fade-in-up">
            Bid smarter, not harder.
          </p>

          {/* H1 */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold leading-tight text-white animate-fade-in-up animation-delay-100">
            From RFP to Ready in Minutes.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg text-br-secondary animate-fade-in-up animation-delay-200">
            Your AI proposal teammate. Upload any government RFP and get
            instant compliance checks, risk scoring, and actionable insights.
          </p>

          {/* Sub-subtitle */}
          <p className="mt-2 text-base text-white/70 animate-fade-in-up animation-delay-[300ms]">
            Built for 8(a), HUBZone, and small business contractors.
          </p>

          {/* Social Proof — Avatar Stack */}
          <div className="mt-8 flex flex-col gap-3 animate-fade-in-up animation-delay-[400ms]">
            <div className="flex -space-x-3">
              {["SB", "JD", "MK", "AR", "TL"].map((initials, i) => (
                <div
                  key={i}
                  className={`flex size-11 items-center justify-center rounded-full border-[3px] border-br-primary ${avatarColors[i]} font-mono-data text-white text-xs font-bold`}
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-white/80">
              Join&nbsp;<span className="font-semibold text-white font-mono-data">2,847</span>&nbsp;small business contractors
            </p>
            <p className="text-xs text-white/60">
              Trusted by 8(a), HUBZone, SDVOSB &amp; WOSB Contractors
            </p>

            {/* Micro-testimonials */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  quote: "Cut our RFP review time from 4 hours to 20 minutes. Game changer for our small team.",
                  name: "Marcus T.",
                  badge: "8(a) Contractor",
                },
                {
                  quote: "Finally a tool built for people like us — not enterprise teams with dedicated proposal staff.",
                  name: "Sarah K.",
                  badge: "WOSB, HUBZone",
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left"
                >
                  <p className="text-xs text-white/80 leading-relaxed italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/90">{t.name}</span>
                    <span className="text-[10px] text-br-accent font-medium">{t.badge}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons — Dual CTA */}
          <div className="mt-6 flex flex-wrap gap-4 animate-fade-in-up animation-delay-[500ms]">
            <Button
              size="xl"
              className="btn-hover"
              onClick={() => router.push("/sign-up")}
            >
              Get Started Free <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/40"
              onClick={() => router.push("/free-tool")}
            >
              Analyze RFP Now
            </Button>
          </div>

          {/* USP Bar */}
          <div className="mt-10 grid grid-cols-2 gap-4 xl:grid-cols-4 animate-fade-in-up animation-delay-[600ms]">
            {uspItems.map((usp) => (
              <div
                key={usp.text}
                className="group relative flex flex-col items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm transition-colors hover:bg-white/10 text-center"
              >
                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-br-secondary/20">
                  <usp.icon className="size-5 text-br-secondary" />
                </div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-br-secondary">
                  {usp.label}
                </span>
                <span className="block text-sm text-white/90 leading-snug">
                  {usp.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          2. TRUST BADGE BAR
      ──────────────────────────────────────────── */}
      <section aria-label="Trust badges" className="border-b border-br-border bg-br-surface">
        <div className="mx-auto px-[5%] py-5">
          <div className="flex flex-wrap items-center justify-center gap-12">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-br-secondary/20">
                <Lock className="size-4 text-br-secondary" />
              </div>
              <span className="text-sm text-br-text-secondary">AES-256 Encryption</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-br-secondary/20">
                <ShieldCheck className="size-4 text-br-secondary" />
              </div>
              <span className="text-sm text-br-text-secondary">30-Day Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-br-secondary/20">
                <CreditCard className="size-4 text-br-secondary" />
              </div>
              <span className="text-sm text-br-text-secondary">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-br-secondary/20">
                <RefreshCw className="size-4 text-br-secondary" />
              </div>
              <span className="text-sm text-br-text-secondary">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          3. THE BIDRANK APPROACH (Problem / Solution)
      ──────────────────────────────────────────── */}
      <section aria-label="Problem and solution" className="bg-br-light">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* LEFT — The Challenge */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className="flex size-12 items-center justify-center rounded-lg bg-br-light">
                  <AlertTriangle className="size-6 text-br-text-secondary" />
                </div>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-br-dark">
                  The Challenge
                </h2>
                <p className="mt-4 leading-relaxed text-br-text-secondary">
                  Federal contracting is hard. Most small businesses never win a
                  contract because they can't find the right help, can't read
                  dense RFPs fast enough, and can't tell which opportunities are
                  worth pursuing. The process feels designed for those who
                  already know the system — leaving everyone else on the outside
                  looking in.{" "}
                  <span className="font-medium text-br-dark">Sound familiar?</span>
                </p>
              </div>
            </div>

            {/* RIGHT — The BidRank Approach */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0">
                <div className="flex size-12 items-center justify-center rounded-lg bg-br-accent/20">
                  <Sparkles className="size-6 text-br-accent" />
                </div>
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-br-dark">
                  The BidRank Approach
                </h2>
                <p className="mt-4 leading-relaxed text-br-text-secondary">
                  Finally, someone built this for you. BidRank is an AI-powered
                  platform that analyzes government RFPs in minutes. Upload a
                  document and get compliance checks, risk scoring, requirement
                  breakdowns, and actionable recommendations — all in one
                  dashboard. No jargon, no confusion, just results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          4. HOW IT WORKS (3 Steps)
      ──────────────────────────────────────────── */}
      <section aria-label="How it works" className="bg-br-surface">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-heading text-center text-3xl font-bold text-br-dark">
            From RFP to Ready in Minutes
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-br-text-secondary">
            Three steps. No learning curve. Just results.
          </p>

          <div className="relative mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
            {/* Dotted connector line — desktop only */}
            <div className="absolute left-0 right-0 top-7 hidden h-0.5 border-t-2 border-dashed border-br-secondary/30 md:block" />

            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-br-primary text-xl font-bold text-white font-mono-data">
                1
              </div>
              <Upload className="mt-5 size-8 text-br-secondary" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-br-dark">
                Upload Your RFP or Try a Sample
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-br-text-secondary">
                Start with our free analyzer — no account needed. Upload a PDF
                or try our sample RFP to see BidRank in action.
              </p>
              <Link
                href="/free-tool"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-br-secondary hover:text-br-primary transition-colors"
              >
                Try sample RFP <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-br-primary text-xl font-bold text-white font-mono-data">
                2
              </div>
              <Search className="mt-5 size-8 text-br-secondary" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-br-dark">
                Get Your AI Analysis
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-br-text-secondary">
                Our AI breaks down your RFP into sections, flags risks, scores
                compliance, and highlights every key requirement — in under 3 minutes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-br-primary text-xl font-bold text-white font-mono-data">
                3
              </div>
              <CheckCircle className="mt-5 size-8 text-br-secondary" />
              <h3 className="mt-3 font-heading text-lg font-semibold text-br-dark">
                Submit with Confidence
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-br-text-secondary">
                Use AI-powered insights and compliance scores to strengthen
                your proposal. Track your bid readiness before you hit submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          5. FEATURES GRID (6 Features)
      ──────────────────────────────────────────── */}
      <section aria-label="Features" className="bg-br-light">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-heading text-center text-3xl font-bold text-br-dark">
            Everything You Need to Compete
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-br-text-secondary">
            No jargon, no confusion — just the tools that actually win contracts.
          </p>

          <TooltipProvider>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "AI RFP Analyzer",
                desc: "Upload PDF, Word, or Excel RFPs. Get structured analysis with compliance checks, risk assessment, and actionable recommendations in minutes.",
                tooltip: "Supports PDF, DOCX, XLSX up to 200 pages",
              },
              {
                icon: CheckCircle,
                title: "Compliance Checklist",
                desc: "Automated checks against common FAR/DFARS requirements, set-aside eligibility, and submission completeness.",
                tooltip: "Covers 50+ common FAR/DFARS clauses",
              },
              {
                icon: BarChart3,
                title: "Bid Readiness Score",
                desc: "A weighted indicator of how prepared your submission appears. Not a prediction — an honest assessment of your positioning.",
                tooltip: "Based on 12 weighted factors including past performance and compliance",
              },
              {
                icon: ShieldCheck,
                title: "Risk Assessment",
                desc: "Identify red flags, ambiguous requirements, and potential deal-breakers before you invest hours in a proposal.",
                tooltip: "Flags pricing risks, unrealistic timelines, and missing requirements",
              },
              {
                icon: LayoutDashboard,
                title: "Performance Dashboard",
                desc: "Track your analyses, saved opportunities, and bid history. Understand your pipeline at a glance.",
                tooltip: "Filter by status, date, and NAICS code",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                desc: "Share analysis results with your team. Assign sections, leave comments, and track progress in real time.",
                tooltip: "Available on Pro plan and above",
              },
            ].map((feature) => (
              <Tooltip key={feature.title}>
                <TooltipTrigger asChild>
                  <div className="group relative overflow-hidden rounded-xl border border-br-border bg-br-surface p-6 shadow-br-sm card-hover cursor-default">
                    {/* Top Accent Bar */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-br-secondary/30" />
                    <div className="flex flex-col items-start gap-3 pt-2">
                      <div className="flex size-10 items-center justify-center rounded-full bg-br-secondary/10">
                        <feature.icon className="size-5 text-br-secondary" />
                      </div>
                      <h3 className="font-heading text-base font-semibold text-br-dark">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-br-text-secondary">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">{feature.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          </TooltipProvider>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          5.5 THE 4 UNBEATABLES — COMPETITIVE POSITIONING
      ──────────────────────────────────────────── */}
      <section aria-label="Why BidRank wins" className="bg-br-surface border-y border-br-border">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <div className="text-center">
            <Badge className="bg-br-secondary/15 text-br-dark border-br-secondary/30 text-xs font-medium mb-4 px-3 py-1">
              Why BidRank Wins
            </Badge>
            <h2 className="font-heading text-3xl font-bold text-br-dark md:text-4xl">
              The 4 Things We Will Never Lose On
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-br-text-secondary">
              These aren't features we bolted on. They're the foundation we built on.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Speed */}
            <div className="group relative rounded-2xl border border-br-border bg-br-surface p-6 md:p-8 shadow-br-sm transition-all hover:shadow-br-md hover:border-br-secondary/30 overflow-hidden">
              <div className="flex items-start gap-4 min-w-0 w-full">
                <div className="flex size-12 md:size-14 flex-shrink-0 items-center justify-center rounded-2xl bg-br-accent/15">
                  <Zap className="size-6 md:size-7 text-br-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-bold text-br-dark">Speed</h3>
                  <p className="mt-1 text-sm md:text-base font-semibold text-br-primary leading-snug break-words">
                    "From upload to insights in under 3 minutes"
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-br-text-secondary">
                    Your competitors are still skimming page 12 of a 200-page RFP while
                    you've already identified every red flag, compliance gap, and risk
                    factor. Manual analysis takes 4-6 hours per RFP. BidRank takes under
                    3 minutes. That's not an incremental improvement — it's a different
                    league.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-br-text-secondary">
                    <Timer className="size-3.5 text-br-accent" />
                    <span><span className="font-semibold text-br-dark">4-6 hours</span> manual vs <span className="font-semibold text-br-dark font-mono-data">&lt;3 min</span> BidRank</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simplicity */}
            <div className="group relative rounded-2xl border border-br-border bg-br-surface p-6 md:p-8 shadow-br-sm transition-all hover:shadow-br-md hover:border-br-secondary/30 overflow-hidden">
              <div className="flex items-start gap-4 min-w-0 w-full">
                <div className="flex size-12 md:size-14 flex-shrink-0 items-center justify-center rounded-2xl bg-br-primary/10">
                  <Target className="size-6 md:size-7 text-br-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-bold text-br-dark">Simplicity</h3>
                  <p className="mt-1 text-sm md:text-base font-semibold text-br-primary leading-snug break-words">
                    "One upload. One dashboard. Zero training."
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-br-text-secondary">
                    Enterprise tools take weeks to learn and a consultant to configure.
                    BidRank takes a single upload. No onboarding calls, no setup wizards,
                    no 40-page user guides. If you can drag and drop a file, you can use
                    BidRank. It just works — the way software should.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-br-text-secondary">
                    <CheckCircle className="size-3.5 text-br-success" />
                    <span><span className="font-semibold text-br-dark">Zero training</span> required. Works on first use.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div className="group relative rounded-2xl border border-br-border bg-br-surface p-6 md:p-8 shadow-br-sm transition-all hover:shadow-br-md hover:border-br-secondary/30 overflow-hidden">
              <div className="flex items-start gap-4 min-w-0 w-full">
                <div className="flex size-12 md:size-14 flex-shrink-0 items-center justify-center rounded-2xl bg-br-accent/15">
                  <GraduationCap className="size-6 md:size-7 text-br-accent" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-bold text-br-dark">Specialization</h3>
                  <p className="mt-1 text-sm md:text-base font-semibold text-br-primary leading-snug break-words">
                    "AI built exclusively on federal contracting data"
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-br-text-secondary">
                    Generic AI tools don't know FAR from DFARS, can't spot set-aside
                    eligibility, and have never read a Section 508 compliance requirement.
                    Every model in BidRank was built from the ground up on federal
                    contracting data — not repurposed from some other industry's AI.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-br-text-secondary">
                    <Trophy className="size-3.5 text-br-accent" />
                    <span><span className="font-semibold text-br-dark font-mono-data">50+ FAR/DFARS</span> clauses covered automatically</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="group relative rounded-2xl border border-br-border bg-br-surface p-6 md:p-8 shadow-br-sm transition-all hover:shadow-br-md hover:border-br-secondary/30 overflow-hidden">
              <div className="flex items-start gap-4 min-w-0 w-full">
                <div className="flex size-12 md:size-14 flex-shrink-0 items-center justify-center rounded-2xl bg-br-primary/10">
                  <MessageCircle className="size-6 md:size-7 text-br-primary" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-heading text-lg font-bold text-br-dark">Support</h3>
                  <p className="mt-1 text-sm md:text-base font-semibold text-br-primary leading-snug break-words">
                    "Real humans who've won federal contracts"
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-br-text-secondary">
                    When you hit a wall at 11pm before a bid deadline, you don't want a
                    chatbot pointing you to a FAQ page. You want someone who's been in your
                    shoes — someone who's written proposals, navigated SAM.gov, and won
                    federal contracts. That's who answers your support tickets.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-br-text-secondary">
                    <HeartHandshake className="size-3.5 text-br-success" />
                    <span><span className="font-semibold text-br-dark">Real contractors</span>, not outsourced support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button
              variant="secondary"
              className="px-6 btn-hover"
              onClick={() => router.push("/compare/manual")}
            >
              See the Full Comparison <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          7. BUILT FOR THE UNDERDOGS — BRAND POSITIONING
      ──────────────────────────────────────────── */}
      <section
        aria-label="Brand story"
        className="relative overflow-hidden bg-br-primary"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 items-center">
            {/* Left — Brand Statement */}
            <div>
              <Quote className="size-10 text-br-accent/60 mb-4" />
              <h2 className="font-heading text-2xl font-bold text-white md:text-3xl leading-snug">
                Built for the Underdogs of GovCon
              </h2>
              <p className="mt-5 text-white/80 leading-relaxed">
                This wasn't built in a boardroom by people who've never touched a
                federal RFP. BidRank was built by contractors who've sat where you're
                sitting — staring at a 200-page solicitation, wondering if it's even
                worth the bid, and wishing someone would just tell them what matters.
              </p>
              <p className="mt-4 text-white/80 leading-relaxed">
                We built the tool we always wished existed. Confident but approachable.
                Expert but not arrogant. For the underdog, not the giant.
              </p>
              <div className="mt-8">
                <p className="text-br-accent font-semibold text-lg">
                  "Finally, someone built this for ME."
                </p>
              </div>
            </div>

            {/* Right — Brand Pillars */}
            <div className="space-y-5">
              {[
                {
                  heading: "Built by contractors, for contractors",
                  body: "Every feature, every checklist, every risk flag comes from real federal contracting experience — not theory.",
                },
                {
                  heading: "No jargon, no confusion, just results",
                  body: "We don't hide behind consultant-speak. Plain language, clear action items, and honest assessments you can actually use.",
                },
                {
                  heading: "Your AI proposal teammate",
                  body: "Not a replacement for your expertise — a force multiplier. BidRank handles the heavy lifting so you can focus on winning.",
                },
              ].map((pillar) => (
                <div
                  key={pillar.heading}
                  className="rounded-xl border border-white/10 bg-white/5 px-6 py-5 transition-all duration-200 hover:bg-white/10 hover:border-white/20"
                >
                  <h3 className="font-heading text-base font-semibold text-white">
                    {pillar.heading}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          6. BUILT FOR FEDERAL CONTRACTORS
      ──────────────────────────────────────────── */}
      <section aria-label="Certifications and founding members" className="bg-br-surface">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="font-heading text-center text-3xl font-bold text-br-dark">
            Built for Federal Contractors
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-br-text-secondary">
            Designed to support the certifications and compliance requirements that matter most in federal contracting.
          </p>

          {/* Certification Badges */}
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "8(a) Business Development", abbr: "8(a)" },
              { label: "HUBZone Program", abbr: "HUBZone" },
              { label: "Service-Disabled Veteran-Owned", abbr: "SDVOSB" },
              { label: "Women-Owned Small Business", abbr: "WOSB" },
            ].map((cert) => (
              <div
                key={cert.abbr}
                className="flex flex-col items-center gap-3 rounded-xl border border-br-border bg-br-light/50 px-4 py-6 transition-shadow hover:shadow-br-md"
              >
                <ShieldCheck className="size-8 text-br-primary" />
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-br-primary/15 bg-br-primary/8 text-br-primary text-xs font-semibold"
                  >
                    {cert.abbr}
                  </Badge>
                  <p className="mt-2 text-xs text-br-text-secondary">{cert.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Early Adopter CTA */}
          <div className="mt-14 rounded-2xl bg-br-primary px-6 py-10 text-center sm:px-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-white mb-4">
              <Sparkles className="size-4" />
              Founding Member Program
            </div>
            <h3 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              Be Among the First 100 Founders
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-white/80">
              Join now and lock in <span className="font-semibold text-white">50% off forever</span> on any paid plan.
              Your discount never expires — even after the first 100 spots are gone.
            </p>
            <div className="mt-6">
              <Button
                size="xl"
                className="btn-hover"
                onClick={() => router.push("/pricing")}
              >
                Claim Your Spot <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
            {/* Urgency Counter */}
            <div className="mt-6 flex items-center justify-center gap-2 min-h-[24px]">
              <div className="flex -space-x-1.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex size-7 items-center justify-center rounded-full border-2 border-br-primary bg-br-accent/80 font-mono-data text-[10px] font-bold text-white"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/80">
                {foundingRemaining !== null ? (
                  foundingRemaining >= 95 ? (
                    <span className="font-semibold text-white">Limited spots — be among the first founders</span>
                  ) : (
                    <>
                      <span className="font-semibold text-white font-mono-data">{foundingRemaining} of 100 spots remaining</span> — first come, first served
                    </>
                  )
                ) : (
                  <span className="font-semibold text-white">Limited spots remaining</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          6.5 PHASE 2 — COMING SOON
      ──────────────────────────────────────────── */}
      <Phase2Section />

      {/* ────────────────────────────────────────────
          8. PRICING TEASER
      ──────────────────────────────────────────── */}
      <section aria-label="Pricing" className="bg-br-light">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-heading text-center text-3xl font-bold text-br-dark">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-3 text-center text-br-text-secondary max-w-2xl mx-auto">
            Start free, scale as you grow. Every paid plan includes a 14-day free trial with no credit card required.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-start">
            {/* Free */}
            <div className="flex flex-col items-center rounded-xl border border-br-border bg-br-surface p-6 shadow-br-sm card-hover">
              <div className="w-full text-center">
                <h3 className="font-heading text-xl font-semibold text-br-dark">Free Forever</h3>
                <p className="mt-2 text-3xl font-bold text-br-dark font-mono-data">
                  $0<span className="text-base font-normal text-br-text-secondary">/mo</span>
                </p>
                <p className="mt-1 text-sm text-br-text-secondary">
                  Try BidRank with no commitment
                </p>
              </div>
              <div className="w-full mt-6">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push("/free-tool")}
                >
                  Get Started Free <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>

            {/* Starter — Highlighted */}
            <div className="relative flex flex-col items-center rounded-xl border-[3px] border-br-accent bg-br-surface p-6 shadow-br-lg card-hover scale-[1.03]">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-br-accent text-white border-0 px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full">
                Most Popular
              </Badge>
              <div className="w-full text-center">
                <h3 className="font-heading text-xl font-semibold text-br-dark">Starter</h3>
                <p className="mt-2 text-3xl font-bold text-br-dark font-mono-data">
                  $49<span className="text-base font-normal text-br-text-secondary">/mo</span>
                </p>
                <p className="mt-1 text-sm text-br-text-secondary">
                  For businesses starting their federal journey
                </p>
              </div>
              <div className="w-full mt-6">
                <Button
                  className="w-full btn-hover"
                  onClick={() => router.push("/pricing")}
                >
                  Start 14-Day Trial <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>

            {/* Pro */}
            <div className="flex flex-col items-center rounded-xl border border-br-border bg-br-surface p-6 shadow-br-sm card-hover">
              <div className="w-full text-center">
                <h3 className="font-heading text-xl font-semibold text-br-dark">Pro</h3>
                <p className="mt-2 text-3xl font-bold text-br-dark font-mono-data">
                  $149<span className="text-base font-normal text-br-text-secondary">/mo</span>
                </p>
                <p className="mt-1 text-sm text-br-text-secondary">
                  For growing teams collaborating on bids
                </p>
              </div>
              <div className="w-full mt-6">
                <Button
                  variant="secondary"
                  className="w-full btn-hover"
                  onClick={() => router.push("/pricing")}
                >
                  Start 14-Day Trial <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>

            {/* Studio */}
            <div className="flex flex-col items-center rounded-xl border border-br-border bg-br-surface p-6 shadow-br-sm card-hover">
              <div className="w-full text-center">
                <h3 className="font-heading text-xl font-semibold text-br-dark">Studio</h3>
                <p className="mt-2 text-3xl font-bold text-br-dark font-mono-data">
                  $399<span className="text-base font-normal text-br-text-secondary">/mo</span>
                </p>
                <p className="mt-1 text-sm text-br-text-secondary">
                  For established firms scaling operations
                </p>
              </div>
              <div className="w-full mt-6">
                <Button
                  variant="secondary"
                  className="w-full btn-hover"
                  onClick={() => router.push("/pricing")}
                >
                  Start 14-Day Trial <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>

            {/* Enterprise */}
            <div className="flex flex-col items-center rounded-xl border border-br-border bg-br-surface p-6 shadow-br-sm card-hover">
              <div className="w-full text-center">
                <h3 className="font-heading text-xl font-semibold text-br-dark">Enterprise</h3>
                <p className="mt-2 text-3xl font-bold text-br-dark font-mono-data">
                  Custom
                </p>
                <p className="mt-1 text-sm text-br-text-secondary">
                  For large organizations with custom needs
                </p>
              </div>
              <div className="w-full mt-6">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push("/pricing")}
                >
                  Contact Sales <ArrowRight className="ml-1 size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────
          8.5 NEWSLETTER — GovCon Insider
      ──────────────────────────────────────────── */}
      <NewsletterSubscribe variant="hero" source="homepage_post_pricing" />

      {/* ────────────────────────────────────────────
          9. FINAL CTA
      ──────────────────────────────────────────── */}
      <section aria-label="Call to action" className="relative overflow-hidden bg-br-primary">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="font-heading text-3xl font-bold text-white md:text-4xl">
            Start Winning Federal Contracts Today
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/80">
            From RFP to ready in minutes. Join 2,847 small businesses
            who stopped guessing and started winning.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="xl"
              className="btn-hover"
              onClick={() => router.push("/pricing")}
            >
              Get Started Free <ArrowRight className="ml-1 size-4" />
            </Button>
            <Button
              variant="ghost"
              size="xl"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/40"
              onClick={() => router.push("/pricing")}
            >
              View Pricing
            </Button>
          </div>
          <p className="mt-6 text-sm text-white/60">
            14-day free trial. No credit card required. Cancel anytime.
          </p>
        </div>
      </section>

      {/* SoftwareApplication Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "BidRank.pro",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: "AI-powered RFP analysis platform for federal contractors. Upload government RFPs and get instant compliance checks, risk scoring, and actionable recommendations.",
            url: "https://www.bidrank.pro",
            offers: [
              {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                name: "Free Forever",
                description: "3 RFP analyses per month",
              },
              {
                "@type": "Offer",
                price: "49",
                priceCurrency: "USD",
                name: "Starter Plan",
                description: "Unlimited RFP analyses, compliance matrix, risk heatmap",
              },
              {
                "@type": "Offer",
                price: "149",
                priceCurrency: "USD",
                name: "Pro Plan",
                description: "Team collaboration, past performance library, 200-page limit",
              },
              {
                "@type": "Offer",
                price: "399",
                priceCurrency: "USD",
                name: "Studio Plan",
                description: "API access, white-label reports, 10 team members",
              },
            ],
          }),
        }}
      />
    </div>
  );
}