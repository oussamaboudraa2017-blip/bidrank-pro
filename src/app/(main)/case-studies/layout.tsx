import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Studies & Success Stories | BidRank",
  description:
    "Real success stories from federal contractors using BidRank to win more contracts. Coming Q3 2026.",
  alternates: {
    canonical: "https://www.bidrank.pro/case-studies",
  },
  openGraph: {
    title: "Case Studies & Success Stories | BidRank",
    description:
      "Real success stories from federal contractors using BidRank. Coming Q3 2026.",
    url: "https://www.bidrank.pro/case-studies",
    type: "website",
    siteName: "BidRank",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies & Success Stories | BidRank",
    description:
      "Real success stories from federal contractors using BidRank. Coming Q3 2026.",
  },
};

export default function CaseStudiesLayout({ children }: { children: React.ReactNode }) {
  return children;
}