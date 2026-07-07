import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Cookie Policy — BidRank.pro",
  description: "BidRank.pro cookie policy explaining how we use cookies and similar technologies.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Cookie Policy — BidRank.pro",
    description: "BidRank.pro cookie policy explaining how we use cookies and similar technologies.",
    url: "https://www.bidrank.pro/cookies",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Cookie Policy — BidRank.pro",
    description: "BidRank.pro cookie policy explaining how we use cookies and similar technologies.",
  },
};

export default function CookiePolicy() {
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
        <h1 className="font-heading text-3xl font-bold text-br-dark mb-2">Cookie Policy</h1>
        <p className="text-sm text-br-text-secondary mb-10">
          Last updated: July 4, 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-br-text-secondary">
          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device when you visit
              our website. They help us remember your preferences, understand
              how you use our Service, and improve your experience. This Cookie
              Policy explains the types of cookies we use, why we use them, and
              how you can manage them.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              2. Types of Cookies We Use
            </h2>

            <p className="font-medium text-br-dark mb-2">
              Strictly Necessary Cookies
            </p>
            <p className="mb-4">
              These cookies are essential for the Service to function properly.
              They enable core features such as authentication, security, and
              page navigation. These cookies cannot be disabled, as the Service
              would not work without them.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>
                <strong>Session cookies:</strong> Used by Better Auth, our
                authentication provider, to manage your sign-in session and
                security tokens.
              </li>
              <li>
                <strong>__vercel* cookies:</strong> Used by Vercel for
                deployment routing and performance monitoring.
              </li>
            </ul>

            <p className="font-medium text-br-dark mb-2">
              Functional Cookies
            </p>
            <p className="mb-4">
              These cookies allow the Service to remember choices you make
              (such as your preferred language or region) and provide enhanced,
              personalized features.
            </p>

            <p className="font-medium text-br-dark mb-2">
              Analytics Cookies
            </p>
            <p className="mb-4">
              We may use analytics cookies to understand how visitors interact
              with our Service, including which pages are visited most often and
              how users navigate through the site. This helps us improve the
              Service. Analytics data is aggregated and anonymized.
            </p>

            <p className="font-medium text-br-dark mb-2">
              Third-Party Cookies
            </p>
            <p>
              Some cookies are set by third-party services that appear on our
              pages. These include Better Auth (authentication), FastSpring (payment
              processing), and Vercel (hosting). We do not control these
              cookies and recommend reviewing the privacy policies of these
              third-party providers for more information.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              3. How We Use Cookies
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To keep you signed in across sessions</li>
              <li>To remember your account preferences</li>
              <li>To protect against unauthorized access and fraud</li>
              <li>To analyze site traffic and usage patterns</li>
              <li>To ensure the Service performs reliably</li>
              <li>To process payments securely via FastSpring</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              4. Managing Cookies
            </h2>
            <p>
              You can control and manage cookies through your browser settings.
              Most browsers allow you to view, delete, or block cookies. Note
              that disabling certain cookies may affect the functionality of
              the Service. For example, disabling Better Auth cookies will prevent
              you from staying signed in.
            </p>
            <p className="mt-2">
              When you first visit BidRank.pro, you will see a cookie consent
              banner at the bottom of the screen. You can accept or manage your
              cookie preferences at any time. Your choice is saved in a
              functional cookie so we remember your preference on subsequent
              visits.
            </p>
            <p className="mt-2">
              To learn more about managing cookies in your browser, visit the
              help pages for your specific browser (e.g., Chrome, Firefox,
              Safari, Edge).
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              5. Changes to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time to reflect
              changes in technology, legislation, or our data practices. We
              will post the updated policy on this page with a revised
              &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              6. Contact
            </h2>
            <p>
              If you have questions about our use of cookies, contact us at:
            </p>
            <ul className="mt-2 space-y-1 not-italic">
              <li>
                <strong>BidRank.pro</strong>
              </li>
              <li>
                Email:{" "}
                <a href="mailto:privacy@bidrank.pro" className="text-br-primary hover:underline">
                  privacy@bidrank.pro
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
