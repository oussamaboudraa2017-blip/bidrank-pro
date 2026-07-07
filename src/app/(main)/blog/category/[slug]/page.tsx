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
import { Calendar, Clock, User, ArrowRight } from "lucide-react";
import {
  CATEGORIES,
  getPostsByCategory,
  type CategorySlug,
} from "@/lib/blog-data";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    return {};
  }

  return {
    title: `${category.label} | BidRank Blog`,
    description: category.description,
    alternates: {
      canonical: `https://www.bidrank.pro/blog/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.label} | BidRank Blog`,
      description: category.description,
      url: `https://www.bidrank.pro/blog/category/${category.slug}`,
      siteName: "BidRank",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.label} | BidRank Blog`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(slug as CategorySlug);

  return (
    <>
      {/* Page Header */}
      <section className="bg-br-light py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/blog">Blog</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.label}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center">
            <Badge className="mb-4 bg-br-accent/15 text-br-accent border-br-accent/30 hover:bg-br-accent/20">
              {category.label}
            </Badge>
            <h1 className="text-3xl font-heading font-bold text-br-primary sm:text-4xl md:text-5xl">
              {category.label}
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-br-dark/70">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {posts.length > 0 ? (
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
                          <User className="size-3" />
                          {post.author}
                        </span>
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
          ) : (
            <div className="text-center py-16">
              <p className="text-br-dark/50 text-lg">
                No articles in this category yet.
              </p>
              <Link
                href="/blog"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-br-secondary hover:text-br-primary transition-colors"
              >
                Browse all articles
                <ArrowRight className="size-4" />
              </Link>
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
          </Link>
        </div>
      </section>
    </>
  );
}