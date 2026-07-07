"use client";

import { useState } from "react";
import { Mail, CheckCircle, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PdfDownloadCard() {
  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-br-accent/10 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-br-accent" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold font-heading text-br-primary mb-1">
              Download the Checklist
            </h3>
            <p className="text-sm text-br-dark/60">
              Get a printable PDF version of this compliance checklist. Keep it
              on your desk for every proposal.
            </p>
          </div>
          <Button
            onClick={() => window.print()}
            className="shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function EmailSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const isFormVisible = status !== "sent";

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "blog_govcon_insider" }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <Card>
      <CardContent className="p-6 md:p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mx-auto w-12 h-12 rounded-full bg-br-primary/10 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-br-primary" />
          </div>
          <h3 className="text-lg font-bold font-heading text-br-primary mb-2">
            Get GovCon Insights Weekly
          </h3>
          <p className="text-sm text-br-text-secondary mb-5">
            Join 2,000+ federal contractors. Get RFP tips, compliance updates,
            and AI insights every Thursday.
          </p>

          {isFormVisible ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                aria-label="Email address for GovCon Insider newsletter"
                className="flex-1 h-11"
              />
              <Button
                onClick={handleSubscribe}
                disabled={!email.trim() || status === "sending"}
                variant="secondary"
                className="h-11 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {status === "sending" ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-br-success bg-br-success/10 rounded-lg py-3 px-4">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                You&apos;re subscribed! Check your inbox for a welcome email.
              </span>
            </div>
          )}

          {status === "error" && (
            <p className="text-xs text-br-error mt-2">Something went wrong. Please try again.</p>
          )}

          <p className="text-xs text-br-text-secondary mt-3">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}