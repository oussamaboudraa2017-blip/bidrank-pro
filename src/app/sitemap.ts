import { MetadataRoute } from "next";
import { blogPosts, CATEGORIES, getAllAuthors } from "@/lib/blog-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.bidrank.pro";
  const now = new Date();

  const staticPages = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/analyzer`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/free-tool`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog/content-calendar`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.3 },
    { url: `${baseUrl}/case-studies`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/security`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${baseUrl}/partners`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${baseUrl}/resources`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${baseUrl}/compare/manual`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/compare/enterprise-tools`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/compare/generic-tools`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/tools/deadline-tracker`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/tools/compliance-narrative`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/tools/document-comparison`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/tools/past-performance`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/tools/teaming-partners`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
  ];

  const blogPages = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const categoryPages = CATEGORIES.map((c) => ({
    url: `${baseUrl}/blog/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const authorPages = getAllAuthors().map((a) => ({
    url: `${baseUrl}/blog/author/${encodeURIComponent(a.name)}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.4,
  }));

  return [...staticPages, ...blogPages, ...categoryPages, ...authorPages];
}