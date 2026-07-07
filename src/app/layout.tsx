import type { Metadata } from "next";
import { Inter, Poppins, Space_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsentBanner } from "@/components/bidrank/CookieConsentBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bidrank.pro"),
  title: "BidRank.pro — AI-Powered RFP Analysis Software for Federal Contractors",
  description:
    "AI-powered RFP analysis platform. Upload government RFPs and get instant compliance checks, risk scoring, and actionable recommendations. Built for 8(a), HUBZone, and small business contractors.",
  keywords: [
    "RFP analysis software",
    "federal contracting tool",
    "government contract AI",
    "8(a) compliance software",
    "HUBZone tool",
    "bid readiness platform",
    "FAR compliance checker",
    "federal RFP analyzer",
    "SAM.gov opportunities",
    "set-aside contracts",
    "GovCon",
    "federal proposal analysis",
    "government RFP",
    "small business federal contracting",
    "AI RFP analysis",
  ],
  authors: [{ name: "BidRank.pro" }],
  openGraph: {
    title: "BidRank.pro — AI-Powered Federal Contracting",
    description:
      "AI-powered RFP analysis platform. Upload government RFPs and get compliance checks, risk scoring, and recommendations.",
    siteName: "BidRank.pro",
    type: "website",
    locale: "en_US",
    url: "https://www.bidrank.pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BidRank — AI-Powered RFP Analysis for Federal Contractors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BidRank.pro — AI-Powered RFP Analysis",
    description: "Upload any government RFP and get instant compliance checks, risk scoring, and actionable insights.",
    creator: "@bidrankpro",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} ${spaceMono.variable} antialiased font-sans`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-br-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
        <Toaster />
        <CookieConsentBanner />
      </body>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "BidRank.pro",
            url: "https://www.bidrank.pro",
            logo: "https://www.bidrank.pro/logo.png",
            description: "AI-powered RFP analysis platform for federal contractors",
            contactPoint: {
              "@type": "ContactPoint",
              email: "support@bidrank.pro",
              contactType: "customer support",
            },
          }),
        }}
      />
    </html>
  );
}