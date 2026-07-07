import { auth } from "@/lib/better-auth";
import { headers } from "next/headers";

// Server-side helper: get current session + userId
export async function getSession() {
  const hdrs = await headers();
  return auth.api.getSession({ headers: hdrs });
}

export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    return null;
  }
  return session;
}