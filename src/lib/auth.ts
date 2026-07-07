/**
 * Plan-based limits for rate limiting RFP analysis.
 */

export interface PlanLimits {
  maxAnalysesPerMonth: number
  maxFileSizeKB: number
  maxTextLength: number
}

const PLAN_CONFIG: Record<string, PlanLimits> = {
  free: {
    maxAnalysesPerMonth: 3,
    maxFileSizeKB: 500,
    maxTextLength: 50_000,
  },
  starter: {
    maxAnalysesPerMonth: 15,
    maxFileSizeKB: 2_000,
    maxTextLength: 100_000,
  },
  pro: {
    maxAnalysesPerMonth: 50,
    maxFileSizeKB: 5_000,
    maxTextLength: 200_000,
  },
  studio: {
    maxAnalysesPerMonth: 200,
    maxFileSizeKB: 20_000,
    maxTextLength: 500_000,
  },
  enterprise: {
    maxAnalysesPerMonth: 999,
    maxFileSizeKB: 50_000,
    maxTextLength: 1_000_000,
  },
}

export const PLAN_NAMES: Record<string, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  studio: "Studio",
  enterprise: "Enterprise",
}

export const PLAN_PRICES: Record<string, { monthly: number; annual: number }> = {
  free: { monthly: 0, annual: 0 },
  starter: { monthly: 49, annual: 39 },
  pro: { monthly: 149, annual: 119 },
  studio: { monthly: 399, annual: 319 },
  enterprise: { monthly: 0, annual: 0 },
}

/**
 * Returns the plan limits for a given plan tier.
 * Defaults to 'free' if an unknown plan is passed.
 */
export function getPlanLimits(plan?: string | null): PlanLimits {
  const key = plan && PLAN_CONFIG[plan] ? plan : 'free'
  return PLAN_CONFIG[key]
}