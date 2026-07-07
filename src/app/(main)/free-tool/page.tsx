import FreeToolPage from "@/components/bidrank/free-tool/FreeToolPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Federal RFP Analyzer — Instant Compliance Check | BidRank",
  description:
    "Upload any government RFP and get a free compliance score, risk assessment, and key findings in seconds. No signup required. Built for 8(a), HUBZone, and small business contractors.",
  alternates: {
    canonical: "https://www.bidrank.pro/free-tool",
  },
  openGraph: {
    title: "Free Federal RFP Analyzer — Instant Compliance Check | BidRank",
    description:
      "Upload any government RFP and get a free compliance score, risk assessment, and key findings in seconds. No signup required.",
    url: "https://www.bidrank.pro/free-tool",
    type: "website",
    siteName: "BidRank",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Federal RFP Analyzer — Instant Compliance Check | BidRank",
    description:
      "Upload any government RFP and get a free compliance score, risk assessment, and key findings in seconds. No signup required.",
  },
};

export default function Page() {
  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BidRank Free RFP Analyzer",
    description:
      "Upload any government RFP and get a free compliance score, risk assessment, and key findings in seconds. No signup required.",
    url: "https://www.bidrank.pro/free-tool",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the BidRank free RFP analyzer?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "BidRank's free RFP analyzer instantly scores any federal solicitation for compliance, identifies risks, and highlights the top findings. No signup or credit card required. Upload a PDF, DOCX, or XLSX file and get results in under 60 seconds.",
        },
      },
      {
        "@type": "Question",
        name: "What file formats are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The free analyzer supports PDF, DOCX, and XLSX files up to 10 MB. Most federal solicitations downloaded from SAM.gov are in PDF format and work perfectly.",
        },
      },
      {
        "@type": "Question",
        name: "Is my RFP data stored or shared?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Free analyses are processed on-the-fly and your document is never stored. All data transfers are encrypted with AES-256. BidRank is built with government contractor data security in mind.",
        },
      },
      {
        "@type": "Question",
        name: "What does the compliance score mean?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The compliance score (0-100) indicates how well your RFP aligns with federal requirements like FAR and DFARS clauses. A score of 80+ means low risk, 60-79 is medium risk, and below 60 signals high risk of disqualification. The free tool analyzes a preview of pages — create a free account for the full analysis.",
        },
      },
      {
        "@type": "Question",
        name: "How is this different from the full BidRank analysis?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The free tool gives you an instant preview: a compliance score, risk level, and top 5 findings from a sample of pages. The full analysis (free with an account) includes all pages, a complete compliance matrix, risk heatmap, bid/no-bid recommendation, requirement extraction, and exportable PDF reports.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
      <FreeToolPage />
    </>
  );
}