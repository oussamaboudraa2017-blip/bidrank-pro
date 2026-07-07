"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import type { PlanLimits } from "@/lib/auth";

export interface UserPlanData {
  plan: string | null;
  authenticated: boolean;
  analysesThisMonth: number;
  limits: PlanLimits | null;
  trialEndsAt: string | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

const DEFAULT_DATA: UserPlanData = {
  plan: null,
  authenticated: false,
  analysesThisMonth: 0,
  limits: null,
  trialEndsAt: null,
  subscriptionStatus: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};

export function useUserPlan() {
  const { data: session, isPending } = useSession();
  const isSignedIn = !!session?.user;
  const [data, setData] = useState<UserPlanData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!isSignedIn) {
      setData(DEFAULT_DATA);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user-plan");
      const json = await res.json();
      setData(json);
    } catch {
      setData(DEFAULT_DATA);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const plan = data.plan || "free";

  const isFree = plan === "free";
  const isStarter = plan === "starter";
  const isPro = plan === "pro";
  const isStudio = plan === "studio";
  const isEnterprise = plan === "enterprise";
  const isPaid = !isFree;
  const canExport = !isFree;
  const canAddTeam = isPro || isStudio || isEnterprise;
  const hasReachedLimit =
    data.limits && data.analysesThisMonth >= data.limits.maxAnalysesPerMonth;

  return {
    ...data,
    loading,
    refetch,
    plan,
    isFree,
    isStarter,
    isPro,
    isStudio,
    isEnterprise,
    isPaid,
    canExport,
    canAddTeam,
    hasReachedLimit,
  };
}