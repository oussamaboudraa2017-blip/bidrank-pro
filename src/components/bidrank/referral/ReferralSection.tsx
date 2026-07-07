"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Gift,
  Copy,
  Check,
  ExternalLink,
  Clock,
  DollarSign,
  Users,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analytics } from "@/lib/analytics";

interface ReferralStats {
  referralCode: string | null;
  referralLink: string | null;
  totalCredits: number;
  totalReferrals: number;
  pendingReferrals: number;
  activatedReferrals: number;
  referralHistory: Array<{
    id: string;
    status: string;
    reward: string;
    referredEmail: string;
    createdAt: string;
    activatedAt: string | null;
  }>;
}

export default function ReferralSection() {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/referral/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch referral stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/referral/generate", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setStats((prev) => ({
          referralCode: data.referralCode,
          referralLink: data.referralLink,
          totalCredits: prev?.totalCredits ?? 0,
          totalReferrals: prev?.totalReferrals ?? 0,
          pendingReferrals: prev?.pendingReferrals ?? 0,
          activatedReferrals: prev?.activatedReferrals ?? 0,
          referralHistory: prev?.referralHistory ?? [],
        }));
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData.error || "Something went wrong. Try again.");
      }
    } catch (err) {
      console.error("Failed to generate referral code:", err);
      setError("Network error. Check your connection.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (stats?.referralLink) {
      await navigator.clipboard.writeText(stats.referralLink);
      if (stats.referralCode) analytics.referralLinkClicked(stats.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-br-primary" />
        </CardContent>
      </Card>
    );
  }

  // No referral code yet — show generate CTA
  if (!stats?.referralCode) {
    return (
      <Card className="border-br-accent/30">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-br-accent/15">
              <Gift className="h-8 w-8 text-br-accent" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-br-dark">
                Give $25, Get $25
              </h3>
              <p className="mt-1 text-sm text-br-text-secondary max-w-md">
                Share BidRank with colleagues and earn $25 account credit for
                every referral that subscribes. They get $25 off their first
                month too.
              </p>
            </div>
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold"
            >
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Gift className="mr-2 h-4 w-4" />
              )}
              Get Your Referral Link
            </Button>
            {error && (
              <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Referral Link Card */}
      <Card className="border-br-accent/30">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading flex items-center gap-2 text-base">
            <Gift className="h-5 w-5 text-br-accent" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border border-br-border bg-br-light/50 p-2">
            <code className="flex-1 truncate text-sm px-2">
              {stats.referralLink}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-br-dark">
                <DollarSign className="h-4 w-4 text-br-accent" />
                <span className="text-2xl font-bold">
                  ${stats.totalCredits.toFixed(0)}
                </span>
              </div>
              <p className="mt-1 text-xs text-br-text-secondary">
                Credits Earned
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-br-dark">
                <Users className="h-4 w-4 text-br-primary" />
                <span className="text-2xl font-bold">
                  {stats.totalReferrals}
                </span>
              </div>
              <p className="mt-1 text-xs text-br-text-secondary">
                Total Referrals
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-br-dark">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-2xl font-bold">
                  {stats.pendingReferrals}
                </span>
              </div>
              <p className="mt-1 text-xs text-br-text-secondary">Pending</p>
            </div>
          </div>

          <p className="text-xs text-br-text-secondary">
            Credit activates when your referral subscribes to a paid plan for 1+
            month.
          </p>
        </CardContent>
      </Card>

      {/* Referral History */}
      {stats.referralHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-base">Referral History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-br-text-secondary">
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Reward</th>
                    <th className="pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.referralHistory.map((ref) => (
                    <tr key={ref.id} className="border-b last:border-0">
                      <td className="py-2.5">
                        <Badge
                          variant="secondary"
                          className={
                            ref.status === "activated"
                              ? "bg-green-100 text-green-700"
                              : ref.status === "paid_out"
                                ? "bg-blue-100 text-br-text-secondary"
                                : "bg-orange-100 text-orange-700"
                          }
                        >
                          {ref.status === "activated"
                            ? "Activated"
                            : ref.status === "paid_out"
                              ? "Paid Out"
                              : "Pending"}
                        </Badge>
                      </td>
                      <td className="py-2.5 font-medium">{ref.reward}</td>
                      <td className="py-2.5 text-br-text-secondary">
                        {new Date(ref.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}