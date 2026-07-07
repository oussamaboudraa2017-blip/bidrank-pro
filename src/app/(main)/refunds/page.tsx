import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Refund Policy — BidRank.pro",
  description: "BidRank.pro refund policy for subscription services.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Refund Policy — BidRank.pro",
    description: "BidRank.pro refund policy for subscription services.",
    url: "https://www.bidrank.pro/refunds",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Refund Policy — BidRank.pro",
    description: "BidRank.pro refund policy for subscription services.",
  },
};

export default function RefundPolicy() {
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
        <h1 className="font-heading text-3xl font-bold text-br-dark mb-2">Refund Policy</h1>
        <p className="text-sm text-br-text-secondary mb-10">
          Last updated: July 4, 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-br-text-secondary">
          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              1. Overview
            </h2>
            <p>
              BidRank.pro offers subscription-based access to our AI-powered
              federal contracting tools. All subscription fees are processed
              through FastSpring, our authorized payment processor. This Refund
              Policy explains the circumstances under which refunds may be
              issued. By subscribing to our Service, you acknowledge and agree
              to the terms outlined below.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              2. Subscription Fees Are Non-Refundable
            </h2>
            <p>
              Monthly subscription fees are non-refundable once charged. This
              is because our Service provides immediate access to digital tools,
              AI analysis credits, and resource library features upon
              payment. We are unable to recover costs associated with
              provisioning your account and providing access to the Service for
              the billing period.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              3. Free Trial
            </h2>
            <p>
              New users receive a 3-day free trial with no credit card
              required to start. During the trial period, you may explore the
              platform and use limited features at no cost. If you choose not
              to continue, simply let the trial expire or cancel before the
              trial ends. No charges will be made during the trial period.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              4. Cancellation
            </h2>
            <p>
              You may cancel your subscription at any time from your account
              settings. Upon cancellation, your access to paid features
              continues until the end of your current billing period. No
              prorated refunds are issued for the remaining days in a billing
              period after cancellation. For example, if you cancel on day 5
              of a 30-day billing cycle, you will retain access for the
              remaining 25 days but will not receive a refund for those days.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              5. Service Credits
            </h2>
            <p>
              BidRank.pro offers a Service Credit Promise for qualifying users.
              If you complete at least 5 RFP analyses and book at least 2 paid
              consultations through the platform within your first 90 days,
              and you do not have at least 3 qualified opportunities in your
              tracked pipeline by day 90, we will extend your subscription by
              1 month at no charge. This is a service credit, not a refund,
              and is subject to the conditions described on our pricing page.
              To request a service credit, contact{" "}
              <a href="mailto:support@bidrank.pro" className="text-br-primary hover:underline">
                support@bidrank.pro
              </a>{" "}
              within 10 days of your 90-day anniversary.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              6. Billing Errors
            </h2>
            <p>
              If you believe you have been charged incorrectly, please contact
              us at{" "}
              <a href="mailto:billing@bidrank.pro" className="text-br-primary hover:underline">
                billing@bidrank.pro
              </a>{" "}
              within 30 days of the charge. We will investigate the matter
              and, if we determine an error occurred, we will issue a
              correction or refund. Claims submitted more than 30 days after
              the charge may not be eligible for review.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              7. Account Suspension by BidRank.pro
            </h2>
            <p>
              If we suspend or terminate your account due to a violation of
              our Terms of Service, no refund will be issued for the
              remaining portion of your billing period. If we suspend or
              terminate your account for reasons other than a Terms violation
              (e.g., a service-wide outage affecting all users), we will
              provide a prorated credit to your account for the affected
              period.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              8. How to Request a Refund or Credit
            </h2>
            <p>
              To request a refund or service credit, contact our support team:
            </p>
            <ul className="mt-2 space-y-1 not-italic">
              <li>
                Email:{" "}
                <a href="mailto:support@bidrank.pro" className="text-br-primary hover:underline">
                  support@bidrank.pro
                </a>
              </li>
              <li>
                Subject line: &quot;Refund Request — [Your Account Email]&quot;
              </li>
              <li>
                Include: your account email, the charge in question, and the
                reason for your request
              </li>
            </ul>
            <p className="mt-3">
              We will respond within 5 business days.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              9. Contact
            </h2>
            <p>
              If you have questions about this Refund Policy, contact us at:
            </p>
            <ul className="mt-2 space-y-1 not-italic">
              <li>
                <strong>BidRank.pro</strong>
              </li>
              <li>
                Email:{" "}
                <a href="mailto:support@bidrank.pro" className="text-br-primary hover:underline">
                  support@bidrank.pro
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
