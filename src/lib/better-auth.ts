import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

const authSecret = process.env.BETTER_AUTH_SECRET;
if (!authSecret) {
  console.warn(
    "[Better Auth] ⚠️ BETTER_AUTH_SECRET is not set. Auth tokens will be unsigned and insecure. Set it in .env or Vercel env vars."
  );
}

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || "https://www.bidrank.pro",
  trustedOrigins: [
    "https://www.bidrank.pro",
    "https://bidrank.pro",
    "https://bidrank-pro.vercel.app",
    "http://localhost:3000",
  ],
  secret: authSecret || "fallback-dev-secret-DO-NOT-USE-IN-PRODUCTION",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        socialProviders: {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        },
      }
    : {}),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
  },
  user: {
    additionalFields: {
      company: { type: "string", required: false, input: true },
      certifications: { type: "string[]", required: false, input: true },
      naicsCodes: { type: "string[]", required: false, input: true },
      plan: { type: "string", required: false, defaultValue: "free", input: true },
      referralCode: { type: "string", required: false, unique: true },
      referredByCode: { type: "string", required: false },
      analysesThisMonth: { type: "number", required: false, defaultValue: 0 },
      trialStartsAt: { type: "date", required: false },
      trialEndsAt: { type: "date", required: false },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;