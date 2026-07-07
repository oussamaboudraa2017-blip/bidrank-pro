import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/lib/blog-data";
import { Calendar, Clock, User } from "lucide-react";
import { PdfDownloadCard } from "@/components/bidrank/blog/EmailSubscribe";
import { NewsletterSubscribe } from "@/components/bidrank/newsletter/NewsletterSubscribe";
import { RoiCalculator } from "@/components/bidrank/blog/RoiCalculator";
import { ShareButtons } from "@/components/bidrank/blog/ShareButtons";
import { TableOfContentsClient } from "@/components/bidrank/blog/TableOfContentsClient";
import { PageTracker } from "@/components/bidrank/tracking/PageTracker";
import { ScrollDepthTracker } from "@/components/bidrank/tracking/ScrollDepthTracker";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Article Not Found | BidRank Blog" };
  }

  return {
    title: `${post.title} | BidRank Blog`,
    description: post.description,
    keywords: [post.targetKeyword, "federal contracting", "RFP analysis", "GovCon"],
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://www.bidrank.pro/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `https://www.bidrank.pro/blog/${post.slug}`,
    },
  };
}

function ArticleJsonLd({ post }: { post: NonNullable<ReturnType<typeof getBlogPost>> }) {
  // Strip HTML tags and count words
  const plainText = post.content.replace(/<[^>]*>/g, "");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    wordCount,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorTitle,
    },
    publisher: {
      "@type": "Organization",
      name: "BidRank.pro",
      url: "https://www.bidrank.pro",
      logo: {
        "@type": "ImageObject",
        url: "https://www.bidrank.pro/logo.svg",
        width: 200,
        height: 40,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.bidrank.pro/blog/${post.slug}`,
    },
    image: "https://www.bidrank.pro/og-image.png",
    keywords: [post.targetKeyword, "federal contracting", "RFP analysis", "GovCon", post.category].join(", "),
    articleSection: post.category,
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Inject a mid-post CTA after the second h2
function injectMidPostCta(html: string): string {
  const h2Regex = /<h2>/g;
  let count = 0;
  let result = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = h2Regex.exec(html)) !== null) {
    count++;
    result += html.slice(lastIndex, match.index);
    if (count === 2) {
      result += `
<div style="background:linear-gradient(135deg,#1A3A5C,#2B5B8C);border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
  <p style="color:#D4A843;font-weight:600;font-size:13px;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Try It Free</p>
  <p style="color:#fff;font-size:18px;font-weight:700;margin:0 0 12px;">Analyze your next RFP in 60 seconds</p>
  <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0 0 16px;">Upload any federal solicitation and get an instant compliance score.</p>
  <a href="/free-tool" style="display:inline-block;background:#D4A843;color:#1A3A5C;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">Analyze an RFP Free &rarr;</a>
</div>`;
    }
    result += match[0];
    lastIndex = match.index + match[0].length;
  }
  result += html.slice(lastIndex);
  return result;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(slug, 3);
  const contentWithCta = injectMidPostCta(post.content);

  return (
    <>
      <PageTracker event="blog_article_read" slug={slug} />
      <ScrollDepthTracker slug={slug} />
      <ArticleJsonLd post={post} />

      {/* Breadcrumb */}
      <div className="bg-br-light border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm truncate max-w-[200px] sm:max-w-none">
                  {post.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Article Header */}
      <header className="py-10 md:py-14">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link href={`/blog/category/${post.categorySlug}`}>
              <Badge
                className="text-xs font-medium bg-br-primary/8 text-br-primary border border-br-primary/15 hover:bg-br-primary/15"
              >
                {post.category}
              </Badge>
            </Link>
            <ShareButtons
              url={`https://www.bidrank.pro/blog/${post.slug}`}
              title={post.title}
            />
          </div>
          <h1 className="text-3xl font-heading font-bold text-br-primary leading-tight sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-br-dark/70 leading-relaxed">
            {post.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-br-text-secondary">
            <span className="flex items-center gap-1.5">
              <User className="size-4" />
              <span className="font-medium text-br-dark/80">{post.author}</span>
              <span className="text-br-dark/40">&middot; {post.authorTitle}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </header>

      {/* Article Body + TOC Sidebar */}
      <article className="pb-12 md:pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-12">
            {/* Table of Contents Sidebar */}
            <TableOfContentsClient content={post.content} />

            {/* Article Content */}
            <div className="flex-1 min-w-0">
              <div
                className="prose-br"
                dangerouslySetInnerHTML={{ __html: contentWithCta }}
              />
            </div>
          </div>
        </div>
      </article>

      {/* PDF Download Card */}
      {post.hasPdfChecklist && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-8">
          <PdfDownloadCard />
        </div>
      )}

      {/* ROI Calculator */}
      {post.hasRoiCalculator && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pb-8">
          <RoiCalculator />
        </div>
      )}

      {/* Email Subscription — "Loved this article?" */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-12">
        <NewsletterSubscribe variant="post_footer" source="blog_post" />
      </div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-heading font-bold text-br-primary mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group"
                >
                  <Card className="h-full bg-br-surface border-br-border rounded-xl shadow-br-sm card-hover py-0 gap-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className="text-xs font-medium bg-br-primary/8 text-br-primary border border-br-primary/15"
                        >
                          {related.category}
                        </Badge>
                        <span className="text-sm text-br-text-secondary flex items-center gap-1">
                          <Clock className="size-3" />
                          {related.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-lg font-heading leading-snug text-br-primary group-hover:text-br-secondary transition-colors">
                        {related.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-br-text-secondary line-clamp-2">
                        {related.description}
                      </p>
                      <div className="mt-3 pt-3 border-t border-br-border text-sm text-br-text-secondary flex items-center gap-1">
                        <Calendar className="size-3" />
                        {new Date(related.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}