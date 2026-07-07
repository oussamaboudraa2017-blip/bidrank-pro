import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar, CheckCircle2, Clock, Linkedin, Twitter, PenLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Content Calendar — BidRank Blog",
  description:
    "BidRank's 30-day blog content calendar for federal contracting insights. See upcoming articles, LinkedIn promotion schedule, and publication dates.",
  alternates: {
    canonical: "https://www.bidrank.pro/blog/content-calendar",
  },
  openGraph: {
    title: "Content Calendar — BidRank Blog",
    description:
      "BidRank's 30-day blog content calendar for federal contracting insights.",
    url: "https://www.bidrank.pro/blog/content-calendar",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Content Calendar — BidRank Blog",
    description:
      "BidRank's 30-day blog content calendar for federal contracting insights.",
  },
};

interface CalendarEntry {
  week: string;
  days: string;
  publishDate: string;
  article: {
    title: string;
    slug: string;
    status: "published" | "scheduled" | "planned";
    category: string;
    author: string;
  };
  linkedinPromo: string;
}

const CALENDAR: CalendarEntry[] = [
  {
    week: "Week 1",
    days: "Jul 1 - Jul 7",
    publishDate: "Jul 1",
    article: {
      title: "9 AI Tools Every Federal Contractor Should Know in 2025",
      slug: "federal-contracting-ai-tools-2025-guide",
      status: "published",
      category: "AI & Technology",
      author: "Sarah Mitchell",
    },
    linkedinPromo: "Jul 3 — Share key AI tool categories. Tag Deltek, GovWin communities.",
  },
  {
    week: "Week 1",
    days: "Jul 1 - Jul 7",
    publishDate: "Jul 4",
    article: {
      title: "5 Common Mistakes That Disqualify 90% of Federal Proposals",
      slug: "5-common-mistakes-disqualify-federal-proposals",
      status: "published",
      category: "Proposal Strategy",
      author: "Marcus Chen",
    },
    linkedinPromo: "Jul 5 — Share mistake #1 (evaluation factors). Poll: 'What's your biggest proposal challenge?'",
  },
  {
    week: "Week 2",
    days: "Jul 8 - Jul 14",
    publishDate: "Jul 8",
    article: {
      title: "7 SAM.gov Registration Mistakes That Cost Small Businesses Contracts",
      slug: "sam-gov-registration-mistakes-avoid",
      status: "published",
      category: "Tips & Quick Wins",
      author: "David Okonkwo",
    },
    linkedinPromo: "Jul 10 — Share the quick-action checklist as a standalone carousel post.",
  },
  {
    week: "Week 2",
    days: "Jul 8 - Jul 14",
    publishDate: "Jul 11",
    article: {
      title: "How to Read Section L & M of an RFP in 10 Minutes",
      slug: "how-to-read-rfp-section-l-m-10-minutes",
      status: "published",
      category: "RFP Analysis",
      author: "Sarah Mitchell",
    },
    linkedinPromo: "Jul 12 — Share the 10-minute breakdown graphic. Thread format on Twitter/X.",
  },
  {
    week: "Week 3",
    days: "Jul 15 - Jul 21",
    publishDate: "Jul 15",
    article: {
      title: "How a 12-Person Small Business Won a $3.2M Federal Contract",
      slug: "small-business-won-3m-federal-contract-case-study",
      status: "published",
      category: "Case Studies",
      author: "Marcus Chen",
    },
    linkedinPromo: "Jul 17 — Share key win metrics (40% Technical Approach). Tag HUBZone communities.",
  },
  {
    week: "Week 3",
    days: "Jul 15 - Jul 21",
    publishDate: "Jul 18",
    article: {
      title: "FAR Compliance Checklist for Small Business Contractors",
      slug: "far-compliance-checklist-small-business",
      status: "published",
      category: "Compliance",
      author: "David Okonkwo",
    },
    linkedinPromo: "Jul 19 — Share Phase 2 (proposal compliance) as a downloadable checklist.",
  },
  {
    week: "Week 4",
    days: "Jul 22 - Jul 28",
    publishDate: "Jul 22",
    article: {
      title: "Past Performance in Federal Proposals: The Complete Guide for 2025",
      slug: "past-performance-federal-proposals-complete-guide",
      status: "published",
      category: "Proposal Strategy",
      author: "Marcus Chen",
    },
    linkedinPromo: "Jul 24 — Share the 3 pillars framework. Ask: 'How do you score past performance?'",
  },
  {
    week: "Week 4",
    days: "Jul 22 - Jul 28",
    publishDate: "Jul 25",
    article: {
      title: "RFP Response Timeline: How to Manage Your 30-Day Proposal Sprint",
      slug: "rfp-response-time-management-tips",
      status: "published",
      category: "Tips & Quick Wins",
      author: "Sarah Mitchell",
    },
    linkedinPromo: "Jul 26 — Share the day-by-day infographic. Tag #GovCon and #FederalContracting.",
  },
  {
    week: "Week 4",
    days: "Jul 22 - Jul 28",
    publishDate: "Jul 28",
    article: {
      title: "8(a) Contractor's Guide to Winning Your First Federal Contract",
      slug: "8a-contractors-guide-first-federal-contract",
      status: "published",
      category: "8(a) Program",
      author: "Marcus Chen",
    },
    linkedinPromo: "Jul 29 — Share the TechBridge case study. Tag 8(a) and SBA communities.",
  },
  {
    week: "Week 5",
    days: "Jul 29 - Aug 4",
    publishDate: "Aug 1",
    article: {
      title: "AI vs Manual RFP Analysis: A Time & Cost Breakdown",
      slug: "ai-vs-manual-rfp-analysis-time-cost-breakdown",
      status: "published",
      category: "AI & Technology",
      author: "Sarah Mitchell",
    },
    linkedinPromo: "Aug 2 — Share the ROI comparison chart. Ask: 'How many hours do you spend on RFP analysis per week?'",
  },
];

