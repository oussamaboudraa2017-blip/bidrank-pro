"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MessageSquare,
  Mail,
  Clock,
  BookOpen,
  Video,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Zap,
  ShieldCheck,
  Lightbulb,
  ExternalLink,
  Bug,
  Star,
} from "lucide-react";

const faqCategories = [
  {
    title: "Getting Started",
    icon: Zap,
    items: [
      {
        q: "How do I analyze my first RFP?",
        a: "Go to the Free Tool page or your Dashboard and upload a PDF, DOCX, or XLSX file. You can also paste RFP text directly. Our AI will analyze it in under 3 minutes and return compliance checks, risk scores, and actionable recommendations.",
      },
      {
        q: "Do I need to create an account to try BidRank?",
        a: "No. The free tool at bidrank.pro/free-tool works without any account. You get 3 free analyses per month as a registered user, with additional features like saved history and export.",
      },
      {
        q: "What file formats are supported?",
        a: "BidRank supports PDF, DOCX, XLSX, and CSV files up to 50MB (200 pages on Pro plan). You can also paste raw text directly into the analyzer.",
      },
      {
        q: "How accurate is the AI analysis?",
        a: "BidRank's AI models are trained exclusively on federal contracting data, including FAR/DFARS regulations, SAM.gov listings, and thousands of real RFPs. The analysis identifies compliance requirements, risk factors, and bid readiness indicators. It's a decision-support tool — always verify critical findings with your proposal team.",
      },
    ],
  },
  {
    title: "Plans & Billing",
    icon: ShieldCheck,
    items: [
      {
        q: "What's included in the free plan?",
        a: "The free plan includes 3 RFP analyses per month, basic compliance checks, a bid readiness score, and access to the free tool. No credit card required.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You can cancel your subscription at any time from your FastSpring management portal. Your access continues until the end of your current billing period. No penalties, no questions asked.",
      },
      {
        q: "Is there a money-back guarantee?",
        a: "Yes. All paid plans include a 30-day money-back guarantee. If BidRank doesn't meet your expectations, contact support@bidrank.pro within 30 days of purchase for a full refund.",
      },
      {
        q: "What happens when my trial ends?",
        a: "After your 14-day trial, you'll be moved to the free plan automatically. Your analysis history is preserved — upgrade anytime to regain full access.",
      },
      {
        q: "How do I get the founding member 50% discount?",
        a: "The founding member discount is locked in when you subscribe during the first 100 members. Once you have it, it never expires — even after the 100 spots are filled.",
      },
    ],
  },
  {
    title: "Features & Tools",
    icon: Lightbulb,
    items: [
      {
        q: "What is the Bid Readiness Score?",
        a: "The Bid Readiness Score is a weighted indicator (0-100) based on 12 factors including past performance, compliance coverage, risk level, and requirement completeness. It's designed to help you make an honest go/no-go decision — not to predict outcomes.",
      },
      {
        q: "What compliance requirements does BidRank check?",
        a: "BidRank covers 50+ common FAR/DFARS clauses including Section 508 accessibility, small business subcontracting plans, security clearances, insurance requirements, and reporting obligations. It also checks set-aside eligibility based on your certifications.",
      },
      {
        q: "Can I share analysis results with my team?",
        a: "Yes. Pro and Studio plans include team collaboration features. You can also generate a shareable link (no login required) for any analysis from the free tool.",
      },
      {
        q: "Does BidRank replace my proposal writer?",
        a: "No. BidRank is an analysis and decision-support tool. It helps you understand the RFP, identify risks, and assess your readiness — but it doesn't write proposals. Think of it as your AI proposal teammate that handles the heavy lifting.",
      },
    ],
  },
  {
    title: "Troubleshooting",
    icon: HelpCircle,
    items: [
      {
        q: "My upload is failing. What should I do?",
        a: "Make sure your file is under 50MB and in a supported format (PDF, DOCX, XLSX, CSV). If the file is scanned (image-based PDF), the text extraction may fail — try a text-based PDF. If issues persist, contact support with the file name and error message.",
      },
      {
        q: "The analysis seems incomplete. Why?",
        a: "Very short RFPs or excerpts may produce limited analysis. For best results, upload the full solicitation including all sections, attachments, and amendments. If you pasted text, make sure all sections are included.",
      },
      {
        q: "I forgot my password. How do I reset it?",
        a: "Go to the sign-in page and click 'Forgot password.' Enter your email and you'll receive a reset link. If you don't see the email within 5 minutes, check your spam folder or contact support.",
      },
    ],
  },
];

