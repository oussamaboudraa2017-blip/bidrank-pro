import ComplianceNarrative from "@/components/bidrank/tools/ComplianceNarrative";

export const metadata = {
  title: "Compliance Narrative Generator | BidRank Tools",
  description:
    "Generate professional compliance narratives for federal proposals. Covers small business size, 8(a), HUBZone, SDVOSB, clearance, bonding, insurance, and past performance.",
  openGraph: {
    title: "Compliance Narrative Generator | BidRank Tools",
    description:
      "Generate professional compliance narratives for federal proposals. Covers small business size, 8(a), HUBZone, SDVOSB, clearance, bonding, insurance, and past performance.",
    url: "https://www.bidrank.pro/tools/compliance-narrative",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compliance Narrative Generator | BidRank Tools",
    description:
      "Generate professional compliance narratives for federal proposals. Covers small business size, 8(a), HUBZone, SDVOSB, clearance, bonding, insurance, and past performance.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/tools/compliance-narrative",
  },
};

export default function ComplianceNarrativeRoute() {
  return <ComplianceNarrative />;
}