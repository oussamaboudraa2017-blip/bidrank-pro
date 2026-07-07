"use client";

import { useState } from "react";
import { Mail, Loader2, Check, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { analytics } from "@/lib/analytics";

interface NewsletterSubscribeProps {
  variant?: "footer" | "sidebar" | "inline" | "hero" | "post_footer" | "free_tool";
  source?: string;
  className?: string;
}

export function NewsletterSubscribe({
  variant = "footer",
  source = "footer",
  className = "",
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });

      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        analytics.newsletterSignup(source);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    if (variant === "hero") {
      return (
        <div className={`text-center ${className}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Check className="h-6 w-6 text-green-400" />
            <span className="text-white font-heading text-lg font-bold">
              You&apos;re in!
            </span>
          </div>
          <p className="text-white/70 text-sm">
            Check your inbox Tuesday for your first issue.
          </p>
        </div>
      );
    }
    if (variant === "post_footer" || variant === "free_tool") {
      return (
        <div className={`text-center ${className}`}>
          <div className="flex items-center justify-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg py-3 px-4 mb-2">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">
              You&apos;re subscribed! Check your inbox Tuesday.
            </span>
          </div>
        </div>
      );
    }
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <Check className="h-4 w-4 text-green-500" />
        <span className="text-green-600 font-medium">You&apos;re subscribed!</span>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  HERO — Large homepage / section CTA                                */
  /* ------------------------------------------------------------------ */
  if (variant === "hero") {
    return (
      <section className={`relative overflow-hidden bg-br-primary ${className}`}>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-br-accent" />
            <span className="text-br-accent font-medium text-sm uppercase tracking-widest">
              Free Weekly Newsletter
            </span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl md:text-4xl leading-tight">
            Get Federal Opportunities Delivered Weekly
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70 text-base sm:text-lg">
            3 SAM.gov opportunities, 1 actionable tip, 1 feature spotlight.
            Every Tuesday.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              placeholder="you@company.com"
              required
              aria-label="Email for GovCon Insider newsletter"
              className="w-full sm:flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-br-accent/50 focus:border-br-accent/50"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto shrink-0 bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold px-6 py-3"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Subscribe <ArrowRight className="ml-1.5 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          {error && (
            <p className="text-xs text-red-400 mt-3">{error}</p>
          )}
          <p className="mt-4 text-xs text-white/40">
            No spam. Unsubscribe anytime.
          </p>
          <p className="mt-2 text-sm text-white/50">
            Join 500+ contractors getting insider insights
          </p>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  POST_FOOTER — Blog post inline after article                       */
  /* ------------------------------------------------------------------ */
  if (variant === "post_footer") {
    return (
      <div className={`bg-br-light border border-br-border rounded-xl p-6 md:p-8 text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-br-primary" />
          <h3 className="font-heading font-bold text-br-primary text-lg">
            Loved this article? Get more like it weekly.
          </h3>
        </div>
        <p className="text-sm text-br-text-secondary mb-5 max-w-md mx-auto">
          3 SAM.gov opportunities, 1 actionable tip, 1 feature spotlight.
          Every Tuesday.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="you@company.com"
            required
            aria-label="Email for GovCon Insider newsletter"
            className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-br-border bg-br-surface text-sm focus:outline-none focus:ring-2 focus:ring-br-accent/50"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold px-5 py-2.5 shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Mail className="h-4 w-4 mr-1.5" /> Subscribe
              </>
            )}
          </Button>
        </form>
        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        <p className="text-xs text-br-text-secondary mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  FREE_TOOL — After analysis results on free tool page               */
  /* ------------------------------------------------------------------ */
  if (variant === "free_tool") {
    return (
      <div className={`bg-br-primary rounded-xl p-6 md:p-8 text-center ${className}`}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Mail className="h-5 w-5 text-br-accent" />
          <h3 className="font-heading font-bold text-white text-lg">
            Want opportunities matched to your profile?
          </h3>
        </div>
        <p className="text-sm text-white/70 mb-5 max-w-md mx-auto">
          Subscribe to GovCon Insider and get 3 curated SAM.gov opportunities,
          plus tips and feature updates every Tuesday.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="you@company.com"
            required
            aria-label="Email for GovCon Insider newsletter"
            className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-br-accent/50"
          />
          <Button
            type="submit"
            disabled={loading}
            className="bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold px-5 py-2.5 shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Subscribe <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        <p className="text-xs text-white/40 mt-3">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  SIDEBAR — Sticky blog sidebar (desktop)                            */
  /* ------------------------------------------------------------------ */
  if (variant === "sidebar") {
    return (
      <div className={`bg-br-light border border-br-border rounded-xl p-5 ${className}`}>
        <div className="flex items-center gap-2 mb-1">
          <Mail className="h-5 w-5 text-br-primary" />
          <h3 className="font-heading font-bold text-br-dark text-sm">
            GovCon Insider
          </h3>
        </div>
        <p className="text-xs text-br-text-secondary mb-1">
          3 SAM.gov opportunities, 1 actionable tip, 1 feature spotlight.
          Every Tuesday.
        </p>
        <p className="text-xs text-br-text-secondary mb-4">
          Join 500+ contractors getting insider insights.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            placeholder="you@company.com"
            required
            aria-label="Email for newsletter"
            className="w-full px-3 py-2 rounded-lg border border-br-border bg-br-surface text-sm focus:outline-none focus:ring-2 focus:ring-br-accent/50"
          />
          <Button
            type="submit"
            disabled={loading}
            size="sm"
            className="w-full bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
        {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
        <p className="text-xs text-br-text-secondary mt-2">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  FOOTER — Compact form for footer                                   */
  /* ------------------------------------------------------------------ */
  if (variant === "footer") {
    return (
      <div className={className}>
        <h4 className="font-heading text-sm font-semibold text-white uppercase tracking-wider mb-3">
          GovCon Insider Newsletter
        </h4>
        <p className="text-xs text-white/70 mb-3">
          3 SAM.gov opportunities, 1 tip, 1 feature spotlight. Every Tuesday.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
            aria-label="Email for newsletter"
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm placeholder:text-br-text-secondary focus:outline-none focus:ring-2 focus:ring-br-accent/50"
          />
          <Button
            type="submit"
            disabled={loading}
            size="sm"
            className="bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mail className="h-4 w-4" />
            )}
          </Button>
        </form>
        {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
      </div>
    );
  }

  /* ------------------------------------------------------------------ */
  /*  INLINE — Simple horizontal form                                    */
  /* ------------------------------------------------------------------ */
  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        aria-label="Email for newsletter"
        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-br-border bg-br-surface text-sm focus:outline-none focus:ring-2 focus:ring-br-accent/50"
      />
      <Button
        type="submit"
        disabled={loading}
        size="sm"
        className="bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold shrink-0"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Subscribe"
        )}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}