import "server-only";
import { ServerActionError } from "@/lib/actions/errorAction";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
interface HttpConfig {
  baseUrl?: string;
  token?: string | null;
}

export async function http<T>(
  path: string,
  {
    method = "GET",
    body,
    headers,
  }: { method?: Method; body?: unknown; headers?: HeadersInit } = {},
  config?: HttpConfig
): Promise<T> {
  const base = config?.baseUrl ?? process.env.NEXT_PUBLIC_API_BASE_URL!;
  const url = path.startsWith("http") ? path : `${base}${path}`;

  const h = new Headers(headers);
  if (!h.has("Content-Type") && body !== undefined) h.set("Content-Type", "application/json");
  if (config?.token) h.set("Authorization", `Bearer ${config.token}`);

  const res = await fetch(url, {
    method,
    headers: h,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {}
    throw new ServerActionError(msg, res.status);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}
