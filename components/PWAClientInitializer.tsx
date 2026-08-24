"use client";

import { useEffect } from "react";
import { idb } from "@/lib/db/indexed-db";
import { initSyncDispatcher, triggerOutboxFlush } from "@/lib/sync/dispatcher";
import { registerPeriodicBackgroundSync, scheduleCadetDailyAlert } from "@/lib/pwa/notifications";

export default function PWAClientInitializer() {
  useEffect(() => {
    // 1. Transparent LocalStorage to IndexedDB Migration
    void idb.migrateFromLocalStorage();

    // 2. Start Background Outbox Sync Dispatcher
    initSyncDispatcher();

    // 3. Service Worker Registration & Background Sync
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Listen for messages from Service Worker (e.g. outbox flush on reconnect)
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "TRIGGER_OUTBOX_FLUSH") {
          void triggerOutboxFlush();
        }
      });

      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then(async (reg) => {
            console.log("WHYNOTUPSC Offline Service Worker registered:", reg.scope);
            // Register periodic background sync
            await registerPeriodicBackgroundSync();
            // Schedule daily study alerts
            scheduleCadetDailyAlert();
          })
          .catch((err) => {
            console.warn("Service worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
