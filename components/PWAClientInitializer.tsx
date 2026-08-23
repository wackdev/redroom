"use client";

import { useEffect } from "react";
import { idb } from "@/lib/db/indexed-db";
import { initSyncDispatcher } from "@/lib/sync/dispatcher";

export default function PWAClientInitializer() {
  useEffect(() => {
    // 1. Transparent LocalStorage to IndexedDB Migration
    void idb.migrateFromLocalStorage();

    // 2. Start Background Outbox Sync Dispatcher
    initSyncDispatcher();

    // 2. Service Worker Registration for True Offline Usage
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("WHYNOTUPSC Offline Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.warn("Service worker registration failed:", err);
          });
      });
    }
  }, []);

  return null;
}
