/**
 * REDROOM PWA — Native Push Notifications & Background Periodic Sync Utility
 */

export interface CadetNotificationPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/**
 * Requests native notification permissions from the candidate's browser.
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    console.warn("[PWA Notifications] Notification API not supported on this browser.");
    return "denied";
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await registerPeriodicBackgroundSync();
    }
    return permission;
  } catch (err) {
    console.warn("[PWA Notifications] Permission request error:", err);
    return "denied";
  }
}

/**
 * Registers Periodic Background Sync for morning editorial downloads and spaced repetition scheduling.
 */
export async function registerPeriodicBackgroundSync(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check if Periodic Sync API is supported (Chromium / PWA)
    if ("periodicSync" in registration) {
      const periodicSync = (registration as any).periodicSync;

      // 1. Morning Editorial Sync (Every 12 hours)
      try {
        await periodicSync.register("morning-editorial-sync", {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });
        console.log("[PWA Periodic Sync] Registered: morning-editorial-sync");
      } catch (e) {
        console.warn("[PWA Periodic Sync] Failed morning-editorial-sync registration:", e);
      }

      // 2. Spaced Repetition Due Cards Schedule (Every 6 hours)
      try {
        await periodicSync.register("spaced-repetition-schedule", {
          minInterval: 6 * 60 * 60 * 1000, // 6 hours
        });
        console.log("[PWA Periodic Sync] Registered: spaced-repetition-schedule");
      } catch (e) {
        console.warn("[PWA Periodic Sync] Failed spaced-repetition-schedule registration:", e);
      }

      return true;
    }
    return false;
  } catch (err) {
    console.warn("[PWA Periodic Sync] Error registering background sync:", err);
    return false;
  }
}

/**
 * Dispatches an immediate or scheduled local notification to the cadet.
 */
export async function sendCadetNotification(payload: CadetNotificationPayload): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: payload.tag || "cadet-alert",
      data: { url: payload.url || "/dashboard" },
    });
    return true;
  } catch {
    // Fallback to standard window Notification constructor
    try {
      new Notification(payload.title, {
        body: payload.body,
        icon: "/favicon.ico",
      });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Schedules daily morning study target & streak reminder.
 */
export function scheduleCadetDailyAlert(): void {
  if (typeof window === "undefined" || Notification.permission !== "granted") return;

  const now = new Date();
  const targetHour = 7; // 7:00 AM daily
  const nextAlert = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    targetHour,
    0,
    0,
    0
  );

  if (now.getTime() > nextAlert.getTime()) {
    nextAlert.setDate(nextAlert.getDate() + 1);
  }

  const delayMs = nextAlert.getTime() - now.getTime();

  setTimeout(() => {
    void sendCadetNotification({
      title: "🌅 Redroom Morning Briefing (07:00 AM)",
      body: "Your daily General Studies & Current Affairs targets are live. Maintain your study streak!",
      url: "/dashboard",
      tag: "morning-study-target",
    });
  }, Math.min(delayMs, 2147483647)); // Cap at setTimeout 32-bit integer limit
}
