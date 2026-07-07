"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Building2,
  Target,
  Mail,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { analytics } from "@/lib/analytics";
import { trackEvent } from "@/lib/analytics";

const placeholderStudies = [
  {
    companyType: "8(a) Technology Firm",
    challenge: "Manual RFP review bottleneck",
    expectedResult: "80% reduction in analysis time",
    icon: Building2,
  },
  {
    companyType: "HUBZone Construction Company",
    challenge: "Missed compliance requirements",
    expectedResult: "95% compliance score on first proposal",
    icon: Building2,
  },
  {
    companyType: "SDVOSB Healthcare IT",
    challenge: "Limited proposal capacity",
    expectedResult: "3x more proposals submitted per quarter",
    icon: Building2,
  },
];

export default function CaseStudiesPage() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    trackEvent("case_studies_page_view", { category: "growth" });
  }, []);

  const handleNotify = () => {
    if (!email.trim()) {
      setEmailError("Please enter your email address.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    analytics.caseStudySubmissionStart();
    setEmailSent(true);
    analytics.caseStudySubmissionComplete();
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-br-accent/20 text-br-accent border-br-accent/30 hover:bg-br-accent/25 text-sm font-semibold px-4 py-1.5 mb-5">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            Coming Soon
          </Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Success Stories
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Real results from federal contractors using BidRank. We&apos;re
            collecting data now — be the first to read these stories.
          </p>
        </div>
      </section>

      {/* Placeholder Cards */}
      <section className="bg-br-surface py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {placeholderStudies.map((study) => {
              const Icon = study.icon;
              return (
                <Card
                  key={study.companyType}
                  className="bg-br-surface border-br-border rounded-xl shadow-br-sm opacity-70 hover:opacity-90 transition-opacity duration-300 overflow-hidden cursor-pointer"
                  onClick={() => analytics.caseStudyCardClick(study.companyType)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-br-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4.5 h-4.5 text-br-primary" />
                        </div>
                        <CardTitle className="font-heading text-lg font-bold text-br-primary leading-tight">
                          {study.companyType}
                        </CardTitle>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 shrink-0 text-xs font-semibold whitespace-nowrap">
                        <Clock className="w-3 h-3 mr-1" />
                        Coming Q3 2026
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-br-text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-br-text-secondary uppercase tracking-wider">
                            Challenge
                          </p>
                          <p className="text-sm text-br-text-secondary mt-0.5">
                            {study.challenge}
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Target className="w-4 h-4 text-br-text-secondary mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-br-text-secondary uppercase tracking-wider">
                            Expected Result
                          </p>
                          <p className="text-sm text-br-text-secondary mt-0.5">
                            {study.expectedResult}
                          </p>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <section className="bg-br-light py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-br-primary/10 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-br-primary" />
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-3">
            Be the First to Read These Stories
          </h2>
          <p className="text-sm text-br-text-secondary mb-6 max-w-md mx-auto">
            Notify me when case studies are published
          </p>

          {!emailSent ? (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                className="flex-1 h-11"
              />
              <Button
                onClick={handleNotify}
                disabled={!email.trim()}
                className="bg-br-primary hover:bg-br-secondary text-white font-medium h-11 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Mail className="w-4 h-4 mr-2" />
                Notify Me
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-br-success bg-br-success/5 rounded-lg py-3 px-4 max-w-md mx-auto">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">
                You&apos;re on the list! We&apos;ll email you when case studies
                are published.
              </span>
            </div>
          )}

          {emailError && (
            <p className="text-xs text-br-error mt-2 flex items-center justify-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {emailError}
            </p>
          )}

          <p className="text-xs text-br-text-secondary mt-3">
            We won&apos;t spam you. One email when stories go live.
          </p>
        </div>
      </section>
    </div>
  );
}