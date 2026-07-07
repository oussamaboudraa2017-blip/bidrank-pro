import ConsultantsPage from "@/components/bidrank/consultants/ConsultantsPage";

export const metadata = {
  title: "GovCon Resources & Guides | BidRank",
  description: "Expert guides for 8(a), HUBZone, and small business federal contractors. Certification help, RFP checklists, and consultant directory.",
  openGraph: {
    title: "GovCon Resources & Guides | BidRank",
    description: "Expert guides for 8(a), HUBZone, and small business federal contractors. Certification help, RFP checklists, and consultant directory.",
    url: "https://www.bidrank.pro/resources",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GovCon Resources & Guides | BidRank",
    description: "Expert guides for 8(a), HUBZone, and small business federal contractors. Certification help, RFP checklists, and consultant directory.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/resources",
  },
};

export default function ResourcesPage() {
  return <ConsultantsPage />;
}