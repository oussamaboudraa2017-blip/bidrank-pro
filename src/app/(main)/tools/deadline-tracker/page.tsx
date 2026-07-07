import DeadlineTracker from "@/components/bidrank/tools/DeadlineTracker";

export const metadata = {
  title: "RFP Deadline Tracker | BidRank Tools",
  description:
    "Track all your RFP deadlines in one place. Upload RFPs to auto-extract deadlines or add them manually. View on timeline or list with status indicators.",
  openGraph: {
    title: "RFP Deadline Tracker | BidRank Tools",
    description:
      "Track all your RFP deadlines in one place. Upload RFPs to auto-extract deadlines or add them manually. View on timeline or list with status indicators.",
    url: "https://www.bidrank.pro/tools/deadline-tracker",
    siteName: "BidRank",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RFP Deadline Tracker | BidRank Tools",
    description:
      "Track all your RFP deadlines in one place. Upload RFPs to auto-extract deadlines or add them manually. View on timeline or list with status indicators.",
  },
  alternates: {
    canonical: "https://www.bidrank.pro/tools/deadline-tracker",
  },
};

export default function DeadlineTrackerRoute() {
  return <DeadlineTracker />;
}