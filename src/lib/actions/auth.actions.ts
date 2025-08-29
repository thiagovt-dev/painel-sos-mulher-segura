"use server";

import { cookies } from "next/headers";
import { withErrorHandling } from "@/lib/actions/errorAction";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SEC } from "@/lib/auth/helper";
import { compressToken, decodeJwtExp } from "@/lib/auth/decompress-token";
import { http } from "@/lib/http/httpClient";
import { getSessionToken } from "./_getSessionToken";
import type { LoginRequest, LoginResponse } from "@/types/auth.interface";

export async function loginAction(payload: LoginRequest) {
  return withErrorHandling(async () => {
    const data = await http<LoginResponse>("/auth/login", { method: "POST", body: payload });
    console.log("Login data", data);
    if (!data.access_token) throw new Error("No access token returned");
    if (data.user && !data.user.roles.includes("ADMIN")) throw new Error("User is not an admin");
    const store = await cookies();
    const compressed = compressToken(data.access_token, data.user, data.refresh_token);
    const exp = decodeJwtExp(data.access_token);
    const now = Math.floor(Date.now() / 1000);
    const ttl = typeof exp === "number" ? Math.max(exp - now, 0) : SESSION_MAX_AGE_SEC;
    store.set(SESSION_COOKIE_NAME, compressed, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: ttl,
      secure: process.env.NODE_ENV === "production",
    });
    return { token: data.access_token };
  });
}

export async function logoutAction() {
  return withErrorHandling(async () => {
    const store = await cookies();
    store.delete(SESSION_COOKIE_NAME);
    return { ok: true };
  });
}

export async function checkSessionAction() {
  return withErrorHandling(async () => {
    await getSessionToken();
    return { ok: true };
  });
}
