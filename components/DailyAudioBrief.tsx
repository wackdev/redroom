"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface AudioChapter {
  id: string;
  paper: "GS-1" | "GS-2" | "GS-3" | "GS-4";
  title: string;
  durationEst: string;
  spokenScript: string;
}

const DAILY_BRIEF_CHAPTERS: AudioChapter[] = [
  {
    id: "ch-1",
    paper: "GS-2",
    title: "Inter-State River Water Disputes & Article 262",
    durationEst: "2 mins",
    spokenScript:
      "Good morning aspirants. In GS-2 Governance today: The Supreme Court observed that statutory adjudication mechanisms under the Inter-State River Water Disputes Act of 1956 require institutional strengthening. Remember that Article 262 of the Indian Constitution empowers Parliament to adjudicate disputes relating to waters of inter-state rivers while excluding the jurisdiction of the Supreme Court in such matters. Key committee link: Sarkaria Commission recommended a single permanent tribunal with fixed adjudication timelines.",
  },
  {
    id: "ch-2",
    paper: "GS-3",
    title: "Fiscal Deficit Consolidation & Capital Capex Surge",
    durationEst: "2.5 mins",
    spokenScript:
      "Moving to GS-3 Economy: The Ministry of Finance reported sustained momentum in capital expenditure driven by national highway corridors and dedicated freight networks. Under the FRBM Act roadmap, the central government aims to bring the fiscal deficit below four point five percent of GDP by 2025-26. Aspirants should link high Capex multiplier effect with crowding-in of private investment and long-term asset creation.",
  },
  {
    id: "ch-3",
    paper: "GS-3",
    title: "Renewable Energy Transition & PM-PRANAM Bio-Fertilizers",
    durationEst: "1.5 mins",
    spokenScript:
      "In Environment and Climate Governance: NITI Aayog released a policy paper highlighting the rapid scaling of green hydrogen clusters and PM-PRANAM initiative for promoting alternate chemical fertilizers. Connect this directly to India's updated NDC commitment of achieving 500 gigawatts of non-fossil fuel capacity by 2030 and net zero by 2070.",
  },
  {
    id: "ch-4",
    paper: "GS-4",
    title: "Ethical Dilemmas: Discretion vs Statutory Compliance in Disaster Relief",
    durationEst: "1 min",
    spokenScript:
      "Finally in GS-4 Ethics: When executing rapid disaster response, district administrators often face tensions between strict procedural compliance and compassionate immediate relief. Nolan Committee principles of Empathy, Integrity, and Objectivity serve as your bedrock guiding compass.",
  },
];

export default function DailyAudioBrief() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  const activeChapter = DAILY_BRIEF_CHAPTERS[currentChapterIndex];

  useEffect(() => {
    if (typeof window !== "undefined" && !("speechSynthesis" in window)) {
      setIsSupported(false);
    }
  }, []);

  const playChapter = (index: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const chapter = DAILY_BRIEF_CHAPTERS[index];
    if (!chapter) return;

    setCurrentChapterIndex(index);
    const utterance = new SpeechSynthesisUtterance(chapter.spokenScript);
    utterance.rate = playbackRate;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("en-GB")
    );
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => {
      if (index < DAILY_BRIEF_CHAPTERS.length - 1) {
        playChapter(index + 1);
      } else {
        setIsPlaying(false);
      }
    };
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
    sound.playHover();
  };

  const handleTogglePlay = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      sound.playHover();
    } else {
      playChapter(currentChapterIndex);
    }
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    sound.playHover();
    if (isPlaying) {
      playChapter(currentChapterIndex);
    }
  };

  if (!isSupported) return null;

  return (
    <div className="rounded-3xl border border-[#D8A63A]/40 bg-gradient-to-br from-[#120d04] via-[#090909] to-[#050505] p-5 shadow-[0_0_30px_rgba(216,166,58,0.15)] font-mono">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#D8A63A]/10 text-sm border border-[#D8A63A]/40">
            📻
          </span>
          <div>
            <h3 className="text-xs font-black tracking-widest text-[#F4C95D] uppercase">
              THE MORNING BRIEF // 7-MIN UPSC AUDIO DIGEST
            </h3>
            <p className="text-[10px] text-[#8C8C8C]">
              AI-SYNTHESISED EDITORIAL AUDIO PODCAST // ZERO-DATA STREAM
            </p>
          </div>
        </div>

        {/* SPEED SELECTOR */}
        <div className="flex items-center gap-1 text-[10px]">
          {[1.0, 1.25, 1.5].map((rate) => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`rounded-lg px-2 py-0.5 transition ${
                playbackRate === rate
                  ? "bg-[#D8A63A] font-bold text-black"
                  : "bg-white/5 text-[#8C8C8C] hover:text-white"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* CURRENT PLAYING CARD */}
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/5 bg-black/40 p-4">
        <div className="flex items-center justify-between">
          <span className="rounded-md bg-[#D8A63A]/20 px-2 py-0.5 text-[9px] font-bold text-[#F4C95D]">
            {activeChapter.paper} · CHAPTER {currentChapterIndex + 1} OF {DAILY_BRIEF_CHAPTERS.length}
          </span>
          {isPlaying && (
            <div className="flex items-center gap-1">
              <span className="h-2 w-1 bg-[#F4C95D] animate-bounce" />
              <span className="h-3 w-1 bg-[#D8A63A] animate-bounce delay-75" />
              <span className="h-2 w-1 bg-[#F4C95D] animate-bounce delay-150" />
            </div>
          )}
        </div>

        <h4 className="text-xs font-bold text-white">{activeChapter.title}</h4>
        <p className="text-[11px] text-[#8C8C8C] leading-relaxed line-clamp-2">
          {activeChapter.spokenScript}
        </p>

        {/* CONTROLS */}
        <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2">
          <div className="flex gap-2">
            <button
              disabled={currentChapterIndex === 0}
              onClick={() => playChapter(currentChapterIndex - 1)}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-white hover:bg-white/5 disabled:opacity-30"
            >
              ⏮ Prev
            </button>
            <button
              disabled={currentChapterIndex === DAILY_BRIEF_CHAPTERS.length - 1}
              onClick={() => playChapter(currentChapterIndex + 1)}
              className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-white hover:bg-white/5 disabled:opacity-30"
            >
              Next ⏭
            </button>
          </div>

          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2 rounded-full border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] px-5 py-1.5 text-xs font-black text-black shadow-[0_0_15px_rgba(216,166,58,0.3)] hover:scale-105 transition"
          >
            <span>{isPlaying ? "⏸ PAUSE BRIEF" : "▶ PLAY MORNING BRIEF"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
