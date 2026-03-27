import { NextRequest, NextResponse } from "next/server";

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;

// Map of IP → array of request timestamps within the current window.
// Lives in module scope so it persists across requests in the same serverless
// instance. A cold start resets it, which is fine — this is defence-in-depth,
// not a hard enforcement boundary.
const hits = new Map<string, number[]>();

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/**
 * Returns a 429 NextResponse if the caller has exceeded the rate limit,
 * otherwise returns null (meaning the request may proceed).
 */
export function checkRateLimit(req: NextRequest): NextResponse | null {
  const ip = getIp(req);
  const now = Date.now();

  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);

  if (timestamps.length > MAX_REQUESTS) {
    return NextResponse.json(
      {
        error:
          "Too many requests — please wait a moment before trying again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": "60",
          "X-RateLimit-Limit": String(MAX_REQUESTS),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil((timestamps[0] + WINDOW_MS) / 1000)),
        },
      }
    );
  }

  return null;
}
