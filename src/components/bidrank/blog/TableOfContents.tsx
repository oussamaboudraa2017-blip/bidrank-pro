"use client";

import { useEffect, useState, useMemo } from "react";
import { List } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  const headings = useMemo<TocItem[]>(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const elements = doc.querySelectorAll("h2, h3");
    const items: TocItem[] = [];
    elements.forEach((el) => {
      const text = el.textContent?.trim() || "";
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      items.push({ id, text, level: el.tagName === "H2" ? 2 : 3 });
    });
    return items;
  }, [content]);

  useEffect(() => {
    // Inject IDs into the rendered headings
    const articleBody = document.querySelector(".prose-br");
    if (!articleBody) return;

    const h2s = articleBody.querySelectorAll("h2, h3");
    h2s.forEach((el) => {
      const text = el.textContent?.trim() || "";
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      el.id = id;
    });

    // Observe scroll position
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );

    h2s.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav
      className="hidden lg:block sticky top-24 w-56 shrink-0"
      aria-label="Table of contents"
    >
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-br-dark/40" />
        <span className="text-xs font-semibold uppercase tracking-wider text-br-dark/50">
          Contents
        </span>
      </div>
      <ul className="space-y-1.5 border-l border-br-border pl-3">
        {headings.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => scrollToHeading(item.id)}
              className={`block text-left text-sm leading-snug transition-colors hover:text-br-primary w-full ${
                item.level === 3 ? "pl-3" : ""
              } ${
                activeId === item.id
                  ? "text-br-primary font-semibold"
                  : "text-br-dark/50"
              }`}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}