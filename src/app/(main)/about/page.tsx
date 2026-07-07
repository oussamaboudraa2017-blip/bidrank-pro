import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Minimize2,
  Crosshair,
  HeadphonesIcon,
  ArrowRight,
  Users,
  Target,
  Heart,
} from "lucide-react";

export const metadata = {
  title: "About BidRank | AI-Powered Federal Contracting Tools",
  description:
    "Learn about BidRank's mission to democratize federal contracting for small businesses. Built by contractors, for contractors.",
  openGraph: {
    title: "About BidRank | AI-Powered Federal Contracting Tools",
    description:
      "Learn about BidRank's mission to democratize federal contracting for small businesses. Built by contractors, for contractors.",
    url: "https://www.bidrank.pro/about",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About BidRank | AI-Powered Federal Contracting Tools",
    description:
      "Learn about BidRank's mission to democratize federal contracting for small businesses. Built by contractors, for contractors.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/about",
  },
};

const values = [
  {
    icon: Zap,
    title: "Speed",
    description:
      "Every second counts in GovCon. Our tools deliver actionable analysis in minutes, not days — so you can focus on winning, not waiting.",
  },
  {
    icon: Minimize2,
    title: "Simplicity",
    description:
      "No enterprise bloat, no 90-day onboarding. Sign up, upload an RFP, get answers. That's the whole product.",
  },
  {
    icon: Crosshair,
    title: "Specialization",
    description:
      "We do one thing — federal RFP analysis — and we do it better than generic tools that try to be everything for everyone.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support",
    description:
      "Real humans who understand federal contracting answer your questions. Not a chatbot that tells you to check the FAQ.",
  },
];

const team = [
  {
    name: "The BidRank Founding Team",
    role: "Leadership",
    bio: "Our founders have decades of combined experience in federal contracting, AI/ML engineering, and building products for underserved markets. They've lived the pain of manual RFP review firsthand.",
    initials: "BR",
  },
  {
    name: "GovCon Advisory Board",
    role: "Industry Advisors",
    bio: "A rotating group of active 8(a), HUBZone, SDVOSB, and WOSB contractors who test every feature and keep us honest about what small businesses actually need.",
    initials: "AB",
  },
  {
    name: "Engineering Team",
    role: "Product & Engineering",
    bio: "Former engineers from top AI companies and federal agencies who chose to build for the underdogs instead of the Fortune 500. Every line of code serves a small business mission.",
    initials: "ET",
  },
  {
    name: "Customer Success",
    role: "Support & Onboarding",
    bio: "Real federal contracting professionals — not scripts — who help you get the most from BidRank. They've written proposals, managed compliance, and won contracts themselves.",
    initials: "CS",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Built for the Underdogs
            <br />
            <span className="text-br-accent">of GovCon</span>
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Big contractors have teams of analysts, expensive tools, and
            dedicated proposal shops. Small businesses have{" "}
            <span className="text-white font-medium">you</span>. BidRank levels
            the playing field.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-br-accent/10 text-br-accent text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
                <Target className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-4">
                Democratize Federal Contracting
              </h2>
              <p className="text-br-text-secondary leading-relaxed mb-4">
                The federal government sets aside billions in contracts
                specifically for small businesses. But the tools to find, evaluate,
                and win those contracts have been built for — and priced for —
                the top 1% of contractors.
              </p>
              <p className="text-br-text-secondary leading-relaxed mb-4">
                BidRank exists to change that. We believe an 8(a) firm in rural
                America should have the same analytical firepower as a Tier-1
                defense contractor in the DC beltway.
              </p>
              <p className="text-br-text-secondary leading-relaxed">
                AI makes that possible. We make it accessible.
              </p>
            </div>
            <div className="bg-br-light rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-br-accent">99%</p>
                  <p className="text-sm text-br-text-secondary mt-1">
                    of federal contractors
                  </p>
                  <p className="text-sm text-br-text-secondary">are small businesses</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-br-accent">$150B+</p>
                  <p className="text-sm text-br-text-secondary mt-1">
                    in annual federal set-asides
                  </p>
                  <p className="text-sm text-br-text-secondary">for small biz</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-br-accent">40%</p>
                  <p className="text-sm text-br-text-secondary mt-1">
                    of small contractors
                  </p>
                  <p className="text-sm text-br-text-secondary">never bid at all</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-br-accent">6 hrs</p>
                  <p className="text-sm text-br-text-secondary mt-1">
                    avg. manual RFP
                  </p>
                  <p className="text-sm text-br-text-secondary">review time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-br-light py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-br-primary/10 text-br-primary text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
              <Users className="h-4 w-4" />
              Our Team
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-3">
              Built by Contractors, for Contractors
            </h2>
            <p className="text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
              We&apos;re not a generic SaaS company pivoting into government.
              Our team has lived and breathed federal contracting.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="overflow-hidden bg-br-surface border-br-border rounded-xl shadow-br-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-br-primary mx-auto flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-white">
                      {member.initials}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-br-primary text-base mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs font-medium text-br-accent uppercase tracking-wider mb-3">
                    {member.role}
                  </p>
                  <p className="text-sm text-br-text-secondary leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-br-accent/10 text-br-accent text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
              <Heart className="h-4 w-4" />
              Our Values
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-br-primary mb-3">
              What We Stand For
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <Card key={v.title} className="text-center bg-br-surface border-br-border rounded-xl shadow-br-sm">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-br-accent/10 mx-auto flex items-center justify-center mb-4">
                    <v.icon className="h-6 w-6 text-br-accent" />
                  </div>
                  <h3 className="font-heading font-bold text-br-primary mb-2">{v.title}</h3>
                  <p className="text-sm text-br-text-secondary leading-relaxed">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Compete?
          </h2>
          <p className="text-lg text-br-text-secondary mb-8 max-w-xl mx-auto leading-relaxed">
            Join hundreds of small federal contractors who are winning more with
            less effort. Start your free trial today.
          </p>
          <Link href="/pricing">
            <Button
              size="lg"
              className="bg-br-accent hover:bg-br-accent/90 text-br-primary font-semibold text-lg px-8 py-6"
            >
              See Pricing Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}