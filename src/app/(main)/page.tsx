import Homepage from "@/components/bidrank/homepage/Homepage";

export const metadata = {
  title: "Bid Smarter, Not Harder — AI RFP Analysis for Federal Contractors | BidRank",
  description:
    "From RFP to ready in minutes. Your AI proposal teammate. Compliance checks, risk scoring, and actionable insights — built by contractors, for contractors. Try free.",
  openGraph: {
    title: "Bid Smarter, Not Harder — AI RFP Analysis | BidRank",
    description:
      "From RFP to ready in minutes. Your AI proposal teammate — compliance checks, risk scoring, and actionable insights built by contractors, for contractors.",
    url: "https://www.bidrank.pro",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bid Smarter, Not Harder — AI RFP Analysis | BidRank",
    description:
      "From RFP to ready in minutes. Your AI proposal teammate — compliance checks, risk scoring, and actionable insights built by contractors, for contractors.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro",
  },
};

export default function Home() {
  return <Homepage />;
}