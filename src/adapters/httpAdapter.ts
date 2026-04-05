import type { AdapterConfig } from "../config/types.js";

type HttpAdapter = Extract<AdapterConfig, { type: "http" }>;

const DEFAULT_TIMEOUT_MS = 30_000;

export async function runHttpAdapter(
  adapter: HttpAdapter,
  text: string,
): Promise<{ status: number; body: string }> {
  const param = adapter.queryParam ?? "text";
  const u = new URL(adapter.url);
  u.searchParams.set(param, text);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), DEFAULT_TIMEOUT_MS);
  try {
    const res = await fetch(u, { signal: ctrl.signal });
    const body = await res.text();
    return { status: res.status, body };
  } finally {
    clearTimeout(timer);
  }
}
