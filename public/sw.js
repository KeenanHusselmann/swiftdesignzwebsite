/**
 * Swift Designz — Service Worker
 * ─────────────────────────────────────────────────────────────────
 * Strategy: Network-first with cache fallback.
 *
 * - On install: pre-caches the offline fallback page + key assets.
 * - On fetch:   tries the network first; on failure serves cache;
 *               for navigation requests with no cache, shows offline.html.
 * - On activate: purges stale caches from previous SW versions.
 *
 * This means visitors who have been to the site before will see
 * real cached pages even if Netlify limits are hit or the site is down.
 * First-time visitors will see the branded offline page.
 */

const CACHE_VERSION = "swift-v1";
const OFFLINE_URL   = "/offline.html";

// Assets pre-cached on SW install (available offline from first visit)
const PRECACHE_ASSETS = [
  "/offline.html",
  "/images/favicon.png",
  "/images/logo.png",
];

// ── Install ──────────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(PRECACHE_ASSETS)
    )
  );
  // Activate immediately without waiting for old SW to finish
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_VERSION)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Only handle same-origin requests (skip analytics, CDN, etc.)
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip Next.js internal routes & hot-reload
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;

  event.respondWith(networkFirst(request));
});

// ── Network-first strategy ────────────────────────────────────────────────
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache good responses for later
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (_networkError) {
    // Network failed — try the cache
    const cached = await caches.match(request);
    if (cached) return cached;

    // Nothing cached — show offline page for navigation requests
    if (request.mode === "navigate") {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }

    // Last resort: 503
    return new Response("Service unavailable. Please try again later.", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
