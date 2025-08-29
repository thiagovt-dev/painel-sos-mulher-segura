"use server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/helper";
import { decodeSession, isTokenExpired, compressToken, decodeJwtExp } from "@/lib/auth/decompress-token";
import { http } from "@/lib/http/httpClient";
import type { LoginResponse } from "@/types/auth.interface";

export async function getSessionToken(): Promise<string> {
  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) throw new Error("Unauthorized");
  const session = decodeSession(cookie.value);
  if (!session) throw new Error("Unauthorized");

  // If token is near expiration, try to refresh using refresh_token
  if (isTokenExpired(session.token, 120)) {
    if (!session.refreshToken) {
      // No refresh token; clear session and fail
      try { store.delete(SESSION_COOKIE_NAME); } catch {}
      throw new Error("Unauthorized");
    }
    try {
      const res = await http<LoginResponse>("/auth/refresh", {
        method: "POST",
        body: { refresh_token: session.refreshToken },
      });
      const newCookie = compressToken(
        res.access_token,
        res.user ?? session.user,
        res.refresh_token ?? session.refreshToken
      );
      const exp = decodeJwtExp(res.access_token);
      const now = Math.floor(Date.now() / 1000);
      const ttl = typeof exp === "number" ? Math.max(exp - now, 0) : undefined;
      store.set(SESSION_COOKIE_NAME, newCookie, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: ttl,
        secure: process.env.NODE_ENV === "production",
      });
      return res.access_token;
    } catch {
      try { store.delete(SESSION_COOKIE_NAME); } catch {}
      throw new Error("Unauthorized");
    }
  }

  return session.token;
}
