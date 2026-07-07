import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth";
import { NextRequest } from "next/dist/server/web/spec-extension/request";

export const runtime = "nodejs";

const publicPaths = new Set([
  "/",
  "/sign-in",
  "/sign-up",
  "/welcome",
  "/pricing",
  "/resources",
  "/analyzer",
  "/free-tool",
  "/about",
  "/security",
  "/contact",
  "/partners",
  "/privacy",
  "/terms",
  "/refunds",
  "/cookies",
  "/dashboard",
]);

const publicPrefixes = [
  "/api/webhooks/",
  "/api/analyze",
  "/api/checkout",
  "/api/consultants",
  "/api/debug-",
  "/api/user-plan",
  "/api/auth/",
  "/api/analytics/",
  "/api/admin/",
  "/api/newsletter/",
  "/api/free-analyze",
  "/api/email/",
  "/api/referral/",
  "/api/shared-report/",
  "/api/share-og-image",
  "/api/founding-members",
  "/blog",
  "/case-studies",
  "/compare",
  "/tools",
  "/shared/",
];

function isPublicRoute(pathname: string): boolean {
  if (publicPaths.has(pathname)) return true;
  if (publicPrefixes.some((p) => pathname.startsWith(p))) return true;
  return false;
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Check session via Better Auth
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }
  } catch {
    // If session check fails, let request through (don't block)
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};