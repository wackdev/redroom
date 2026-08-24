"use client";

import { useState, useEffect } from "react";
import { requestNotificationPermission, sendCadetNotification } from "@/lib/pwa/notifications";
import { sound } from "@/lib/audio/sound-engine";

export default function PushNotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  // Telegram Integration State
  const [telegramStatus, setTelegramStatus] = useState<{
    isOnline: boolean;
    configured: boolean;
    botName?: string;
    username?: string;
  }>({ isOnline: false, configured: false });

  const [customChatId, setCustomChatId] = useState("");
  const [isSavingChatId, setIsSavingChatId] = useState(false);
  const [telegramTestLoading, setTelegramTestLoading] = useState(false);
  const [telegramTestFeedback, setTelegramTestFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
    }

    try {
      const savedChatId = localStorage.getItem("whynotupsc_telegram_chat_id");
      if (savedChatId) setCustomChatId(savedChatId);
    } catch {}

    // Check Telegram Bot Status
    void fetch("/api/telegram/status")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setTelegramStatus(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleEnableNotifications = async () => {
    setLoading(true);
    sound.playClick();
    const result = await requestNotificationPermission();
    setPermission(result);
    setLoading(false);

    if (result === "granted") {
      sound.playVictory();
      void sendCadetNotification({
        title: "🛡️ REDROOM Notifications Activated",
        body: "Daily revision targets, periodic background sync, and streak reminders are now active!",
        url: "/dashboard",
      });
    }
  };

  const handleSendTestNotification = () => {
    sound.playClick();
    void sendCadetNotification({
      title: "🎯 Tactical UPSC Study Check-in",
      body: "Spaced Repetition & Mains answer writing sprint ready for today.",
      url: "/revision",
    });
  };

  const handleSaveTelegramChatId = () => {
    sound.playClick();
    setIsSavingChatId(true);
    try {
      if (customChatId.trim()) {
        localStorage.setItem("whynotupsc_telegram_chat_id", customChatId.trim());
      } else {
        localStorage.removeItem("whynotupsc_telegram_chat_id");
      }
      setTelegramTestFeedback("✓ Telegram Chat ID saved locally!");
    } catch {
      setTelegramTestFeedback("Failed to save Chat ID.");
    } finally {
      setTimeout(() => setIsSavingChatId(false), 800);
    }
  };

  const handleSendTestTelegram = async () => {
    setTelegramTestLoading(true);
    setTelegramTestFeedback(null);
    sound.playHover();

    try {
      const res = await fetch("/api/telegram/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "admin_alert",
          title: "🎯 WHYNOTUPSC ASPIRANT TELEGRAM CONNECTION TEST",
          message: "Your Telegram Intelligence Node is active and connected to WHYNOTUPSC OS!",
          priority: "NORMAL",
          chatId: customChatId.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (json.success) {
        sound.playVictory();
        setTelegramTestFeedback("✓ Test message dispatched to Telegram!");
      } else {
        setTelegramTestFeedback(`⚠️ ${json.error?.message || "Failed to send message"}`);
      }
    } catch {
      setTelegramTestFeedback("⚠️ Network error while dispatching to Telegram.");
    } finally {
      setTelegramTestLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* 1. BROWSER PWA PUSH NOTIFICATIONS */}
      {typeof window !== "undefined" && "Notification" in window && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/10 border border-pink-500/30 text-lg">
              🔔
            </div>
            <div>
              <h4 className="text-xs font-bold text-white sm:text-sm">
                Native PWA Push Notifications & Periodic Sync
              </h4>
              <p className="text-[11px] text-white/60">
                {permission === "granted"
                  ? "✓ Active: Daily morning briefs (07:00 AM) & offline background sync enabled"
                  : "Enable native browser alerts for daily revision targets & streak reminders"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {permission === "granted" ? (
              <button
                onClick={handleSendTestNotification}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition"
              >
                ⚡ Test Alert
              </button>
            ) : (
              <button
                onClick={handleEnableNotifications}
                disabled={loading}
                className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-1.5 text-xs font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Enabling..." : "🔔 Enable Push Alerts"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. TELEGRAM INTELLIGENCE NODE & BOT STATUS CARD */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sky-500/30 bg-sky-950/10 p-4 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-500/40 text-lg">
            ✈️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white sm:text-sm">
                Telegram Intelligence Bot & Weekly Digest Mirror
              </h4>
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold ${
                  telegramStatus.isOnline
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}
              >
                {telegramStatus.isOnline
                  ? `● Bot Online (@${telegramStatus.username || "Bot"})`
                  : telegramStatus.configured
                  ? "Bot Configured"
                  : "Bot Token Optional"}
              </span>
            </div>
            <p className="text-[11px] text-white/60">
              Receive Sunday performance audits, starred notes, and morning editorials directly in your Telegram
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Custom Chat ID (e.g. 123456789)"
            value={customChatId}
            onChange={(e) => setCustomChatId(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-xs text-white placeholder-white/30 focus:border-sky-400 focus:outline-none w-48"
          />

          <button
            onClick={handleSaveTelegramChatId}
            className="rounded-xl border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 font-mono text-xs font-bold text-sky-300 hover:bg-sky-500/20 transition"
          >
            {isSavingChatId ? "Saving..." : "Save ID"}
          </button>

          <button
            onClick={handleSendTestTelegram}
            disabled={telegramTestLoading}
            className="rounded-xl bg-sky-600 px-3.5 py-1.5 font-mono text-xs font-bold text-white shadow-lg shadow-sky-950/50 hover:bg-sky-500 transition active:scale-95 disabled:opacity-50"
          >
            {telegramTestLoading ? "Sending..." : "🚀 Test Telegram"}
          </button>
        </div>

        {telegramTestFeedback && (
          <div className="w-full text-xs font-mono text-sky-300 pt-1 border-t border-sky-500/10">
            {telegramTestFeedback}
          </div>
        )}
      </div>
    </div>
  );
}
