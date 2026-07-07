"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Star, MessageSquare, Send } from "lucide-react";

interface NpsSurveyProps {
  userId: string;
  totalAnalyses: number;
}

export function NpsSurvey({ userId, totalAnalyses }: NpsSurveyProps) {
  const [visible, setVisible] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (totalAnalyses < 3) return;
    const key = `bidrank_nps_dismissed_${userId}`;
    if (localStorage.getItem(key)) return;
    // Show after a short delay
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [totalAnalyses, userId]);

  const handleSubmit = async () => {
    if (score === null) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nps",
          score,
          comment: comment || "No comment",
          page: "/dashboard",
        }),
      });
      setSubmitted(true);
      const key = `bidrank_nps_dismissed_${userId}`;
      localStorage.setItem(key, "1");
    } catch {
      // silent
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    const key = `bidrank_nps_dismissed_${userId}`;
    localStorage.setItem(key, "1");
  };

  if (!visible || dismissed) return null;

  return (
    <div
      role="dialog"
      aria-label="Quick feedback survey"
      className="fixed bottom-20 right-4 z-50 w-80 rounded-xl border border-br-border bg-br-surface shadow-br-xl animate-in slide-in-from-bottom-4 fade-in duration-300 sm:bottom-6"
    >
      <div className="p-5">
        {/* Close */}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss survey"
          className="absolute top-3 right-3 text-br-text-secondary hover:text-br-dark transition-colors"
        >
          <X className="size-4" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="size-4 text-br-accent" />
              <h3 className="text-sm font-semibold font-heading text-br-dark">Quick question</h3>
            </div>
            <p className="text-sm text-br-text-secondary mb-4">
              On a scale of 0-10, how likely are you to recommend BidRank to a colleague?
            </p>

            {/* Score buttons */}
            <div className="flex gap-1 mb-4 flex-wrap">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setScore(i)}
                  className={`flex size-8 items-center justify-center rounded-md text-xs font-medium font-mono-data transition-colors ${
                    score === i
                      ? i <= 6
                        ? "bg-br-error text-white"
                        : i <= 8
                          ? "bg-br-warning text-white"
                          : "bg-br-success text-white"
                      : i <= 6
                        ? "bg-br-error/10 text-br-error hover:bg-br-error/20"
                        : i <= 8
                          ? "bg-br-warning/10 text-br-warning hover:bg-br-warning/20"
                          : "bg-br-success/10 text-br-success hover:bg-br-success/20"
                  }`}
                  aria-label={`Rate ${i}`}
                >
                  {i}
                </button>
              ))}
            </div>

            {/* Comment (shown after score) */}
            {score !== null && (
              <>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={score >= 9 ? "What do you love most? (optional)" : score >= 7 ? "What could we improve? (optional)" : "We'd love to hear how we can do better."}
                  aria-label="Additional feedback"
                  className="w-full rounded-xl border border-br-border bg-br-surface px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-br-primary focus-visible:ring-offset-2 min-h-[72px] mb-3"
                />
                <Button
                  onClick={handleSubmit}
                  variant="secondary"
                  className="w-full font-medium min-h-[44px]"
                >
                  <Send className="size-3.5 mr-1.5" />
                  Submit Feedback
                </Button>
              </>
            )}
          </>
        ) : (
          <div className="text-center py-2">
            <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-br-success/10 mb-3">
              <Star className="size-5 text-br-accent" />
            </div>
            <p className="text-sm font-semibold font-heading text-br-dark">Thanks for your feedback!</p>
            <p className="text-xs text-br-text-secondary mt-1">
              Your input helps us build a better product.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}