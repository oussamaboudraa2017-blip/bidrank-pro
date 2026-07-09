"use client";

import { useEffect, useRef } from "react";
import { analytics } from "@/lib/analytics";

/**
 * Fires blog_post_scroll_depth events at 25%, 50%, 75%, and 100%
 * of the article content area. Uses IntersectionObserver for performance.
 */
export function ScrollDepthTracker({ slug }: { slug: string }) {
  const firedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const DEPTHS = [25, 50, 75, 100];

    // Create sentinel elements at each depth percentage
    const sentinels: HTMLDivElement[] = [];

    DEPTHS.forEach((depth) => {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.top = `${depth}%`;
      el.style.width = "1px";
      el.style.height = "1px";
      el.style.pointerEvents = "none";
      el.setAttribute("data-scroll-depth", String(depth));

      // Find the article body — look for the main content wrapper
      const articleBody = document.querySelector("article") || document.querySelector("main");
      if (articleBody) {
        articleBody.style.position = "relative";
        articleBody.appendChild(el);
        sentinels.push(el);
      }
    });

    if (sentinels.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const depth = Number(entry.target.getAttribute("data-scroll-depth"));
            if (!firedDepths.current.has(depth)) {
              firedDepths.current.add(depth);
              analytics.blogPostScrollDepth(slug, depth);
            }
          }
        });
      },
      {
        // Trigger when the sentinel enters the viewport
        threshold: 0,
        rootMargin: "0px 0px -20% 0px", // Slightly above viewport bottom
      }
    );

    sentinels.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      sentinels.forEach((el) => el.remove());
    };
  }, [slug]);

  return null;
}