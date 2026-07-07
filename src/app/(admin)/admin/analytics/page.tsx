"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowLeft,
  RefreshCw,
  BarChart3,
  Target,
  Zap,
  UserCheck,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsData {
  range: string;
  period: { from: string; to: string };
  users: { total: number; newInPeriod: number; paid: number; activeInPeriod: number };
  activity: { dau: number; wau: number; mau: number };
  conversions: { freeToolUses: number; freeToolToSignup: number; trialToPaid: number; signupToPaidRate: string };
  revenue: { mrr: number; arpu: number; activeSubscriptions: number; churnedSubscriptions: number; churnRate: string };
  topEvents: { event: string; count: number }[];
  rfpTypes: { type: string; count: number }[];
  referrals: { status: string; count: number }[];
  timeline: Record<string, any>[];
  planDistribution?: { plan: string; count: number }[];
}

const EVENT_LABELS: Record<string, string> = {
  user_signed_up: "Sign Ups",
  user_logged_in: "Logins",
  trial_started: "Trials",
  analysis_completed: "Analyses",
  analysis_started: "Analysis Starts",
  pricing_page_viewed: "Pricing Views",
  free_tool_used: "Free Tool",
  subscription_started: "Subscriptions",
  subscription_cancelled: "Cancellations",
  subscription_upgraded: "Upgrades",
  referral_link_clicked: "Referral Clicks",
  referral_converted: "Referral Converts",
};

const CHART_COLORS = ["#1A3A5C", "#D4A843", "#4A7C9B", "#E8C97A", "#7BA3B8", "#2D5F8A"];

