"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useUserPlan } from "@/hooks/useUserPlan";
import { NpsSurvey } from "@/components/bidrank/support/NpsSurvey";
import { FeatureRequestButton } from "@/components/bidrank/support/FeatureRequestButton";
import Link from "next/link";
import {
  FileSearch,
  BookOpen,
  Zap,
  Award,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Star,
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Trophy,
  Gift,
  Crown,
  CreditCard,
  CalendarDays,
  ArrowRight,
  Lock,
  CheckCircle2,
  PlayCircle,
  UserPlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BADGE_DEFINITIONS, type BadgeDefinition } from "@/lib/badges";
import { PLAN_NAMES } from "@/lib/auth";
import { analytics } from "@/lib/analytics";
import ReferralSection from "@/components/bidrank/referral/ReferralSection";
import type { LucideIcon } from "lucide-react";

// ── Icon mapping ──────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  FileSearch,
  BookOpen,
  Zap,
  Award,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Star,
};

// ── Category colors ───────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  analysis: "bg-br-primary/8 text-br-primary border-br-primary/20",
  compliance: "bg-br-success/10 text-br-success border-br-success/20",
  engagement: "bg-br-warning/10 text-br-warning border-br-warning/20",
  achievement: "bg-br-accent/10 text-br-accent border-br-accent/20",
};

// ── Plan badge colors ─────────────────────────────
const PLAN_BADGE_STYLES: Record<string, string> = {
  free: "bg-br-light text-br-text-secondary border-br-border",
  starter: "bg-br-primary/8 text-br-primary border-br-primary/20",
  pro: "bg-br-accent/20 text-br-dark border-br-accent/50",
  studio: "bg-br-accent/10 text-br-accent border-br-accent/20",
  enterprise: "bg-br-success/10 text-br-success border-br-success/20",
};

const PLAN_ICONS: Record<string, LucideIcon> = {
  free: Star,
  starter: Zap,
  pro: Crown,
  studio: Flame,
  enterprise: ShieldCheck,
};

