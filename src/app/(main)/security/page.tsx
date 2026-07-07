import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Shield,
  Lock,
  Server,
  Trash2,
  FileCheck,
  Bug,
  Eye,
  Clock,
  Fingerprint,
} from "lucide-react";

export const metadata = {
  title: "Security & Data Protection | BidRank",
  description:
    "Learn how BidRank protects your data with AES-256 encryption, 99.9% uptime, and enterprise-grade security practices.",
  openGraph: {
    title: "Security & Data Protection | BidRank",
    description:
      "Learn how BidRank protects your data with AES-256 encryption, 99.9% uptime, and enterprise-grade security practices.",
    url: "https://www.bidrank.pro/security",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Security & Data Protection | BidRank",
    description:
      "Learn how BidRank protects your data with AES-256 encryption, 99.9% uptime, and enterprise-grade security practices.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/security",
  },
};

const securityFeatures = [
  {
    icon: Lock,
    title: "Data Encryption",
    description:
      "All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Your RFP documents, account data, and analysis results are protected with industry-standard encryption that meets federal security requirements.",
    details: [
      "AES-256 encryption for all stored documents",
      "TLS 1.3 for all data in transit",
      "Encrypted database connections at all times",
      "Secure key management with automatic rotation",
    ],
  },
  {
    icon: Server,
    title: "Infrastructure Reliability",
    description:
      "Our infrastructure is designed for high availability with redundant systems, automated failover, and 24/7 monitoring. We maintain a 99.9% uptime SLA to ensure the platform is available when you need it most.",
    details: [
      "99.9% uptime SLA with redundant systems",
      "Automated backups with point-in-time recovery",
      "24/7 infrastructure monitoring and alerting",
      "Global CDN for fast, reliable access",
    ],
  },
  {
    icon: Fingerprint,
    title: "Access Control",
    description:
      "We follow the principle of least privilege across our entire organization. Every access request is authenticated, authorized, and logged. Your data is accessible only to you and your authorized team members.",
    details: [
      "Role-based access control (RBAC) internally",
      "Multi-factor authentication for all staff accounts",
      "Session management with automatic timeout",
      "Comprehensive audit logging of all access events",
    ],
  },
  {
    icon: Trash2,
    title: "Data Retention & Deletion",
    description:
      "You control your data. Uploaded RFP documents are retained for 90 days by default, and you can delete them at any time. When you delete your account, all your data is permanently removed within 30 days.",
    details: [
      "User-controlled data retention settings",
      "Automatic 90-day document cleanup (default)",
      "Immediate deletion available on request",
      "Complete account data purge within 30 days of deletion",
    ],
  },
  {
    icon: FileCheck,
    title: "Compliance Roadmap",
    description:
      "We're actively pursuing industry-standard security certifications. Our security practices are designed to meet the requirements federal contractors expect and need.",
    details: [
      "SOC 2 Type II — In progress (planned 2026)",
      "NIST 800-171 alignment — In progress",
      "FedRAMP readiness — Future roadmap",
      "Regular third-party security assessments",
    ],
  },
  {
    icon: Bug,
    title: "Responsible Disclosure",
    description:
      "We take security seriously and welcome reports from the security research community. If you discover a vulnerability, we commit to acknowledging your report within 24 hours and resolving critical issues promptly.",
    details: [
      "Dedicated security response team",
      "24-hour acknowledgment for all reports",
      "48-hour resolution for critical vulnerabilities",
      "Responsible disclosure recognition program",
    ],
  },
];

export default function SecurityPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-br-primary py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-br-accent/10 mx-auto flex items-center justify-center mb-6">
            <Shield className="h-8 w-8 text-br-accent" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Security & Data Protection
          </h1>
          <p className="text-lg text-br-text-secondary max-w-2xl mx-auto leading-relaxed">
            Your RFP documents contain sensitive business information. Here&apos;s
            how we protect it — with the same standards federal contractors
            expect.
          </p>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {securityFeatures.map((feature) => (
              <Card key={feature.title} className="overflow-hidden bg-br-surface border-br-border rounded-xl shadow-br-sm">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-br-primary/5 flex items-center justify-center shrink-0">
                      <feature.icon className="h-6 w-6 text-br-primary" />
                    </div>
                    <div>
                      <h2 className="font-heading text-lg font-bold text-br-primary">
                        {feature.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-sm text-br-text-secondary leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li
                        key={detail}
                        className="flex items-start gap-2 text-sm text-br-text-secondary"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-br-accent shrink-0 mt-1.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="bg-br-light py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-br-accent" />
              <span className="text-sm font-medium text-br-dark">
                AES-256 Encryption
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-br-accent" />
              <span className="text-sm font-medium text-br-dark">
                99.9% Uptime SLA
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-br-accent" />
              <span className="text-sm font-medium text-br-dark">
                Your Data, Your Control
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-br-accent" />
              <span className="text-sm font-medium text-br-dark">
                24hr Response
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-br-text-secondary leading-relaxed">
            Have security questions or concerns? Contact our security team at{" "}
            <a
              href="mailto:security@bidrank.pro"
              className="text-br-primary hover:underline font-medium"
            >
              security@bidrank.pro
            </a>
            . We take every inquiry seriously and respond promptly.
          </p>
        </div>
      </section>
    </div>
  );
}