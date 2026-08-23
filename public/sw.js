/**
 * WHYNOTUPSC / REDROOM — TACTICAL OFFLINE SERVICE WORKER (PWA)
 * Strategy:
 * 1. Cache-First for static assets (JS, CSS, fonts, icons)
 * 2. Stale-While-Revalidate for app routes & navigation
 * 3. Network-Only for /api/* requests with Dexie outbox handling offline fallback
 */

const CACHE_NAME = "redroom-pwa-v2";

const CORE_ASSETS = [
  "/",
  "/dashboard",
  "/syllabus",
  "/pyqs",
  "/mains-pyqs",
  "/csat",
  "/revision",
  "/notes",
  "/tests",
  "/assistant",
  "/chill-zone",
  "/manifest.json",
  "/favicon.ico",
];

// 1. Install Event: Pre-cache core tactical routes
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn("[Service Worker] Pre-caching partial warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch Event: Stale-While-Revalidate for UI, pass-through for /api
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Do not cache API mutations or telemetry (handled by Dexie Outbox)
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Navigation requests (HTML pages): Stale-While-Revalidate with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          const dashboardFallback = await caches.match("/dashboard");
          return dashboardFallback || caches.match("/");
        })
    );
    return;
  }

  // Static Assets (CSS, JS, Fonts, Images): Cache-First with background revalidation
  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico")
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    );
  }
});