const PIE_COLORS = ["#1A3A5C", "#D4A843", "#4A7C9B", "#E8C97A", "#7BA3B8"];

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30d");

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (res.status === 403) {
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [range]);

  // ── Derived chart data ──
  const signupTimeline = useMemo(() => {
    if (!data?.timeline.length) return [];
    return data.timeline.map((d) => ({
      date: d.date.slice(5), // MM-DD
      Signups: d.user_signed_up || 0,
      Analyses: d.analysis_completed || 0,
      "Free Tool": d.free_tool_used || 0,
    }));
  }, [data?.timeline]);

  const revenueTimeline = useMemo(() => {
    if (!data?.timeline.length) return [];
    return data.timeline.map((d) => ({
      date: d.date.slice(5),
      Subscriptions: d.subscription_started || 0,
      Cancellations: d.subscription_cancelled || 0,
    }));
  }, [data?.timeline]);

  // Conversion funnel
  const funnelData = useMemo(() => {
    if (!data) return [];
    return [
      { step: "Free Tool Uses", value: data.conversions.freeToolUses },
      { step: "Free Tool → Signup", value: data.conversions.freeToolToSignup },
      { step: "Signups", value: data.topEvents.find((e) => e.event === "user_signed_up")?.count || 0 },
      { step: "Trials Started", value: data.topEvents.find((e) => e.event === "trial_started")?.count || 0 },
      { step: "Paid Subscriptions", value: data.conversions.trialToPaid },
    ];
  }, [data]);

  const rfpPieData = useMemo(() => {
    if (!data?.rfpTypes.length) return [];
    return data.rfpTypes.map((t) => ({
      name: t.type || "Not specified",
      value: t.count,
    }));
  }, [data?.rfpTypes]);

  const referralPieData = useMemo(() => {
    if (!data?.referrals.length) return [];
    return data.referrals.map((r) => ({
      name: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      value: r.count,
    }));
  }, [data?.referrals]);

  return (
    <div className="min-h-screen bg-br-light">
      {/* Header */}
      <div className="bg-br-primary text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-br-light/70 hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold font-heading">Analytics Dashboard</h1>
              <p className="text-sm text-br-light/70">Internal admin view</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <Button
                key={r}
                size="sm"
                variant={range === r ? "default" : "outline"}
                onClick={() => setRange(r)}
                className={range === r ? "" : "text-white border-white/20 hover:bg-white/10 hover:border-white/30"}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </Button>
            ))}
            <Button size="sm" variant="ghost" className="border-white/20 text-br-light/70 hover:text-white hover:border-white/30 hover:bg-white/10" onClick={fetchAnalytics}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </div>

      {!data ? (
        <div className="flex items-center justify-center py-20">
          {loading ? <RefreshCw className="h-6 w-6 text-br-primary animate-spin" /> : <p className="text-br-text-secondary">Access denied. Admin only.</p>}
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
          {/* ── KPI Cards Row 1 ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard
              icon={<Users className="h-5 w-5" />}
              label="Total Users"
              value={data.users.total.toLocaleString()}
              sub={`+${data.users.newInPeriod} new in period`}
              color="text-br-text-secondary"
            />
            <KPICard
              icon={<Activity className="h-5 w-5" />}
              label="DAU / WAU / MAU"
              value={`${data.activity.dau} / ${data.activity.wau} / ${data.activity.mau}`}
              sub="daily / weekly / monthly"
              color="text-br-success"
            />
            <KPICard
              icon={<DollarSign className="h-5 w-5" />}
              label="MRR"
              value={`$${data.revenue.mrr.toLocaleString()}`}
              sub={`ARPU: $${data.revenue.arpu}`}
              color="text-br-success"
            />
            <KPICard
              icon={<CreditCard className="h-5 w-5" />}
              label="Active Subscriptions"
              value={data.revenue.activeSubscriptions.toString()}
              sub={`Churn: ${data.revenue.churnRate}`}
              color="text-br-primary"
            />
          </div>

          {/* ── KPI Cards Row 2 ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KPICard
              icon={<UserCheck className="h-5 w-5" />}
              label="Paid Users"
              value={data.users.paid.toString()}
              sub={`${data.users.total > 0 ? ((data.users.paid / data.users.total) * 100).toFixed(1) : 0}% of total`}
              color="text-br-primary"
            />
            <KPICard
              icon={<Zap className="h-5 w-5" />}
              label="Free Tool Uses"
              value={data.conversions.freeToolUses.toString()}
              sub={`${data.conversions.freeToolToSignup} converted to signup`}
              color="text-br-accent"
            />
            <KPICard
              icon={<Target className="h-5 w-5" />}
              label="Signup-to-Paid"
              value={data.conversions.signupToPaidRate}
              sub={`${data.conversions.trialToPaid} subscriptions started`}
              color="text-br-error"
            />
            <KPICard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Active in Period"
              value={data.users.activeInPeriod.toString()}
              sub="users with events"
              color="text-br-secondary"
            />
          </div>

          {/* ── Charts Row 1: Signup/Activity Timeline + Conversion Funnel ── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Area Chart: Signups, Analyses, Free Tool */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                {signupTimeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={signupTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--br-border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Area type="monotone" dataKey="Signups" stackId="1" stroke="#1A3A5C" fill="#1A3A5C" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="Analyses" stackId="1" stroke="#D4A843" fill="#D4A843" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="Free Tool" stackId="1" stroke="#4A7C9B" fill="#4A7C9B" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState text="No activity data yet" />
                )}
              </CardContent>
            </Card>

            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funnelData.map((step, i) => {
                    const maxVal = funnelData[0]?.value || 1;
                    const pct = (step.value / maxVal) * 100;
                    const prevVal = i > 0 ? funnelData[i - 1].value : null;
                    const dropRate = prevVal && prevVal > 0 ? ((1 - step.value / prevVal) * 100).toFixed(0) : null;
                    return (
                      <div key={step.step}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-br-dark">{step.step}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold font-mono-data">{step.value}</span>
                            {dropRate !== null && Number(dropRate) > 0 && (
                              <span className="text-xs text-br-error">(-{dropRate}%)</span>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-br-light rounded-full h-3">
                          <div
                            className="h-3 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.max(pct, 2)}%`,
                              backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Charts Row 2: Subscriptions vs Cancellations + Top Events ── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Subscription Flow Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Subscription Flow</CardTitle>
              </CardHeader>
              <CardContent>
                {revenueTimeline.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={revenueTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--br-border)" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: 12 }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="Subscriptions" fill="#0D9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Cancellations" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState text="No subscription data yet" />
                )}
              </CardContent>
            </Card>

            {/* Top Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5" />
                  Top Events (this period)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.topEvents.map((e, i) => {
                    const maxCount = data.topEvents[0]?.count || 1;
                    const pct = (e.count / maxCount) * 100;
                    return (
                      <div key={e.event} className="flex items-center gap-3">
                        <span className="w-6 text-xs text-br-text-secondary text-right">{i + 1}</span>
                        <span className="w-40 text-sm truncate">{EVENT_LABELS[e.event] || e.event}</span>
                        <div className="flex-1 bg-br-light rounded-full h-2.5">
                          <div className="bg-br-primary rounded-full h-2.5 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-12 text-sm font-medium text-right font-mono-data">{e.count}</span>
                      </div>
                    );
                  })}
                  {data.topEvents.length === 0 && <EmptyState text="No events yet" />}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Charts Row 3: RFP Types + Referrals (Pie Charts) ── */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* RFP Types Pie */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Target className="h-5 w-5" />
                  RFP Set-Aside Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                {rfpPieData.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={220}>
                      <PieChart>
                        <Pie data={rfpPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                          {rfpPieData.map((_, idx) => (
                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {rfpPieData.map((item, idx) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                          <span className="text-sm flex-1 truncate">{item.name}</span>
                          <span className="text-sm font-medium font-mono-data">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState text="No analyses yet" />
                )}
              </CardContent>
            </Card>

            {/* Referral Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Referral Program</CardTitle>
              </CardHeader>
              <CardContent>
                {referralPieData.length > 0 ? (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={220}>
                      <PieChart>
                        <Pie data={referralPieData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2} dataKey="value">
                          {referralPieData.map((_, idx) => (
                            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {referralPieData.map((item, idx) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                          <span className="text-sm flex-1">{item.name}</span>
                          <span className="text-sm font-medium font-mono-data">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState text="No referrals yet" />
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Revenue Summary ── */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                <RevenueStat label="MRR" value={`$${data.revenue.mrr.toLocaleString()}`} />
                <RevenueStat label="ARPU" value={`$${data.revenue.arpu}`} />
                <RevenueStat label="Active Subs" value={data.revenue.activeSubscriptions.toString()} positive />
                <RevenueStat label="Churned Subs" value={data.revenue.churnedSubscriptions.toString()} negative />
                <RevenueStat label="Churn Rate" value={data.revenue.churnRate} />
              </div>
            </CardContent>
          </Card>

          {/* ── Event Timeline Table ── */}
          {data.timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Daily Event Timeline (Last 14 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium text-br-text-secondary">Date</th>
                        {Object.keys(EVENT_LABELS).filter((e) => data.timeline.some((d: any) => d[e])).map((e) => (
                          <th key={e} className="text-right py-2 px-3 font-medium text-br-text-secondary whitespace-nowrap">
                            {EVENT_LABELS[e]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.timeline.slice(-14).map((day: any) => (
                        <tr key={day.date} className="border-b border-br-border hover:bg-br-light/50">
                          <td className="py-2 pr-4 text-br-text-secondary">{day.date}</td>
                          {Object.keys(EVENT_LABELS).filter((e) => data.timeline.some((d: any) => d[e])).map((e) => {
                            const val = day[e] || 0;
                            return (
                              <td key={e} className={`text-right py-2 px-3 font-medium font-mono-data ${val > 0 ? "text-br-dark" : "text-br-text-secondary/40"}`}>
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ── */

function KPICard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 text-br-text-secondary mb-2">
          {icon}
          <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
        </div>
        <p className="text-2xl font-bold font-mono-data">{value}</p>
        <p className="text-xs text-br-text-secondary mt-1">{sub}</p>
      </CardContent>
    </Card>
  );
}

function RevenueStat({ label, value, positive, negative }: { label: string; value: string; positive?: boolean; negative?: boolean }) {
  return (
    <div className="text-center p-4 rounded-lg bg-br-light">
      <p className="text-xs text-br-text-secondary mb-1">{label}</p>
      <p className={`text-xl font-bold font-mono-data ${positive ? "text-br-success" : negative ? "text-br-error" : "text-br-dark"}`}>{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-sm text-br-text-secondary text-center py-8">{text}</p>;
}