const videoTutorials = [
  { title: "How to Upload and Analyze Your First RFP", duration: "2:30", level: "Beginner" },
  { title: "Understanding Your Bid Readiness Score", duration: "3:15", level: "Beginner" },
  { title: "How to Use the Compliance Checklist", duration: "2:45", level: "Beginner" },
  { title: "Reading the Risk Assessment Report", duration: "4:00", level: "Intermediate" },
  { title: "Exporting and Sharing Analysis Reports", duration: "2:00", level: "Beginner" },
  { title: "Setting Up Team Collaboration", duration: "3:30", level: "Intermediate" },
];

export default function SupportPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactType, setContactType] = useState<"bug" | "feature" | "general">("general");

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const filteredCategories = faqCategories
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !searchQuery ||
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: contactType === "bug" ? "bug_report" : contactType === "feature" ? "feature_request" : "nps",
          title: contactForm.subject,
          comment: contactForm.message,
          email: contactForm.email,
          page: "/support",
        }),
      });
      setContactSubmitted(true);
    } catch {
      // silent
    }
  };

  return (
    <div className="min-h-screen bg-br-surface">
      {/* Header */}
      <section aria-label="Support hero" className="bg-br-primary">
        <div className="mx-auto max-w-5xl px-6 py-16 text-center">
          <h1 className="font-heading text-3xl font-bold text-white md:text-4xl">
            How Can We Help?
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-br-text-secondary">
            Search our knowledge base, browse FAQs, or reach out directly.
            We're real contractors who've won federal contracts — not a call center.
          </p>

          {/* Search */}
          <div className="relative mx-auto mt-8 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-br-text-secondary" />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search frequently asked questions"
              className="pl-12 h-12 text-base rounded-xl border-0 bg-br-surface shadow-lg focus-visible:ring-2 focus-visible:ring-br-accent"
            />
          </div>

          {/* Support tier badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-br-text-secondary">
              <Mail className="size-4 text-br-accent" />
              Email: Under 24 hours
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-br-text-secondary">
              <Zap className="size-4 text-br-accent" />
              Starter+: Under 4 hours
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-sm text-br-text-secondary">
              <BookOpen className="size-4 text-br-accent" />
              Knowledge Base: Instant
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <section aria-label="Frequently asked questions" className="bg-br-light">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto size-12 text-br-text-secondary" />
              <p className="mt-4 text-lg font-medium text-br-dark">No results found</p>
              <p className="mt-2 text-br-text-secondary">
                Try a different search term, or{" "}
                <a href="#contact" className="text-br-primary hover:underline">
                  contact us directly
                </a>.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((cat) => (
                <div key={cat.title}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-br-primary/10">
                      <cat.icon className="size-5 text-br-primary" />
                    </div>
                    <h2 className="font-heading text-xl font-bold text-br-dark">{cat.title}</h2>
                    <span className="text-sm text-br-text-secondary">
                      {cat.items.length} {cat.items.length === 1 ? "article" : "articles"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {cat.items.map((item, idx) => {
                      const key = `${cat.title}-${idx}`;
                      const isOpen = openItems.has(key);
                      return (
                        <div
                          key={key}
                          className="rounded-xl border border-br-border bg-br-surface overflow-hidden"
                        >
                          <button
                            onClick={() => toggleItem(key)}
                            className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-br-light/50 transition-colors min-h-[44px]"
                            aria-expanded={isOpen}
                          >
                            <span className="text-sm font-medium text-br-dark">{item.q}</span>
                            {isOpen ? (
                              <ChevronUp className="size-4 flex-shrink-0 text-br-text-secondary" />
                            ) : (
                              <ChevronDown className="size-4 flex-shrink-0 text-br-text-secondary" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="px-6 pb-4 -mt-1">
                              <p className="text-sm leading-relaxed text-br-text-secondary">{item.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Video Tutorials */}
      <section aria-label="Video tutorials" className="bg-br-surface">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="text-center mb-10">
            <Badge className="bg-br-accent/15 text-br-dark border-br-accent/30 text-xs font-medium mb-4 px-3 py-1">
              Coming Soon
            </Badge>
            <h2 className="font-heading text-2xl font-bold text-br-dark md:text-3xl">
              Video Tutorial Library
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-br-text-secondary">
              Step-by-step walkthroughs for every BidRank feature. From your first upload to advanced team workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videoTutorials.map((video) => (
              <div
                key={video.title}
                className="group flex flex-col rounded-xl border border-br-border bg-br-light/50 p-5 transition-all hover:shadow-br-md hover:border-br-accent/30"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-br-primary/10 mb-4">
                  <Video className="size-6 text-br-primary" />
                </div>
                <h3 className="font-heading text-sm font-semibold text-br-dark leading-snug">{video.title}</h3>
                <div className="mt-auto flex items-center gap-3 pt-3">
                  <span className="flex items-center gap-1 text-xs text-br-text-secondary">
                    <Clock className="size-3" /> {video.duration}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-2 py-0">
                    {video.level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center text-sm text-br-text-secondary">
            Videos are being recorded and will be available soon. For now, check our{" "}
            <a href="https://www.bidrank.pro/blog" className="text-br-primary hover:underline">
              blog
            </a>{" "}
            for written guides.
          </p>
        </div>
      </section>

      {/* Contact / Feedback Form */}
      <section id="contact" aria-label="Contact support" className="bg-br-light">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="font-heading text-center text-2xl font-bold text-br-dark md:text-3xl">
            Still Need Help?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-br-text-secondary">
            Reach out and a real person will get back to you. Average response: under 4 hours for paid plans, under 24 hours for free.
          </p>

          {contactSubmitted ? (
            <div className="mt-10 rounded-2xl border border-br-success/30 bg-br-surface p-10 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-br-success/10">
                <Send className="size-6 text-br-success" />
              </div>
              <h3 className="font-heading mt-4 text-lg font-semibold text-br-dark">Message Sent!</h3>
              <p className="mt-2 text-sm text-br-text-secondary">
                We'll get back to you within 24 hours. For faster support, upgrade to a paid plan.
              </p>
              <p className="mt-1 text-sm text-br-text-secondary">
                You can also email us directly at{" "}
                <a href="mailto:support@bidrank.pro" className="text-br-primary hover:underline">
                  support@bidrank.pro
                </a>.
              </p>
            </div>
          ) : (
            <div className="mt-10 rounded-2xl bg-br-surface border border-br-border p-6 sm:p-10 shadow-br-sm">
              {/* Type selector */}
              <div className="flex flex-wrap gap-3 mb-8">
                {([
                  { value: "general" as const, label: "General Question", icon: MessageSquare },
                  { value: "bug" as const, label: "Report a Bug", icon: Bug },
                  { value: "feature" as const, label: "Request a Feature", icon: Star },
                ]).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setContactType(opt.value)}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
                      contactType === opt.value
                        ? "border-br-primary bg-br-primary/5 text-br-primary"
                        : "border-br-border text-br-text-secondary hover:border-br-border"
                    }`}
                  >
                    <opt.icon className="size-4" />
                    {opt.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleContact} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-br-dark mb-1.5">
                      Name
                    </label>
                    <Input
                      id="contact-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      required
                      placeholder="Your name"
                      className="h-11"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-br-dark mb-1.5">
                      Email
                    </label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      required
                      placeholder="you@company.com"
                      className="h-11"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-br-dark mb-1.5">
                    Subject
                  </label>
                  <Input
                    id="contact-subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    required
                    placeholder="Brief description of your question"
                    className="h-11"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-br-dark mb-1.5">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    required
                    rows={5}
                    placeholder="Tell us more about what you need..."
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-br-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-br-primary focus-visible:ring-offset-2 resize-y min-h-[100px]"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    type="submit"
                    className="bg-br-primary text-white hover:bg-br-primary/90 font-semibold min-h-[44px] px-6"
                  >
                    <Send className="size-4 mr-2" />
                    Send Message
                  </Button>
                  <span className="text-xs text-br-text-secondary">
                    Or email{" "}
                    <a href="mailto:support@bidrank.pro" className="text-br-primary hover:underline">
                      support@bidrank.pro
                    </a>{" "}
                    directly
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}