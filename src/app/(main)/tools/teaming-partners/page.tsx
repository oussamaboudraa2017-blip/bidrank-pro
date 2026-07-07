import TeamingPartners from "@/components/bidrank/tools/TeamingPartners";

export const metadata = {
  title: "Teaming Partner Finder | BidRank Tools",
  description:
    "Identify capability gaps in your RFP and find ideal teaming partners. Get AI-powered partner matching based on complementary skills and experience.",
  openGraph: {
    title: "Teaming Partner Finder | BidRank Tools",
    description:
      "Identify capability gaps in your RFP and find ideal teaming partners. Get AI-powered partner matching based on complementary skills and experience.",
    url: "https://www.bidrank.pro/tools/teaming-partners",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teaming Partner Finder | BidRank Tools",
    description:
      "Identify capability gaps in your RFP and find ideal teaming partners. Get AI-powered partner matching based on complementary skills and experience.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/tools/teaming-partners",
  },
};

export default function TeamingPartnersRoute() {
  return <TeamingPartners />;
}