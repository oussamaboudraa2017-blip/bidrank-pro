/**
 * Client-side analytics tracking utility.
 * Events are sent fire-and-forget to /api/analytics/track.
 */

type EventCategory = "lifecycle" | "growth" | "product" | "billing" | "general";

interface TrackOptions {
  category?: EventCategory;
  metadata?: Record<string, unknown>;
  path?: string;
}

export function trackEvent(event: string, options?: TrackOptions) {
  // Fire and forget — don't block the UI
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      event,
      category: options?.category || "general",
      metadata: options?.metadata || null,
      path: options?.path || (typeof window !== "undefined" ? window.location.pathname : null),
    }),
  }).catch(() => {
    // Silently fail — analytics should never break the app
  });
}

// ── Pre-defined event helpers ────────────────────────

export const analytics = {
  // Lifecycle
  userSignedUp: (method: string = "email") =>
    trackEvent("user_signed_up", { category: "lifecycle", metadata: { method } }),

  userLoggedIn: (method: string = "email") =>
    trackEvent("user_logged_in", { category: "lifecycle", metadata: { method } }),

  trialStarted: () =>
    trackEvent("trial_started", { category: "lifecycle" }),

  subscriptionStarted: (plan: string, billing: string) =>
    trackEvent("subscription_started", { category: "billing", metadata: { plan, billing } }),

  subscriptionCancelled: (plan: string) =>
    trackEvent("subscription_cancelled", { category: "billing", metadata: { plan } }),

  subscriptionUpgraded: (fromPlan: string, toPlan: string) =>
    trackEvent("subscription_upgraded", { category: "billing", metadata: { fromPlan, toPlan } }),

  // Product
  freeToolUsed: () =>
    trackEvent("free_tool_used", { category: "product" }),

  analysisStarted: () =>
    trackEvent("analysis_started", { category: "product" }),

  analysisCompleted: (score?: number) =>
    trackEvent("analysis_completed", { category: "product", metadata: { score } }),

  analysisExported: (format?: string) =>
    trackEvent("analysis_exported", { category: "product", metadata: { format } }),

  // Growth
  referralLinkClicked: (code: string) =>
    trackEvent("referral_link_clicked", { category: "growth", metadata: { referralCode: code } }),

  referralConverted: (code: string) =>
    trackEvent("referral_converted", { category: "growth", metadata: { referralCode: code } }),

  blogArticleRead: (slug: string) =>
    trackEvent("blog_article_read", { category: "growth", metadata: { slug } }),

  caseStudyViewed: (slug: string) =>
    trackEvent("case_study_viewed", { category: "growth", metadata: { slug } }),

  pricingPageViewed: () =>
    trackEvent("pricing_page_viewed", { category: "growth" }),

  freeToolToSignupConversion: () =>
    trackEvent("free_tool_to_signup_conversion", { category: "growth" }),

  // ── Newsletter (Section 7) ────────────────────────
  newsletterSignup: (source: string) =>
    trackEvent("newsletter_signup", { category: "growth", metadata: { source } }),

  // ── Blog (Section 7) ─────────────────────────────
  blogListingViewed: () =>
    trackEvent("blog_listing_viewed", { category: "growth" }),

  blogCategoryFiltered: (category: string) =>
    trackEvent("blog_category_filter", { category: "growth", metadata: { category } }),

  blogSearchUsed: (query: string) =>
    trackEvent("blog_search", { category: "growth", metadata: { query: query.substring(0, 100) } }),

  blogPostScrollDepth: (slug: string, depth: number) =>
    trackEvent("blog_post_scroll_depth", { category: "growth", metadata: { slug, depth: `${depth}%` } }),

  blogCtaClick: (slug: string, cta: string) =>
    trackEvent("blog_cta_click", { category: "growth", metadata: { slug, cta } }),

  blogEmailCapture: (source: string) =>
    trackEvent("blog_email_capture", { category: "growth", metadata: { source } }),

  // ── Case Studies (Section 7) ──────────────────────
  caseStudyCardClick: (studyType: string) =>
    trackEvent("case_study_card_click", { category: "growth", metadata: { studyType } }),

  caseStudySubmissionStart: () =>
    trackEvent("case_study_submission_start", { category: "growth" }),

  caseStudySubmissionComplete: () =>
    trackEvent("case_study_submission_complete", { category: "growth" }),

  // ── Funnel (Section 7.2) ─────────────────────────
  signupPageViewed: (hasReferralCode: boolean) =>
    trackEvent("signup_page_viewed", { category: "lifecycle", metadata: { hasReferralCode } }),

  signupAttempted: (method: string) =>
    trackEvent("signup_attempted", { category: "lifecycle", metadata: { method } }),

  signupFailed: (method: string, error: string) =>
    trackEvent("signup_failed", { category: "lifecycle", metadata: { method, error: error.substring(0, 200) } }),

  dashboardViewed: (plan: string, totalAnalyses: number) =>
    trackEvent("dashboard_viewed", { category: "product", metadata: { plan, totalAnalyses } }),

  homepageViewed: () =>
    trackEvent("homepage_viewed", { category: "growth" }),
};