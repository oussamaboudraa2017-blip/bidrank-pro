import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import {
  getAllAuthors,
  getPostsByAuthor,
} from "@/lib/blog-data";

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({
    slug: encodeURIComponent(a.name),
  }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const authorName = decodeURIComponent(slug);
    const allAuthors = getAllAuthors();
    const author = allAuthors.find((a) => a.name === authorName);

    if (!author) {
      return { title: "Author Not Found | BidRank Blog" };
    }

    return {
      title: `${author.name} | BidRank Blog`,
      description: `Articles by ${author.name}, ${author.title} on BidRank. Expert insights on federal contracting, RFP strategy, and compliance.`,
      openGraph: {
        title: `${author.name} | BidRank Blog`,
        description: `Articles by ${author.name}, ${author.title} on BidRank. Expert insights on federal contracting, RFP strategy, and compliance.`,
        url: `https://www.bidrank.pro/blog/author/${encodeURIComponent(author.name)}`,
        siteName: "BidRank",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${author.name} | BidRank Blog`,
        description: `Articles by ${author.name}, ${author.title} on BidRank. Expert insights on federal contracting, RFP strategy, and compliance.`,
      },
      alternates: {
        canonical: `https://www.bidrank.pro/blog/author/${encodeURIComponent(author.name)}`,
      },
    };
  });
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const authorName = decodeURIComponent(slug);
  const allAuthors = getAllAuthors();
  const author = allAuthors.find((a) => a.name === authorName);

  if (!author) {
    notFound();
  }

  const posts = getPostsByAuthor(authorName);

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-br-light pt-8 pb-2">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-br-dark/60 hover:text-br-primary">
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/blog" className="text-br-dark/60 hover:text-br-primary">
                  Blog
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-br-primary font-medium">
                  {author.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Author Header */}
      <section className="bg-br-light pb-14 md:pb-18">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-br-primary text-white text-xl font-bold">
              {getInitials(author.name)}
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-br-primary sm:text-3xl md:text-4xl">
                {author.name}
              </h1>
              <p className="mt-1 text-br-dark/70">{author.title}</p>
              <p className="mt-1 text-sm text-br-text-secondary">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <p className="text-center text-br-dark/60 py-12">
              No posts found for this author.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <Card className="h-full bg-br-surface border-br-border rounded-xl shadow-br-sm card-hover py-0 gap-0">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          className="text-xs font-medium bg-br-primary/8 text-br-primary border border-br-primary/15"
                        >
                          {post.category}
                        </Badge>
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
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(post.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1 text-br-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                          Read more
                          <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-br-light py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-br-primary sm:text-3xl">
            Ready to analyze your first RFP?
          </h2>
          <p className="mt-3 text-br-dark/70">
            Try BidRank&apos;s free RFP analyzer and get an instant compliance
            score, risk assessment, and key findings.
          </p>
          <Link
            href="/free-tool"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-br-accent px-6 font-semibold text-br-primary shadow-sm transition-colors hover:bg-br-accent/90"
          >
            Try Free Analyzer
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}