import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Your Dashboard | BidRank",
  description: "Track your analyses, badges, and progress.",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}