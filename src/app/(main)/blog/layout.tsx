import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "BidRank Blog — Federal Contracting Tips, RFP Analysis & GovCon Insights",
  description:
    "Expert guides on federal RFP analysis, FAR compliance, 8(a) certification, and AI-powered proposal tools. Written by government contracting professionals.",
  alternates: {
    canonical: "https://www.bidrank.pro/blog",
  },
  openGraph: {
    title: "BidRank Blog — Federal Contracting Insights",
    description:
      "Expert guides on federal RFP analysis, FAR compliance, and AI-powered proposal tools.",
    url: "https://www.bidrank.pro/blog",
    type: "website",
    siteName: "BidRank",
  },
  twitter: {
    card: "summary_large_image",
    title: "BidRank Blog — Federal Contracting Insights",
    description:
      "Expert guides on federal RFP analysis, FAR compliance, and AI-powered proposal tools.",
  },
};

function BlogCollectionJsonLd() {
  const latestPosts = blogPosts.slice(0, 10);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "BidRank Blog — Federal Contracting Tips, RFP Analysis & GovCon Insights",
    description:
      "Expert guides on federal RFP analysis, FAR compliance, 8(a) certification, and AI-powered proposal tools.",
    url: "https://www.bidrank.pro/blog",
    publisher: {
      "@type": "Organization",
      name: "BidRank.pro",
      url: "https://www.bidrank.pro",
      logo: {
        "@type": "ImageObject",
        url: "https://www.bidrank.pro/logo.svg",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: latestPosts.length,
      itemListElement: latestPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Article",
          headline: post.title,
          description: post.description,
          url: `https://www.bidrank.pro/blog/${post.slug}`,
          datePublished: post.date,
          author: {
            "@type": "Person",
            name: post.author,
            jobTitle: post.authorTitle,
          },
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BlogCollectionJsonLd />
      {children}
    </>
  );
}