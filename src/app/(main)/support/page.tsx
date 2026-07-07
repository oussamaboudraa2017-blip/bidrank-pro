import type { Metadata } from "next";
import SupportPageClient from "./SupportPageClient";

export const metadata: Metadata = {
  title: "Help & Support | BidRank",
  description:
    "Get help with BidRank. Browse FAQs, watch tutorials, or contact our support team. Free users get email support within 24 hours. Paid plans get priority support within 4 hours.",
  openGraph: {
    title: "Help & Support | BidRank",
    description:
      "Browse FAQs, watch tutorials, or contact support. Free: 24hr response. Paid: 4hr priority support.",
    url: "https://www.bidrank.pro/support",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help & Support | BidRank",
    description: "Browse FAQs, watch tutorials, or contact support.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/support",
  },
};

export default function SupportPage() {
  return <SupportPageClient />;
}