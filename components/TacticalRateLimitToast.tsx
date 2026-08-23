"use client";

import { useEffect, useState } from "react";

export interface RateLimitToastPayload {
  message?: string;
  retryAfterSeconds?: number;
}

export default function TacticalRateLimitToast() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("SYSTEM COOLING: API LIMIT REACHED");
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    const handleRateLimitEvent = (event: Event) => {
      const customEvent = event as CustomEvent<RateLimitToastPayload>;
      const detail = customEvent.detail || {};

      setMessage(detail.message || "SYSTEM COOLING: API LIMIT REACHED");
      setSecondsRemaining(detail.retryAfterSeconds || 60);
      setVisible(true);
    };

    window.addEventListener("redroom_rate_limit_exceeded", handleRateLimitEvent);
    return () => {
      window.removeEventListener("redroom_rate_limit_exceeded", handleRateLimitEvent);
    };
  }, []);

  useEffect(() => {
    if (!visible || secondsRemaining <= 0) {
      if (visible && secondsRemaining <= 0) {
        setVisible(false);
      }
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [visible, secondsRemaining]);

  if (!visible) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short rounded-2xl border border-red-500/40 bg-[#0c0507]/95 p-4 shadow-[0_0_30px_rgba(239,68,68,0.25)] backdrop-blur-xl transition-all">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-lg text-red-400">
          ❄️
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-red-400">
              TACTICAL ALERT
            </h4>
            <span className="font-mono text-xs font-bold text-red-300">
              Cooldown: {timeFormatted}
            </span>
          </div>

          <p className="mt-1 text-sm font-semibold text-white/90">
            {message}
          </p>

          <p className="mt-1 text-xs text-white/50">
            Free tier neural quota preserved. Neural link will automatically restore once cooled.
          </p>

          {/* Cooldown Progress bar */}
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-1000"
              style={{
                width: `${Math.min(100, (secondsRemaining / 60) * 100)}%`,
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-white/40 transition hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Utility helper to trigger the rate limit toast from any client component or fetch handler.
 */
export function triggerRateLimitToast(payload?: RateLimitToastPayload): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("redroom_rate_limit_exceeded", {
        detail: payload,
      })
    );
  }
}