// ── Component ─────────────────────────────────────
export default function DashboardClient() {
  const { data: session } = useSession();
  const { plan, isFree, isPaid, loading, limits, analysesThisMonth, stats, subscriptionStatus, cancelAtPeriodEnd } = useUserPlan();

  const userName = session?.user?.name || "Contractor";
  const planLabel = PLAN_NAMES[plan] || "Free";
  const PlanIcon = PLAN_ICONS[plan] || Star;
  const maxAnalyses = limits?.maxAnalysesPerMonth || 3;
  const usagePercent = Math.min((analysesThisMonth / maxAnalyses) * 100, 100);
  const totalAnalyses = stats?.totalAnalyses || 0;
  const averageScore = stats?.averageScore || 0;
  const timeSavedHours = stats ? Math.round((stats.timeSavedMinutes || 0) / 60) : 0;

  // Compute trial days remaining
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);
  useEffect(() => {
    const trialEnd = session?.user?.trialEndsAt as string | undefined;
    if (trialEnd) {
      const diff = new Date(trialEnd).getTime() - Date.now();
      const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      setTrialDaysLeft(days);
    }
  }, [session?.user?.trialEndsAt]);

  // Funnel: dashboard viewed
  useEffect(() => {
    if (!loading && plan) {
      analytics.dashboardViewed(plan, totalAnalyses);
    }
  }, [loading, plan, totalAnalyses]);

  if (loading) {
    return (
      <div className="bg-br-light min-h-screen flex items-center justify-center">
        <div className="text-br-primary text-lg">Loading dashboard...</div>
      </div>
    );
  }

  const earnedBadges: string[] = [];
  const nextBadge = BADGE_DEFINITIONS.find((b) => !earnedBadges.includes(b.key) && b.key === "analyst_5");
  const nextBadgeProgress = nextBadge ? Math.min((totalAnalyses / 5) * 100, 100) : 0;

  return (
    <div className="bg-br-light min-h-screen">
      {/* ── A. Welcome Header ──────────────────── */}
      <section className="bg-br-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl font-heading">
                Welcome back, {userName}!
              </h1>
              <p className="mt-1 text-br-light/80">
                Track your analyses, earn badges, and climb the ranks.
              </p>
              {trialDaysLeft !== null && trialDaysLeft > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-br-accent">
                  <CalendarDays className="h-4 w-4" />
                  Free trial: <span className="font-bold font-mono-data">{trialDaysLeft} days</span> remaining
                  {!isPaid && (
                    <Link href="/pricing" className="ml-2 underline hover:text-white transition-colors">
                      Upgrade now
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              {cancelAtPeriodEnd && (
                <span className="text-xs bg-br-warning/20 text-br-warning px-2 py-1 rounded">
                  Cancels at period end
                </span>
              )}
              <Badge className={`${PLAN_BADGE_STYLES[plan] || PLAN_BADGE_STYLES.free} self-start sm:self-auto px-3 py-1.5 text-sm font-semibold`}>
                <PlanIcon className="mr-1.5 h-3.5 w-3.5" />
                {planLabel} Plan
              </Badge>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <QuickStatCard
              icon={<BarChart3 className="h-5 w-5" />}
              label="Analyses This Month"
              value={analysesThisMonth.toString()}
              subtext={`${maxAnalyses - analysesThisMonth} remaining this month`}
            />
            <QuickStatCard
              icon={<Target className="h-5 w-5" />}
              label="Avg Compliance Score"
              value={totalAnalyses > 0 ? `${averageScore.toFixed(1)}%` : "N/A"}
              subtext="Across all analyses"
            />
            <QuickStatCard
              icon={<Clock className="h-5 w-5" />}
              label="Time Saved"
              value={`${timeSavedHours} hrs`}
              subtext="vs manual analysis"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ── B. Left Column: Usage & Progress ── */}
          <section className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-br-dark font-heading">Your Progress</h2>

            {/* Usage meter */}
            <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-br-dark">Monthly Usage</p>
                  <span className="text-xs font-mono-data text-br-text-secondary">
                    {analysesThisMonth} / {maxAnalyses}
                  </span>
                </div>
                <Progress value={usagePercent} className="h-3" />
                {usagePercent >= 80 && !isFree && (
                  <p className="mt-2 text-xs text-br-warning">
                    Running low on analyses this month.
                  </p>
                )}
                {isFree && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-br-text-secondary">Need more analyses?</span>
                    <Link href="/pricing">
                      <Button size="sm" className="h-7 text-xs bg-br-accent hover:bg-br-accent/90 text-br-dark">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        Upgrade
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next badge */}
            {nextBadge && (
              <Card className="bg-br-surface border-br-border border-br-accent/30 rounded-xl shadow-br-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-heading">
                    <TrendingUp className="h-5 w-5 text-br-accent" />
                    Next Badge
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm font-medium text-br-dark">{nextBadge.name}</p>
                  <Progress value={nextBadgeProgress} className="h-2.5" />
                  <p className="text-xs font-mono-data text-br-text-secondary">
                    {totalAnalyses}/5 analyses toward {nextBadge.name} badge
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Subscription management (for paid users) */}
            {isPaid && (
              <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-br-dark">
                    <CreditCard className="h-4 w-4" />
                    Subscription
                  </div>
                  <div className="text-xs space-y-1 text-br-text-secondary">
                    <p>
                      Status:{" "}
                      <span className="capitalize font-medium text-br-dark">
                        {subscriptionStatus || "Active"}
                      </span>
                    </p>
                    {cancelAtPeriodEnd && (
                      <p className="text-br-warning">
                        Your subscription will cancel at the end of the billing period.
                      </p>
                    )}
                  </div>
                  <Link href="/pricing" className="block">
                    <Button variant="outline" size="sm" className="w-full text-xs mt-1">
                      Manage Subscription
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Feature Request + Support */}
            <div className="flex items-center gap-3">
              <FeatureRequestButton />
              <a href="/support">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs border-br-border text-br-text-secondary hover:text-br-primary hover:border-br-primary/30">
                  Help & Support
                </Button>
              </a>
            </div>
          </section>

          {/* ── Right column: Badges + Activity ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* ── C. Badges Section ─────────────── */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-br-dark font-heading">Your Badges</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {BADGE_DEFINITIONS.map((badge) => (
                  <BadgeCard
                    key={badge.key}
                    badge={badge}
                    earned={earnedBadges.includes(badge.key)}
                  />
                ))}
              </div>
            </section>

            {/* ── D. Activity / Empty State ─────── */}
            {totalAnalyses === 0 ? (
              <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm">
                <CardContent className="pt-10 pb-10 text-center">
                  <Target className="h-12 w-12 text-br-primary/30 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-br-dark mb-2 font-heading">No analyses yet</h3>
                  <p className="text-sm text-br-text-secondary mb-4">
                    Upload your first RFP to see your compliance score and start earning badges.
                  </p>
                  <Link href="/free-tool">
                    <Button className="bg-br-accent hover:bg-br-accent/90 text-br-dark">
                      Analyze Your First RFP
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <section>
                <h2 className="mb-4 text-xl font-bold text-br-dark font-heading">Recent Activity</h2>
                <Card className="bg-br-surface border-br-border rounded-xl shadow-br-sm">
                  <CardContent className="pt-6">
                    <p className="text-sm text-br-text-secondary text-center py-4">
                      Analysis history will appear here.
                    </p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* ── E. Referral Program ────────────── */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-br-dark flex items-center gap-2 font-heading">
                <Gift className="h-5 w-5 text-br-accent" />
                Refer & Earn
              </h2>
              <ReferralSection />
            </section>
          </div>
        </div>
      </div>

      {/* NPS Survey (shows after 3rd analysis) */}
      {session?.user?.id && (
        <NpsSurvey userId={session.user.id} totalAnalyses={totalAnalyses} />
      )}
    </div>
  );
}

// ── Quick Stat Card ──────────────────────────────
function QuickStatCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className="rounded-xl bg-br-surface/10 backdrop-blur-sm border border-br-surface/20 px-4 py-4 sm:px-5">
      <div className="flex items-center gap-2 text-br-light/70">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono-data">{value}</span>
      </div>
      {subtext && <p className="mt-1 text-xs text-br-light/60">{subtext}</p>}
    </div>
  );
}

// ── Badge Card ─────────────────────────────────────
function BadgeCard({
  badge,
  earned,
}: {
  badge: BadgeDefinition;
  earned: boolean;
}) {
  const IconComponent = ICON_MAP[badge.icon] || Award;

  return (
    <Card
      className={`relative transition-all hover:shadow-br-md border-br-border rounded-xl shadow-br-sm ${
        earned ? "border-br-accent/50 bg-br-surface" : "bg-br-surface opacity-60 grayscale"
      }`}
    >
      <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-full ${
            earned ? "bg-br-accent/15 text-br-accent" : "bg-br-light text-br-text-secondary"
          }`}
        >
          {earned ? (
            <IconComponent className="h-7 w-7" />
          ) : (
            <Lock className="h-5 w-5" />
          )}
        </div>
        <div>
          <p className="font-semibold text-sm text-br-dark">{badge.name}</p>
          <span
            className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium ${
              CATEGORY_COLORS[badge.category] || "bg-br-light text-br-text-secondary"
            }`}
          >
            {badge.category}
          </span>
        </div>
        <p className="text-xs text-br-text-secondary leading-relaxed line-clamp-2">
          {badge.description}
        </p>
        {earned ? (
          <p className="text-[11px] font-medium text-br-accent">Earned</p>
        ) : (
          <p className="text-[11px] text-br-text-secondary">{badge.requirement}</p>
        )}
      </CardContent>
    </Card>
  );
}