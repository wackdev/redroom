"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { UserSessionManager } from "@/lib/core/user-context";

export default function RealtimePresenceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sendHeartbeat = () => {
      try {
        const user = UserSessionManager.getActiveUser();
        const userId = user?.id || (typeof window !== "undefined" ? localStorage.getItem("whynotupsc_cadet_anon_id") || `cadet_${Math.random().toString(36).slice(2, 9)}` : "cadet_local");
        
        if (typeof window !== "undefined" && !localStorage.getItem("whynotupsc_cadet_anon_id")) {
          localStorage.setItem("whynotupsc_cadet_anon_id", userId);
        }

        const displayName = user?.fullName || (user?.email ? user.email.split("@")[0] : "Cadet Aspirant");

        void fetch("/api/presence/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            displayName,
            currentPath: pathname || "/",
          }),
        }).catch(() => {});
      } catch {}
    };

    // Initial heartbeat on route change
    sendHeartbeat();

    // 30s heartbeat interval
    const interval = setInterval(sendHeartbeat, 30000);
    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
