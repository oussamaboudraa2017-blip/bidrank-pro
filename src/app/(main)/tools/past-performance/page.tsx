import PastPerformanceMatcher from "@/components/bidrank/tools/PastPerformanceMatcher";

export const metadata = {
  title: "Past Performance Matcher | BidRank Tools",
  description:
    "Match your past contract performance against current RFP requirements. Get relevance scores and suggested narrative structures for your proposals.",
  openGraph: {
    title: "Past Performance Matcher | BidRank Tools",
    description:
      "Match your past contract performance against current RFP requirements. Get relevance scores and suggested narrative structures for your proposals.",
    url: "https://www.bidrank.pro/tools/past-performance",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Past Performance Matcher | BidRank Tools",
    description:
      "Match your past contract performance against current RFP requirements. Get relevance scores and suggested narrative structures for your proposals.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/tools/past-performance",
  },
};

export default function PastPerformanceRoute() {
  return <PastPerformanceMatcher />;
}