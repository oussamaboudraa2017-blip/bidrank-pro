"use client";

import { useEffect } from "react";
import { analytics } from "@/lib/analytics";

/**
 * Fires a single analytics event on mount.
 * Usage: <PageTracker event="blog_article_read" slug="my-post" />
 */
export function PageTracker({
  event,
  slug,
}: {
  event: "blog_article_read" | "case_study_viewed";
  slug: string;
}) {
  useEffect(() => {
    if (event === "blog_article_read") {
      analytics.blogArticleRead(slug);
    } else {
      analytics.caseStudyViewed(slug);
    }
  }, [event, slug]);

  return null;
}