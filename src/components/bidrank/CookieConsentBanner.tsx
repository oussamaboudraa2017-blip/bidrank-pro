"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "bidrank_cookie_consent";

function getConsent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CONSENT_KEY);
}

function setConsent(value: string) {
  localStorage.setItem(CONSENT_KEY, value);
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const consent = getConsent();
    if (!consent) {
      // Show banner after a short delay so it doesn't flash on load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    setConsent("accepted-all");
    setVisible(false);
  };

  const handleAcceptNecessary = () => {
    setConsent("accepted-necessary");
    setVisible(false);
  };

  const handleSavePreferences = () => {
    const value = analytics ? "accepted-all" : "accepted-necessary";
    setConsent(value);
    setShowManage(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <div className="bg-br-surface border border-br-border shadow-br-xl rounded-xl p-5 sm:p-6">
          {/* Top row */}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-br-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <Cookie className="w-5 h-5 text-br-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading text-sm font-semibold text-br-dark">
                We value your privacy
              </h3>
              <p className="text-xs text-br-text-secondary mt-1 leading-relaxed">
                We use cookies for essential functionality (sign-in, security) and
                internal analytics to improve BidRank. We don&apos;t use
                advertising cookies or sell your data.{" "}
                <Link
                  href="/cookies"
                  className="text-br-primary hover:underline whitespace-nowrap"
                >
                  Learn more
                </Link>
              </p>
            </div>
            <button
              onClick={() => {
                setVisible(false);
                setConsent("dismissed");
              }}
              aria-label="Close cookie banner"
              className="text-br-text-secondary hover:text-br-text-secondary transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Manage preferences */}
          {showManage && (
            <div className="mt-4 ml-12 p-3 bg-br-light rounded-lg border border-br-border">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-br-dark">
                    Internal Analytics
                  </span>
                  <p className="text-xs text-br-text-secondary mt-0.5">
                    Help us understand how the platform is used (no personal data shared)
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={analytics}
                  aria-label="Toggle internal analytics cookies"
                  onClick={() => setAnalytics(!analytics)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ml-4 ${
                    analytics ? "bg-br-primary" : "bg-br-light"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-br-surface transition-transform ${
                      analytics ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-4 ml-12 flex-wrap">
            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="bg-br-primary hover:bg-br-primary/90 text-white min-h-[44px] px-4 text-xs"
            >
              Accept All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAcceptNecessary}
              className="border-br-border text-br-text-secondary hover:bg-br-light min-h-[44px] px-4 text-xs"
            >
              Essential Only
            </Button>
            <button
              onClick={() => setShowManage(!showManage)}
              aria-expanded={showManage}
              className="text-xs text-br-secondary hover:underline"
            >
              {showManage ? "Hide preferences" : "Manage preferences"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}