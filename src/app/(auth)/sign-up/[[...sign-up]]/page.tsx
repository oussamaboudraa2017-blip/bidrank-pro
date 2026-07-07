"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { analytics } from "@/lib/analytics";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Funnel: signup page view
  useEffect(() => {
    const refCode = new URLSearchParams(window.location.search).get("ref");
    analytics.signupPageViewed(!!refCode);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    analytics.signupAttempted("email");

    try {
      // Check for referral code in URL
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get("ref");

      const result = await signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
        fetchOptions: {
          onError: (ctx: any) => {
            console.error("[SignUp Error]", ctx);
            const msg =
              ctx?.error?.error?.message ||
              ctx?.error?.message ||
              ctx?.error?.error ||
              "Sign-up failed. Please try again.";
            const errorMsg = typeof msg === "string" ? msg : JSON.stringify(msg);
            setError(errorMsg);
            analytics.signupFailed("email", errorMsg);
          },
          onSuccess: () => {
            analytics.userSignedUp("email");
            if (refCode) analytics.referralConverted(refCode);
            // After sign-up, set trial dates via callback
            fetch("/api/auth/callback/signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, referralCode: refCode }),
            }).catch(() => {});
          },
        },
      });

      if (result?.error) {
        const msg =
          result.error?.message ||
          (typeof result.error === "string" ? result.error : null) ||
          "Sign-up failed.";
        setError(msg);
      }
    } catch (err: any) {
      console.error("[SignUp Exception]", err);
      setError(err?.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-br-light">
      {/* Header */}
      <div className="bg-br-primary py-6 px-4 text-center">
        <Link href="/" className="text-2xl font-bold text-white no-underline">
          BidRank<span className="text-br-accent">.pro</span>
        </Link>
      </div>

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-heading text-2xl font-bold text-br-primary text-center mb-2">
            Create Your Account
          </h1>
          <p className="text-sm text-center text-br-text-secondary mb-6">
            3-day free trial starts on sign-up.
          </p>

          {/* Google Sign-Up Button */}
          <button
            type="button"
            onClick={() => {
              analytics.signupAttempted("google");
              const params = new URLSearchParams(window.location.search);
              const ref = params.get("ref");
              const callbackURL = "/dashboard";
              signIn.social({
                provider: "google",
                callbackURL,
                fetchOptions: {
                  onError: (ctx: any) => {
                    console.error("[Google SignUp Error]", ctx);
                    alert(ctx.error?.message || "Google sign-up failed. Try email instead.");
                  },
                  onSuccess: () => {
                    analytics.userSignedUp("google");
                    if (ref) analytics.referralConverted(ref);
                    // After Google sign-up, set trial dates
                    fetch("/api/auth/callback/signup", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ referralCode: ref }),
                    }).catch(() => {});
                  },
                },
              });
            }}
            className="w-full flex items-center justify-center gap-3 border border-br-border rounded-lg py-2.5 px-4 text-sm font-medium text-br-text-secondary hover:bg-br-light transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-br-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-br-surface px-2 text-br-text-secondary">or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-br-text-secondary mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-br-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-br-accent focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-br-text-secondary mb-1">
                Work Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 border border-br-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-br-accent focus:border-transparent"
                placeholder="john@company.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-br-text-secondary mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 border border-br-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-br-accent focus:border-transparent"
                placeholder="Minimum 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-br-accent hover:bg-br-accent/90 text-br-dark font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-xs text-center text-br-text-secondary mt-4">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-br-primary underline font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}