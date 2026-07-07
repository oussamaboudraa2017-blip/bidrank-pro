"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lightbulb, X, Send } from "lucide-react";

export function FeatureRequestButton() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "feature_request",
          title: title.trim(),
          comment: description.trim() || "No additional details",
          page: typeof window !== "undefined" ? window.location.pathname : "/dashboard",
        }),
      });
      setSubmitted(true);
    } catch {
      // silent
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5 text-xs"
      >
        <Lightbulb className="size-3.5" />
        Request a Feature
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-label="Feature request form"
            className="w-full max-w-md rounded-2xl bg-br-surface p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-br-accent/15">
                  <Lightbulb className="size-4 text-br-accent" />
                </div>
                <h3 className="text-base font-semibold font-heading text-br-dark">Request a Feature</h3>
              </div>
              <button
                onClick={() => { setOpen(false); setSubmitted(false); setTitle(""); setDescription(""); }}
                aria-label="Close"
                className="text-br-text-secondary hover:text-br-dark transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="size-4" />
              </button>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="fr-title" className="block text-sm font-medium text-br-dark mb-1.5">
                    Feature Title
                  </label>
                  <Input
                    id="fr-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g., Export to Excel"
                    className="h-11"
                  />
                </div>
                <div>
                  <label htmlFor="fr-desc" className="block text-sm font-medium text-br-dark mb-1.5">
                    Description <span className="text-br-text-secondary font-normal">(optional)</span>
                  </label>
                  <textarea
                    id="fr-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us more about what you'd like..."
                    className="w-full rounded-xl border border-br-border bg-br-surface px-3 py-2 text-sm ring-offset-background placeholder:text-br-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-br-primary focus-visible:ring-offset-2 resize-y min-h-[80px]"
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  className="w-full font-medium min-h-[44px]"
                >
                  <Send className="size-3.5 mr-1.5" />
                  Submit Request
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-br-success/10 mb-3">
                  <Send className="size-5 text-br-success" />
                </div>
                <p className="text-sm font-semibold text-br-dark">Request Submitted!</p>
                <p className="text-xs text-br-text-secondary mt-1">
                  We review every request. You'll hear from us if we build it.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}