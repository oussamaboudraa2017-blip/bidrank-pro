import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/sign-in", "/sign-up", "/welcome", "/dashboard"],
      },
      {
        userAgent: "*",
        disallow: ["/terms", "/privacy", "/cookies", "/refunds"],
      },
    ],
    sitemap: "https://www.bidrank.pro/sitemap.xml",
  };
}