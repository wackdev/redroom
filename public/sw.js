/**
 * WHYNOTUPSC / REDROOM — TACTICAL OFFLINE SERVICE WORKER (PWA)
 * Strategy:
 * 1. Cache-First for static assets (JS, CSS, fonts, icons)
 * 2. Stale-While-Revalidate for app routes & navigation
 * 3. Network-Only for /api/* requests with Dexie outbox handling offline fallback
 * 4. Periodic Background Sync (Morning Editorial Downloads & Spaced Repetition Scheduling)
 * 5. Native Push Notifications & Interactive Action Handlers
 */

const CACHE_NAME = "redroom-pwa-v3";

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
  "/performance",
  "/current-affairs",
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
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".json")
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

// 4. PERIODIC BACKGROUND SYNC API
// Allows background execution while device is asleep/charging
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "morning-editorial-sync") {
    event.waitUntil(
      (async () => {
        try {
          // Pre-cache daily current affairs updates
          const res = await fetch("/api/current-affairs?limit=10");
          if (res.ok) {
            const cache = await caches.open(CACHE_NAME);
            await cache.put("/api/current-affairs", res.clone());
          }
        } catch (err) {
          console.warn("[PWA Periodic Sync] Editorial sync warning:", err);
        }
      })()
    );
  } else if (event.tag === "spaced-repetition-schedule") {
    event.waitUntil(
      (async () => {
        try {
          // Notify cadet of due flashcards if permissions granted
          if (self.Notification && self.Notification.permission === "granted") {
            await self.registration.showNotification("🎯 Spaced Repetition Due", {
              body: "You have pending flashcards ready for today's active recall revision.",
              icon: "/favicon.ico",
              badge: "/favicon.ico",
              tag: "spaced-repetition-alert",
              data: { url: "/revision" },
            });
          }
        } catch (err) {
          console.warn("[PWA Periodic Sync] Spaced repetition schedule warning:", err);
        }
      })()
    );
  }
});

// 5. ONE-SHOT BACKGROUND SYNC (OUTBOX MUTATION FLUSH)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-outbox") {
    event.waitUntil(
      (async () => {
        // Broadcast message to all active window clients to trigger immediate outbox flush
        const allClients = await self.clients.matchAll({ includeUncontrolled: true });
        for (const client of allClients) {
          client.postMessage({ type: "TRIGGER_OUTBOX_FLUSH" });
        }
      })()
    );
  }
});

// 6. NATIVE WEB PUSH NOTIFICATIONS
self.addEventListener("push", (event) => {
  let data = {
    title: "⚡ REDROOM OS Alert",
    body: "Time for your scheduled UPSC study session.",
    url: "/dashboard",
  };

  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch {
    if (event.data) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [100, 50, 100],
    data: { url: data.url || "/dashboard" },
    actions: [
      { action: "open_app", title: "🚀 Open Cadet Station" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 7. NOTIFICATION CLICK HANDLER
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "dismiss") {
    return;
  }

  const targetUrl = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});
