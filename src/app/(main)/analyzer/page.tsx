import AnalyzerPage from "@/components/bidrank/analyzer/AnalyzerPage";

export const metadata = {
  title: "AI RFP Analyzer | BidRank",
  description: "Upload any federal RFP and get instant compliance checks, risk scoring, requirement extraction, and actionable recommendations in minutes.",
  openGraph: {
    title: "AI RFP Analyzer | BidRank",
    description: "Upload any federal RFP and get instant compliance checks, risk scoring, requirement extraction, and actionable recommendations in minutes.",
    url: "https://www.bidrank.pro/analyzer",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI RFP Analyzer | BidRank",
    description: "Upload any federal RFP and get instant compliance checks, risk scoring, requirement extraction, and actionable recommendations in minutes.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/analyzer",
  },
};

export default function AnalyzerRoute() {
  return <AnalyzerPage />;
}