export default function ContentCalendarPage() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-br-light border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Content Calendar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Page Header */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-br-accent/15 text-br-accent border-br-accent/30 hover:bg-br-accent/20">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Content Calendar
            </Badge>
            <h1 className="text-3xl font-heading font-bold text-br-primary sm:text-4xl">
              30-Day Blog Launch Calendar
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-br-text-secondary">
              Our publication schedule for the first 30 days of the BidRank blog. Each article is paired with a LinkedIn promotion date and strategy.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="text-center p-4 rounded-lg bg-br-light">
              <p className="text-2xl font-bold text-br-primary">{CALENDAR.length}</p>
              <p className="text-xs text-br-text-secondary mt-1">Articles Published</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-br-light">
              <p className="text-2xl font-bold text-br-primary">3</p>
              <p className="text-xs text-br-text-secondary mt-1">Authors</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-br-light">
              <p className="text-2xl font-bold text-br-primary">4</p>
              <p className="text-xs text-br-text-secondary mt-1">Categories</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-br-light">
              <p className="text-2xl font-bold text-br-primary">5</p>
              <p className="text-xs text-br-text-secondary mt-1">Weeks</p>
            </div>
          </div>

          {/* Calendar Entries by Week */}
          {["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"].map((week) => {
            const weekEntries = CALENDAR.filter((e) => e.week === week);
            if (weekEntries.length === 0) return null;

            return (
              <div key={week} className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="text-xl font-heading font-bold text-br-primary">{week}</h2>
                  <span className="text-sm text-br-text-secondary">{weekEntries[0].days}</span>
                </div>

                <div className="space-y-4">
                  {weekEntries.map((entry, idx) => (
                    <Card key={idx} className="bg-br-surface border-br-border rounded-xl shadow-br-sm">
                      <CardContent className="p-5 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          {/* Date Badge */}
                          <div className="flex items-center gap-3 md:flex-col md:items-center md:w-24 shrink-0">
                            <div className="flex items-center justify-center size-10 rounded-full bg-br-primary/10 text-br-primary font-bold text-sm font-mono-data">
                              {entry.publishDate.split(" ")[0]}
                            </div>
                            <span className="text-xs text-br-text-secondary font-mono-data md:hidden">
                              {entry.publishDate.split(" ")[1]}
                            </span>
                          </div>

                          {/* Article Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Badge
                                className="text-xs font-medium bg-br-primary/8 text-br-primary border border-br-primary/15"
                              >
                                {entry.article.category}
                              </Badge>
                              {entry.article.status === "published" && (
                                <span className="flex items-center gap-1 text-xs text-green-600">
                                  <CheckCircle2 className="size-3" />
                                  Live
                                </span>
                              )}
                            </div>

                            {entry.article.status === "published" ? (
                              <Link
                                href={`/blog/${entry.article.slug}`}
                                className="group block"
                              >
                                <h3 className="text-base font-heading font-semibold text-br-primary group-hover:text-br-secondary transition-colors leading-snug">
                                  {entry.article.title}
                                </h3>
                              </Link>
                            ) : (
                              <h3 className="text-base font-heading font-semibold text-br-primary leading-snug">
                                {entry.article.title}
                              </h3>
                            )}

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-br-text-secondary">
                              <span className="flex items-center gap-1">
                                <PenLine className="size-3" />
                                {entry.article.author}
                              </span>
                            </div>
                          </div>

                          {/* LinkedIn Promo */}
                          <div className="md:w-64 shrink-0">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Linkedin className="size-3.5 text-br-secondary" />
                              <span className="text-xs font-medium text-br-text-secondary">Promotion</span>
                            </div>
                            <p className="text-xs text-br-text-secondary leading-relaxed">
                              {entry.linkedinPromo}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}

          {/* LinkedIn Strategy Notes */}
          <Card className="border-l-4 border-l-br-accent bg-br-surface border-br-border rounded-xl shadow-br-sm mt-12">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-lg font-heading font-bold text-br-primary mb-4 flex items-center gap-2">
                <Twitter className="w-5 h-5 text-br-accent" />
                LinkedIn Promotion Strategy
              </h2>
              <div className="space-y-4 text-sm text-br-text-secondary">
                <div>
                  <h3 className="font-heading font-semibold text-br-dark/90 mb-1">Posting Schedule</h3>
                  <p>Each article is promoted on LinkedIn 2 days after publication (Tuesday and Friday for optimal engagement). Posts go live at 9:00 AM Eastern to capture the morning engagement window when federal contractors are most active.</p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-br-dark/90 mb-1">Content Format</h3>
                  <p>LinkedIn posts use a hook-statistic-CTA format: open with a surprising statistic from the article, share 2-3 key takeaways as bullet points, and close with a link to the full article plus a relevant question to drive comments.</p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-br-dark/90 mb-1">Hashtag Strategy</h3>
                  <p>Primary hashtags: #GovCon #FederalContracting #RFP #GovConTips. Secondary: #SmallBusiness #8a #HUBZone #WOSB #SDVOSB. Rotate 3-4 hashtags per post, always including #GovCon and #FederalContracting.</p>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-br-dark/90 mb-1">Engagement Targets</h3>
                  <p>Target 50+ impressions and 5+ engagements per post within the first 48 hours. Respond to all comments within 4 hours. Repurpose high-performing posts as company page articles for extended reach.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}