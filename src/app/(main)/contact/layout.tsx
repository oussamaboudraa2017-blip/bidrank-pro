import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact BidRank | Get in Touch",
  description:
    "Have questions about BidRank? Contact our team for support, partnerships, or sales inquiries.",
  openGraph: {
    title: "Contact BidRank | Get in Touch",
    description:
      "Have questions about BidRank? Contact our team for support, partnerships, or sales inquiries.",
    url: "https://www.bidrank.pro/contact",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact BidRank | Get in Touch",
    description:
      "Have questions about BidRank? Contact our team for support, partnerships, or sales inquiries.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}