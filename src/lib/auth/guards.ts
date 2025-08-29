import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { decodeSession } from "@/lib/auth/decompress-token";
import type { MeProfile } from "@/types/auth.interface";
import { getSessionToken } from "@/lib/actions/_getSessionToken";

export interface Session {
  token: string;
  user: MeProfile;
}

export async function getCurrentUser(): Promise<Session | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  const parsed = decodeSession(cookie.value);
  if (!parsed || !parsed.user) return null;
  try {
    // Ensure token is valid (and refresh if needed)
    await getSessionToken();
  } catch {
    return null;
  }
  return { token: parsed.token, user: parsed.user };
}

export async function requireAdmin(): Promise<Session> {
  const session = await getCurrentUser();
  if (!session || !session.user.roles?.includes("ADMIN")) {
    redirect("/login");
  }
  return session;
}
