import DocumentComparison from "@/components/bidrank/tools/DocumentComparison";

export const metadata = {
  title: "Document Comparison | BidRank Tools",
  description:
    "Compare previous proposals with new RFPs side by side. Identify changed requirements, new clauses, and removed sections instantly.",
  openGraph: {
    title: "Document Comparison | BidRank Tools",
    description:
      "Compare previous proposals with new RFPs side by side. Identify changed requirements, new clauses, and removed sections instantly.",
    url: "https://www.bidrank.pro/tools/document-comparison",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Document Comparison | BidRank Tools",
    description:
      "Compare previous proposals with new RFPs side by side. Identify changed requirements, new clauses, and removed sections instantly.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/tools/document-comparison",
  },
};

export default function DocumentComparisonRoute() {
  return <DocumentComparison />;
}