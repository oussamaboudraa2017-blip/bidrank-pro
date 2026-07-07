import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partners | BidRank",
  description:
    "BidRank partners with leading federal contracting organizations to deliver AI-powered RFP analysis tools.",
  openGraph: {
    title: "Partners | BidRank",
    description:
      "BidRank partners with leading federal contracting organizations to deliver AI-powered RFP analysis tools.",
    url: "https://www.bidrank.pro/partners",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Partners | BidRank",
    description:
      "BidRank partners with leading federal contracting organizations to deliver AI-powered RFP analysis tools.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/partners",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}