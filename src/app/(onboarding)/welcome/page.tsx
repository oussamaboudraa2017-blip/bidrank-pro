import { Metadata } from "next";
import WelcomeClient from "./WelcomeClient";

export const metadata: Metadata = {
  title: "Welcome to BidRank!",
  description:
    "Get started with BidRank — upload your first RFP, watch a demo, or download a sample.",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return <WelcomeClient />;
}