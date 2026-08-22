"use client";

import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";

interface StudyBreakBannerProps {
  minutesStudied?: number;
  onDismiss: () => void;
}

export default function StudyBreakBanner({
  minutesStudied = 90,
  onDismiss,
}: StudyBreakBannerProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-6 right-6 z-40 flex max-w-sm flex-col rounded-3xl border border-[#D8A63A]/40 bg-[#0a0a0a]/95 p-5 text-white shadow-[0_0_40px_rgba(216,166,58,0.3)] backdrop-blur-xl animate-fadeIn">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D8A63A]/50 bg-[#D8A63A]/10 text-xl shadow-[0_0_15px_rgba(216,166,58,0.3)]">
          ☕
        </div>
        <div>
          <span className="font-mono text-[9px] font-black tracking-widest text-[#F4C95D] uppercase">
            MOMENTUM RESET ADVISORY
          </span>
          <h4 className="font-mono text-xs font-black text-white uppercase">
            YOU'VE BEEN FOCUSED FOR {minutesStudied} MIN.
          </h4>
        </div>
      </div>

      <p className="mt-2.5 text-[11px] text-[#8C8C8C] leading-snug">
        Take a 5-minute cognitive break to avoid mental saturation and restore peak retention.
      </p>

      <div className="mt-3.5 flex gap-2">
        <button
          onClick={() => {
            sound.playClick();
            onDismiss();
          }}
          className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2 font-mono text-[10px] font-bold text-[#8C8C8C] hover:text-white transition"
        >
          CONTINUE STUDYING
        </button>
        <button
          onClick={() => {
            sound.playWarp();
            onDismiss();
            router.push("/chill-zone");
          }}
          className="flex-1 rounded-xl border border-[#D8A63A] bg-[#D8A63A] py-2 font-mono text-[10px] font-black text-black hover:bg-[#F4C95D] transition shadow-[0_0_15px_rgba(216,166,58,0.4)]"
        >
          ENTER CHILL ZONE
        </button>
      </div>
    </div>
  );
}
