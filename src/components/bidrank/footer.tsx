"use client";

import Link from "next/link";
import { Linkedin, Twitter, Youtube } from "lucide-react";
import { NewsletterSubscribe } from "@/components/bidrank/newsletter/NewsletterSubscribe";

/* ------------------------------------------------------------------ */
/*  Link helper                                                       */
/* ------------------------------------------------------------------ */
function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("mailto:") || href.startsWith("http");
  const cls =
    "block py-1 text-sm text-white/70 hover:text-white transition-colors";

  if (isExternal) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                            */
/* ------------------------------------------------------------------ */
export function Footer() {
  return (
    <footer className="bg-br-primary pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── 1. Newsletter CTA Bar ─────────────────────────────────── */}
        <div className="text-center mb-16">
          <h3 className="text-white font-heading text-xl font-bold">
            Subscribe to GovCon Insider
          </h3>
          <p className="text-white/70 text-sm mt-2 mb-6 max-w-xl mx-auto">
            3 SAM.gov opportunities, 1 actionable tip, 1 feature spotlight.
            Every Tuesday.
          </p>
          <div className="flex justify-center">
            <NewsletterSubscribe variant="footer" source="footer" />
          </div>
        </div>

        {/* ── 2. Footer Links (4 columns) ──────────────────────────── */}
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {/* Column 1 — Product */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Product
            </h4>
            <ul>
              <li>
                <FooterLink href="/analyzer">Features</FooterLink>
              </li>
              <li>
                <FooterLink href="/pricing">Pricing</FooterLink>
              </li>
              <li>
                <FooterLink href="/free-tool">Free RFP Analyzer</FooterLink>
              </li>
              <li>
                <FooterLink href="/resources#api">API</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 2 — Resources */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul>
              <li>
                <FooterLink href="/blog">Blog</FooterLink>
              </li>
              <li>
                <FooterLink href="/case-studies">Case Studies</FooterLink>
              </li>
              <li>
                <FooterLink href="/free-tool">Free RFP Analyzer</FooterLink>
              </li>
              <li>
                <FooterLink href="/resources">GovCon Guides</FooterLink>
              </li>
              <li>
                <FooterLink href="/resources#newsletter">Newsletter</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul>
              <li>
                <FooterLink href="/about">About</FooterLink>
              </li>
              <li>
                <FooterLink href="/partners">Partners</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Contact</FooterLink>
              </li>
              <li>
                <FooterLink href="mailto:careers@bidrank.pro">Careers</FooterLink>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal */}
          <div>
            <h4 className="text-white font-heading font-semibold text-sm uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul>
              <li>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink href="/terms">Terms of Service</FooterLink>
              </li>
              <li>
                <FooterLink href="/security">Security</FooterLink>
              </li>
              <li>
                <FooterLink href="/privacy#cookies">Cookie Policy</FooterLink>
              </li>
            </ul>
          </div>
        </nav>

        {/* ── 3. Bottom Bar ─────────────────────────────────────────── */}
        <div className="border-t border-white/10 mt-12 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-white/50 text-xs text-center sm:text-left">
              &copy; 2026 BidRank.pro. All rights reserved.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/company/bidrankpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BidRank on LinkedIn"
                className="text-white/50 hover:text-white transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/bidrankpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BidRank on X (Twitter)"
                className="text-white/50 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.youtube.com/@bidrankpro"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BidRank on YouTube"
                className="text-white/50 hover:text-white transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Legal disclaimers */}
          <p className="text-white/30 text-xs mt-4 text-center sm:text-left leading-relaxed max-w-3xl">
            BidRank.pro is not affiliated with, endorsed by, or connected to any
            government agency. SAM.gov is a registered trademark of the U.S.
            General Services Administration.
          </p>
          <p className="text-white/30 text-xs mt-1.5 text-center sm:text-left leading-relaxed max-w-3xl">
            AI-generated analysis is provided for informational purposes only and
            should not be considered legal, financial, or professional advice.
            Always verify critical findings with your proposal team and legal
            counsel.
          </p>
        </div>
      </div>
    </footer>
  );
}