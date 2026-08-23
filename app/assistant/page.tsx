"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { safeArray } from "@/lib/core/utils";
import { sound } from "@/lib/audio/sound-engine";
import AIStrategistWhy from "@/components/AIStrategistWhy";
import AuthGuard from "@/components/auth/AuthGuard";
import { triggerRateLimitToast } from "@/components/TacticalRateLimitToast";

interface ChatMessage {

  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  "Explain Basic Structure Doctrine with landmark Supreme Court cases",
  "How should I structure a 15-mark GS-2 answer on Federalism?",
  "Key constitutional articles & statutory bodies for UPSC Prelims",
  "Diagnose high-yield 60-day revision strategy for Environment & Economy",
];

export default function AssistantPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Greetings, Aspirant. I am **WHY**, your Strategic Intelligence Mentor for WHYNOTUPSC. Every strategy begins with WHY. I can evaluate your mains answer structures, diagnose revision decay, explain constitutional & economic mechanisms, or synthesize daily briefs. What is our objective today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    sound.playLock();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          contextInfo: "Target Year: 2026, Preparing for Prelims & Mains General Studies. AI Entity: WHY (WHYNOTUPSC).",
        }),
      });

      if (res.status === 429) {
        const json = await res.json().catch(() => ({}));
        const retryAfter = Number(res.headers.get("Retry-After")) || json.error?.retryAfterSeconds || 60;
        triggerRateLimitToast({
          message: json.error?.message || "SYSTEM COOLING: API LIMIT REACHED",
          retryAfterSeconds: retryAfter,
        });

        const errMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "⚠️ **SYSTEM COOLING ACTIVE**: Free tier neural quota reached. Please wait for the cooldown window before querying again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, errMsg]);
        return;
      }

      const contentType = res.headers.get("Content-Type") || "";

      if (contentType.includes("text/event-stream") && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        const aiMsgId = `ai-${Date.now()}`;
        let accumulatedContent = "";

        // Placeholder message to append stream chunks to
        setMessages((prev) => [
          ...prev,
          {
            id: aiMsgId,
            role: "assistant",
            content: "",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);

        let streamBuffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          streamBuffer += decoder.decode(value, { stream: true });
          const lines = streamBuffer.split("\n");
          streamBuffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("data: ")) {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                if (parsed.token) {
                  accumulatedContent += parsed.token;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === aiMsgId ? { ...msg, content: accumulatedContent } : msg
                    )
                  );
                }
              } catch {}
            }
          }
        }
        sound.playHover();
      } else {
        const json = await res.json();
        if (json.success && json.data?.message) {
          const aiMsg: ChatMessage = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: json.data.message,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, aiMsg]);
          sound.playHover();
        } else {
          const errMsg: ChatMessage = {
            id: `err-${Date.now()}`,
            role: "assistant",
            content: "Neural link momentarily disrupted. Please re-engage the query.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, errMsg]);
        }
      }
    } catch {
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Network telemetry error. Please verify your connection.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5] font-sans flex flex-col selection:bg-[#D8A63A] selection:text-black">
        {/* HEADER */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 w-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                data-cursor="BACK"
                className="font-mono text-xs text-[#F4C95D] transition hover:underline"
              >
                ← Command Centre
              </button>
              <span className="text-white/20">|</span>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#D8A63A] font-mono text-xs font-black text-black">
                  ↑
                </span>
                <span className="font-mono font-black tracking-widest text-sm text-white uppercase">
                  AI STRATEGIST // WHY
                </span>
              </div>
            </div>
            <span className="rounded-full border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1 font-mono text-[10px] font-bold text-[#F4C95D] animate-pulse">
              ● STRATEGIST ONLINE
            </span>
          </div>
        </header>


      {/* BODY CONTENT */}
      <div className="mx-auto max-w-4xl w-full flex-1 flex flex-col px-4 py-6 space-y-6">
        {/* TOP TACTICAL MISSIONS WIDGET */}
        <AIStrategistWhy />

        {/* CHAT LOG */}
        <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-4 sm:p-6 shadow-2xl flex-1 flex flex-col">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 font-mono text-xs text-[#8C8C8C]">
            <span>STRATEGIC DIALOGUE CHANNEL</span>
            <span className="text-[#F4C95D]">WHYNOTUPSC INTERNAL INTELLIGENCE</span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto min-h-[300px] max-h-[450px] pr-1">
            {safeArray(messages).map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-xs font-black text-[#F4C95D]">
                      W
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] to-[#B38322] text-black font-semibold"
                        : "border border-white/10 bg-black/50 text-white/90"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    <span className="mt-2 block font-mono text-[9px] text-white/40 text-right">
                      {m.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 font-mono text-xs font-black text-[#F4C95D] animate-spin">
                  W
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-[#F4C95D] animate-pulse">
                  WHY synthesizing strategic recommendations and diagnostic parameters...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="pt-4 pb-2 flex gap-2 overflow-x-auto">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                data-cursor="PROMPT"
                className="shrink-0 rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[11px] text-[#8C8C8C] hover:border-[#D8A63A]/50 hover:text-white transition"
              >
                ⚡ {prompt}
              </button>
            ))}
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="mt-3 flex gap-2 rounded-2xl border border-white/10 bg-black/60 p-2 focus-within:border-[#D8A63A]"
          >
            <input
              type="text"
              placeholder="Ask WHY anything (e.g. explain a concept, structure an answer, optimize schedule)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-transparent px-4 py-2 text-xs sm:text-sm text-white outline-none placeholder:text-white/30 font-sans"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              data-cursor="TRANSMIT"
              className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-5 py-2 font-mono text-xs font-black text-black transition hover:opacity-90 disabled:opacity-30"
            >
              Send →
            </button>
          </form>
        </div>
      </div>
    </main>
    </AuthGuard>
  );
}

