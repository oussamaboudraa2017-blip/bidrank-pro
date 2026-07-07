import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service — BidRank.pro",
  description: "BidRank.pro terms of service governing your use of our platform.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Terms of Service — BidRank.pro",
    description: "BidRank.pro terms of service governing your use of our platform.",
    url: "https://www.bidrank.pro/terms",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service — BidRank.pro",
    description: "BidRank.pro terms of service governing your use of our platform.",
  },
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-br-surface">
      {/* Header */}
      <header className="bg-br-primary border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-br-accent flex items-center justify-center">
              <Shield className="w-4 h-4 text-br-primary" />
            </div>
            <span className="text-lg font-bold text-white">
              BidRank<span className="text-br-accent">.pro</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-br-text-secondary hover:text-white transition-colors"
          >
            &larr; Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-heading text-3xl font-bold text-br-dark mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-br-text-secondary mb-10">
          Last updated: July 4, 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-br-text-secondary">
          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using BidRank.pro (the &quot;Service&quot;), you agree to be
              bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these
              Terms, you may not use the Service. These Terms apply to all visitors,
              registered users, and subscribers of BidRank.pro. We reserve the right
              to modify these Terms at any time, and your continued use of the
              Service after changes are posted constitutes acceptance of the revised
              Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              2. Description of Service
            </h2>
            <p>
              BidRank.pro is a software-as-a-service platform that provides
              AI-powered RFP (Request for Proposal) document analysis, a resource
              library of federal contracting professionals, and related tools including Bid
              Readiness Scoring, compliance checklists, and risk analysis. The
              Service is designed to assist small businesses, including 8(a) and
              HUBZone contractors, in evaluating and pursuing federal contract
              opportunities. BidRank.pro is not a government contractor, broker,
              consulting firm, or law firm, and does not provide legal, tax, or
              professional advice.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              3. Account Registration
            </h2>
            <p>
              To access certain features of the Service, you must create an account.
              You agree to provide accurate, current, and complete information
              during registration and to keep your account credentials
              confidential. You are responsible for all activity under your
              account. You must be at least 18 years old to create an account.
              If you suspect unauthorized use of your account, you must notify us
              immediately at{" "}
              <a href="mailto:support@bidrank.pro" className="text-br-primary hover:underline">
                support@bidrank.pro
              </a>.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              4. Subscription Plans and Payments
            </h2>
            <p>
              We offer subscription plans with different features and usage limits.
              Subscription fees are billed monthly through FastSpring, our authorized
              payment processor. By subscribing, you authorize FastSpring to charge the
              applicable fees to your payment method on a recurring basis. Prices
              are subject to change with 30 days&apos; notice. Your subscription
              renews automatically at the end of each billing period unless you
              cancel before the renewal date.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              5. Refund Policy
            </h2>
            <p>
              Our refund policy is described in detail at our{" "}
              <a href="/refunds" className="text-br-primary hover:underline">
                Refund Policy
              </a>. In summary, monthly subscription fees are non-refundable once charged.
              We offer a 3-day free trial (no credit card required) so you can evaluate the
              Service before committing. If you believe you have been charged incorrectly,
              contact us at{" "}
              <a href="mailto:billing@bidrank.pro" className="text-br-primary hover:underline">
                billing@bidrank.pro
              </a>{" "}
              within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              6. Cancellation and Termination
            </h2>
            <p>
              You may cancel your subscription at any time from your account
              settings. Upon cancellation, your access continues until the end of
              your current billing period. We do not provide prorated refunds for
              unused portions of a billing period. We reserve the right to
              suspend or terminate your account for violations of these Terms,
              fraudulent activity, or any reason at our discretion with reasonable
              notice.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              7. AI-Generated Analysis Disclaimer
            </h2>
            <p>
              The RFP analysis, Bid Readiness Scores, compliance checklists, and
              risk assessments provided by the Service are generated by artificial
              intelligence and are intended for informational purposes only. These
              outputs do not constitute legal advice, professional consulting, or
              a guarantee of contract award. Federal contract awards depend on
              many factors outside our control, including agency budgets,
              competitor proposals, and evaluation panel decisions. You are solely
              responsible for your bid decisions, compliance with the Federal
              Acquisition Regulation (FAR), Defense Federal Acquisition Regulation
              Supplement (DFARS), and the accuracy of your submissions.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              8. Resource Library
            </h2>
            <p>
              Our resource library contains profiles of third-party federal
              contracting professionals. Credentials and experience are
              self-reported and lightly verified. BidRank.pro does not guarantee
              the quality, availability, or results of any professional listed in
              the library. Past performance does not
              guarantee future results. You are responsible for performing your own
              due diligence before engaging any professional.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              9. User Conduct
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use the Service for any unlawful purpose or in violation of any applicable regulations</li>
              <li>Upload malicious code, viruses, or content that could harm the Service</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Resell, redistribute, or sublicense access to the Service without written permission</li>
              <li>Misrepresent your identity or business qualifications</li>
              <li>Use AI-generated outputs as legal or professional advice</li>
              <li>Scrape, crawl, or extract data from the Service through automated means</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              10. Intellectual Property
            </h2>
            <p>
              The Service, including its design, text, graphics, logos, and
              software, is the property of BidRank.pro and is protected by
              intellectual property laws. Your uploaded RFP documents remain your
              property. AI-generated analysis outputs are provided for your
              personal business use and may not be resold or redistributed as a
              service. The BidRank name, logo, and brand marks are trademarks of
              BidRank.pro and may not be used without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              11. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, BidRank.pro shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the Service, including
              but not limited to lost profits, lost contracts, or business
              interruption. Our total liability for any claim shall not exceed
              the amount you paid to us in the 12 months preceding the claim.
              This limitation applies regardless of the legal theory on which
              the claim is based.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              12. Indemnification
            </h2>
            <p>
              You agree to indemnify and hold harmless BidRank.pro, its officers,
              directors, employees, and agents from any claims, damages, losses,
              or expenses (including reasonable attorney fees) arising from your
              use of the Service, your violation of these Terms, or your
              violation of any rights of a third party.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              13. Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with
              the laws of the United States, without regard to conflict of law
              principles. Any disputes arising from these Terms or the Service
              shall be resolved through binding arbitration in accordance with
              the rules of the American Arbitration Association.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              14. Contact
            </h2>
            <p>
              For questions about these Terms, contact us at:
            </p>
            <ul className="mt-2 space-y-1 not-italic">
              <li>
                <strong>BidRank.pro</strong>
              </li>
              <li>
                Email:{" "}
                <a href="mailto:legal@bidrank.pro" className="text-br-primary hover:underline">
                  legal@bidrank.pro
                </a>
              </li>
              <li>
                Website:{" "}
                <a href="https://www.bidrank.pro" className="text-br-primary hover:underline">
                  www.bidrank.pro
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-br-dark border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-xs text-br-text-secondary">
            &copy; {new Date().getFullYear()} BidRank.pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
