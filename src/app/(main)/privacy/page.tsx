import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — BidRank.pro",
  description: "BidRank.pro privacy policy explaining how we collect, use, and protect your data.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Privacy Policy — BidRank.pro",
    description: "BidRank.pro privacy policy explaining how we collect, use, and protect your data.",
    url: "https://www.bidrank.pro/privacy",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — BidRank.pro",
    description: "BidRank.pro privacy policy explaining how we collect, use, and protect your data.",
  },
};

export default function PrivacyPolicy() {
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
        <h1 className="font-heading text-3xl font-bold text-br-dark mb-2">Privacy Policy</h1>
        <p className="text-sm text-br-text-secondary mb-10">
          Last updated: July 4, 2026
        </p>

        <div className="prose prose-gray max-w-none space-y-8 text-sm leading-relaxed text-br-text-secondary">
          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              1. Introduction
            </h2>
            <p>
              BidRank.pro (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy
              and is committed to protecting your personal data. This privacy policy
              explains how we collect, use, disclose, and safeguard your information
              when you visit our website at www.bidrank.pro (the &quot;Service&quot;). This
              policy applies to all users of the Service, including visitors, registered
              users, and paying subscribers. By using the Service, you agree to the
              collection and use of information in accordance with this policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              2. Information We Collect
            </h2>
            <p className="font-medium text-br-dark mb-2">
              Personal Data
            </p>
            <p className="mb-3">
              When you create an account, we collect your name, email address, and
              authentication credentials through our authentication system (Better Auth). If you
              subscribe to a paid plan, we collect billing information processed by
              FastSpring, our authorized payment processor. FastSpring handles all payment data
              in compliance with PCI-DSS standards, and we do not store credit card
              numbers on our servers.
            </p>
            <p className="font-medium text-br-dark mb-2">
              Uploaded Documents
            </p>
            <p className="mb-3">
              When you use the RFP Analyzer, you may upload RFP documents (PDF, Word,
              Excel, CSV files). These documents are stored temporarily in encrypted
              storage for the purpose of analysis and are automatically deleted after 90
              days unless you opt to retain them. We do not use your uploaded documents
              to train AI models or for any purpose other than providing the analysis
              service.
            </p>
            <p className="font-medium text-br-dark mb-2">
              Usage Data
            </p>
            <p className="mb-3">
              We automatically collect certain information when you use the Service,
              including your IP address, browser type, operating system, referring URLs,
              pages viewed, and the dates and times of your visits. We use Better Auth for
              authentication analytics and may use cookies and similar technologies to
              enhance your experience.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              3. How We Use Your Information
            </h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide, maintain, and improve the Service</li>
              <li>Process your RFP analysis requests using AI technology</li>
              <li>Manage your account and provide customer support</li>
              <li>Process subscription payments through FastSpring</li>
              <li>Send you service-related communications (account updates, security alerts)</li>
              <li>Monitor and analyze usage patterns to improve our platform</li>
              <li>Comply with legal obligations and protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              4. Data Sharing and Disclosure
            </h2>
            <p>
              We do not sell your personal data to third parties. We may share your
              information with the following categories of third parties:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Service Providers:</strong> Better Auth (authentication), FastSpring
                (payment processing), Neon (database hosting), and Google Gemini
                (AI analysis). Each provider processes data under strict
                data-processing agreements.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your information
                if required by law, regulation, legal process, or governmental request.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, your data may be transferred as part
                of that transaction.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              5. Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your
              personal data, including AES-256 encryption for documents at rest,
              TLS 1.3 for data in transit, and role-based access controls. While we
              strive to protect your data, no method of transmission over the
              Internet or electronic storage is 100% secure. We encourage you to use
              strong passwords and to contact us immediately if you suspect
              unauthorized access to your account.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              6. Data Retention
            </h2>
            <p>
              We retain your personal data for as long as your account is active or
              as needed to provide the Service. Uploaded RFP documents are retained
              for 90 days by default. You may request earlier deletion of your
              documents at any time. Upon account deletion, we will remove your
              personal data within 30 days, except where retention is required by
              law.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              7. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete your personal data at any time.
              You may also request a copy of your data in a portable format, object to or
              restrict processing, and withdraw consent where processing is based on consent.
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@bidrank.pro" className="text-br-primary hover:underline">
                privacy@bidrank.pro
              </a>. We will respond to all verified requests within 30 days.
            </p>
            <p className="font-medium text-br-dark mb-2 mt-4">Right to Access</p>
            <p className="mb-3">
              You may request a copy of all personal data we hold about you. This includes your
              account information, analysis history, and any usage data linked to your account.
            </p>
            <p className="font-medium text-br-dark mb-2">Right to Deletion</p>
            <p className="mb-3">
              You may request the permanent deletion of your account and all associated data.
              Upon a verified deletion request, we will remove your personal data from our
              active systems within 30 days and from backups within 90 days, except where
              retention is required by law.
            </p>
            <p className="font-medium text-br-dark mb-2">Right to Portability</p>
            <p className="mb-3">
              You may request your data in a structured, machine-readable format (JSON or CSV)
              so that you can transfer it to another service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              8. Third-Party Links
            </h2>
            <p>
              Our Service may contain links to third-party websites (e.g., SAM.gov,
              agency portals). We are not responsible for the privacy practices of
              these sites. We encourage you to review their privacy policies before
              providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              9. Children&apos;s Privacy
            </h2>
            <p>
              The Service is not intended for individuals under the age of 18. We do
              not knowingly collect personal data from children. If we become aware
              that we have collected data from a child under 18, we will take steps
              to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              10. Cookie Policy
            </h2>
            <p>
              Our use of cookies and similar tracking technologies is described in detail in
              our{" "}
              <a href="/cookies" className="text-br-primary hover:underline">
                Cookie Policy
              </a>. In summary, we use strictly necessary cookies for authentication
              and security, functional cookies for preferences, and internal analytics cookies
              to understand platform usage. We do not use third-party advertising cookies or
              sell data to ad networks.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              11. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify
              you of material changes by posting the new policy on this page and
              updating the &quot;Last updated&quot; date. Your continued use of the
              Service after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-br-dark mb-3">
              12. Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy or our data practices,
              please contact us at:
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
