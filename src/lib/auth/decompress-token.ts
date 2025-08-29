
import type { MeProfile } from "@/types/auth.interface";

export interface StoredSession {
  token: string;
  refreshToken?: string;
  user?: MeProfile;
}

function base64urlEncode(input: string): string {
  return Buffer.from(input, "utf-8").toString("base64url");
}

function base64urlDecode(input: string): string {
  return Buffer.from(input, "base64url").toString("utf-8");
}

export function compressToken(token: string, user?: MeProfile, refreshToken?: string): string {
  // Store a compact JSON session as base64url to avoid special chars in cookie
  const session: StoredSession = { token, user, refreshToken };
  try {
    return base64urlEncode(JSON.stringify(session));
  } catch {
    // Fallback to raw token if stringify fails
    return token;
  }
}

export function decompressToken(value: string): string {
  // Backward/forward compatibility: try decode JSON session; otherwise treat as raw token
  try {
    const json = base64urlDecode(value);
    const parsed = JSON.parse(json) as StoredSession;
    if (parsed && typeof parsed.token === "string") return parsed.token;
  } catch {}
  return value;
}

export function decodeSession(value: string): StoredSession | null {
  try {
    const json = base64urlDecode(value);
    const parsed = JSON.parse(json) as StoredSession;
    if (!parsed || typeof parsed.token !== "string") return null;
    return parsed;
  } catch {
    // If it's a raw token string (legacy), expose only token
    return value ? { token: value } : null;
  }
}

export function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = Buffer.from(payload, "base64").toString("utf-8");
    const obj = JSON.parse(json) as { exp?: number };
    return typeof obj.exp === "number" ? obj.exp : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewSeconds = 30): boolean {
  const exp = decodeJwtExp(token);
  if (!exp) return false; // if unknown, assume valid
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + skewSeconds;
}
