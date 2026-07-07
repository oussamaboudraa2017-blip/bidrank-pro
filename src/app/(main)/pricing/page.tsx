import PricingPage from "@/components/bidrank/pricing/PricingPage";

export const metadata = {
  title: "Simple Pricing for Federal Proposal Analysis | BidRank",
  description:
    "Start free. Upgrade when ready. Plans from $49/month for unlimited RFP analysis. Built for small business federal contractors.",
  openGraph: {
    title: "Simple Pricing for Federal Proposal Analysis | BidRank",
    description:
      "Start free. Upgrade when ready. Plans from $49/month for unlimited RFP analysis. Built for small business federal contractors.",
    url: "https://www.bidrank.pro/pricing",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Simple Pricing for Federal Proposal Analysis | BidRank",
    description:
      "Start free. Upgrade when ready. Plans from $49/month for unlimited RFP analysis. Built for small business federal contractors.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/pricing",
  },
};

export default function PricingRoute() {
  return <PricingPage />;
}