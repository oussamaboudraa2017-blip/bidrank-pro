"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { blogPosts, CATEGORIES, searchPosts, type CategorySlug } from "@/lib/blog-data";
import { Search, Calendar, Clock, User, ArrowRight, FileText, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { NewsletterSubscribe } from "@/components/bidrank/newsletter/NewsletterSubscribe";
import { analytics } from "@/lib/analytics";

const POSTS_PER_PAGE = 9;

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategorySlug | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Page view
  useEffect(() => { analytics.blogListingViewed(); }, []);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query.trim()) analytics.blogSearchUsed(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, activeCategory]);

  // Filter posts by search query AND category
  const filteredPosts = useMemo(() => {
    let results = searchPosts(debouncedQuery);
    if (activeCategory !== "all") {
      results = results.filter((p) => p.categorySlug === activeCategory);
    }
    return results;
  }, [debouncedQuery, activeCategory]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Featured post = first post, skip it from grid on page 1 with no filters
  const showFeatured = !debouncedQuery && activeCategory === "all" && currentPage === 1 && filteredPosts.length > 0;
  const gridPosts = showFeatured
    ? paginatedPosts.slice(1) // skip featured post (index 0) from grid
    : paginatedPosts;

  const handleReset = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    setActiveCategory("all");
  }, []);

  return (
    <>
      {/* Page Header */}
      <section className="bg-br-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-4 bg-br-accent/15 text-br-accent border-br-accent/30 hover:bg-br-accent/20">
              Resources
            </Badge>
            <h1 className="text-3xl font-heading font-bold text-br-primary sm:text-4xl md:text-5xl">
              GovCon Resources &amp; Guides
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-br-dark/70">
              Expert insights on federal contracting, RFP analysis, and winning strategies for small business contractors.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-br-dark/40" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 h-11 border-br-border focus-visible:ring-br-secondary/30"
              aria-label="Search blog articles"
            />
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              aria-pressed={activeCategory === "all"}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-br-primary text-white"
                  : "text-br-text-secondary hover:bg-br-hover"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                setActiveCategory(cat.slug);
                analytics.blogCategoryFiltered(cat.slug);
              }}
                aria-pressed={activeCategory === cat.slug}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-br-primary text-white"
                    : "text-br-text-secondary hover:bg-br-hover"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Two-column layout: content + sidebar */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Main content area */}
            <div className="flex-1 min-w-0">
              {/* Post Count */}
              <p className="text-sm text-br-text-secondary mb-6">
                {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} found
              </p>

              {/* Featured Post (show when no filters active, page 1) */}
              {showFeatured && filteredPosts.length > 0 && (
                <Link
                  href={`/blog/${filteredPosts[0].slug}`}
                  className="group block mb-10"
                >
                  <Card className="overflow-hidden border-0 bg-br-surface rounded-xl shadow-br-md card-hover transition-shadow">
                    <div className="grid md:grid-cols-2">
                      <div className="bg-gradient-to-br from-br-primary to-br-secondary p-8 md:p-10 flex items-center justify-center">
                        <div className="text-center">
                          <Star className="w-10 h-10 text-br-accent mx-auto mb-3" />
                          <span className="text-br-accent text-xs font-semibold uppercase tracking-wider">Featured Article</span>
                        </div>
                      </div>
                      <CardContent className="p-8 md:p-10 flex flex-col justify-center">
                        <Badge className="w-fit text-xs font-medium bg-br-primary/8 text-br-primary border border-br-primary/15 mb-3">
                          {filteredPosts[0].category}
                        </Badge>
                        <h2 className="text-xl md:text-2xl font-heading font-bold text-br-primary group-hover:text-br-secondary transition-colors leading-snug mb-3">
                          {filteredPosts[0].title}
                        </h2>
                        <p className="text-sm text-br-text-secondary line-clamp-3 mb-4">
                          {filteredPosts[0].description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-br-text-secondary">
                          <span className="flex items-center gap-1"><User className="size-3" />{filteredPosts[0].author}</span>
                          <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(filteredPosts[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="flex items-center gap-1"><Clock className="size-3" />{filteredPosts[0].readTime}</span>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-br-secondary group-hover:text-br-primary transition-colors">
                          Read article <ArrowRight className="size-4" />
                        </span>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              )}

              {/* Blog Grid or Empty State */}
              {filteredPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {gridPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group"
                      >
                        <Card className="h-full bg-br-surface border-br-border rounded-xl shadow-br-sm card-hover py-0 gap-0">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                              <Link
                                href={`/blog/category/${post.categorySlug}`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Badge
                                  className="text-xs font-medium bg-br-primary/8 text-br-primary border border-br-primary/15"
                                >
                                  {post.category}
                                </Badge>
                              </Link>
                              <span className="text-sm text-br-text-secondary flex items-center gap-1">
                                <Clock className="size-3" />
                                {post.readTime}
                              </span>
                            </div>
                            <CardTitle className="text-lg font-heading leading-snug text-br-primary group-hover:text-br-secondary transition-colors">
                              {post.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col flex-1 pt-0">
                            <p className="text-sm text-br-text-secondary line-clamp-3 flex-1">
                              {post.description}
                            </p>
                            <div className="mt-4 pt-4 border-t border-br-border flex items-center justify-between text-sm text-br-text-secondary">
                              <Link
                                href={`/blog/author/${encodeURIComponent(post.author)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1 hover:text-br-primary transition-colors"
                              >
                                <User className="size-3" />
                                {post.author}
                              </Link>
                              <span className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                {new Date(post.date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Blog pagination">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="gap-1 text-br-dark/70"
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="size-4" />
                        Prev
                      </Button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            aria-label={`Page ${page}`}
                            aria-current={currentPage === page ? "page" : undefined}
                            className={`size-9 rounded-md text-sm font-medium transition-colors ${
                              currentPage === page
                                ? "bg-br-accent text-white"
                                : "text-br-text-secondary hover:bg-br-hover"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="gap-1 text-br-dark/70"
                        aria-label="Next page"
                      >
                        Next
                        <ChevronRight className="size-4" />
                      </Button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex items-center justify-center size-16 rounded-full bg-br-light mb-4">
                    <FileText className="size-7 text-br-dark/30" />
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-br-primary mb-1">
                    No articles found
                  </h3>
                  <p className="text-sm text-br-text-secondary mb-6 max-w-sm">
                    Try adjusting your search or filter to find what you&apos;re looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2 text-br-primary border-br-primary/30 hover:bg-br-primary hover:text-white"
                  >
                    <ArrowRight className="size-4 rotate-180" />
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar — sticky newsletter (desktop only) */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24">
                <NewsletterSubscribe variant="sidebar" source="blog_sidebar" />
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-br-light py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-br-primary sm:text-3xl">
              Ready to analyze your first RFP?
            </h2>
            <p className="mt-3 text-br-dark/70">
              Try BidRank&apos;s free RFP analyzer and get an instant compliance
              score, risk assessment, and key findings.
            </p>
            <Link
              href="/free-tool"
              onClick={() => analytics.blogCtaClick("blog_listing", "try_free_analyzer")}
              className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-br-accent px-6 font-semibold text-br-primary shadow-sm transition-colors hover:bg-br-accent/90"
            >
              Try Free Analyzer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}