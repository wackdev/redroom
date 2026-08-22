"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { APP_ROUTES } from "@/lib/core/constants";
import { STATIC_PYQ_DATASET } from "@/lib/pyq/static-dataset";
import { STATIC_MAINS_PYQ_DATASET } from "@/lib/mains-pyq/static-dataset";
import { UPSC_FULL_SYLLABUS } from "@/lib/syllabus/upsc-syllabus";
import { sound } from "@/lib/audio/sound-engine";
import { safeArray } from "@/lib/core/utils";
import { SyllabusTopic } from "@/lib/core/types";


interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Action" | "Syllabus" | "Prelims PYQ" | "Mains PYQ";
  subtitle?: string;
  icon: string;
  onSelect: () => void;
}

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Listener for Ctrl+K / Cmd+K & Custom Event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (!prev) sound.playLock();
          return !prev;
        });
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      sound.playLock();
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("redroom_open_command_palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("redroom_open_command_palette", handleCustomOpen);
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Pre-compiled Searchable Dataset
  const allCommands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // 1. Navigation Routes
    APP_ROUTES.forEach((route) => {
      items.push({
        id: `nav-${route.path}`,
        title: route.label,
        category: "Navigation",
        subtitle: `Jump to ${route.path}`,
        icon: route.icon,
        onSelect: () => {
          sound.playWarp();
          setIsOpen(false);
          router.push(route.path);
        },
      });
    });

    // 2. High-Yield Actions
    items.push({
      id: "action-focus",
      title: "Deep Work Focus Sanctuary",
      category: "Action",
      subtitle: "Launch Pomodoro timer with ambient soundscapes",
      icon: "🧘",
      onSelect: () => {
        setIsOpen(false);
        window.dispatchEvent(new CustomEvent("redroom_open_focus_modal"));
      },
    });

    items.push({
      id: "action-pyq-challenge",
      title: "Daily 5-MCQ Prelims Challenge",
      category: "Action",
      subtitle: "Fast streak builder with 5 high-yield MCQs",
      icon: "🔥",
      onSelect: () => {
        sound.playWarp();
        setIsOpen(false);
        router.push("/pyqs");
      },
    });

    items.push({
      id: "action-csat-lab",
      title: "CSAT Speed & Logic Matrix Lab",
      category: "Action",
      subtitle: "Qualifying Paper-II math, reasoning & RC practice",
      icon: "📐",
      onSelect: () => {
        sound.playWarp();
        setIsOpen(false);
        router.push("/csat");
      },
    });

    items.push({
      id: "action-personality-viva",
      title: "DAF Voice Personality Test Simulator",
      category: "Action",
      subtitle: "Live verbal interview board cross-examination",
      icon: "🎙️",
      onSelect: () => {
        sound.playWarp();
        setIsOpen(false);
        router.push("/interview");
      },
    });

    items.push({
      id: "action-mains-writing",
      title: "Mains Answer Writing & Diagram Studio",
      category: "Action",
      subtitle: "Write timed answers, scan handwritten sheets & build stencils",
      icon: "🏛️",
      onSelect: () => {
        sound.playWarp();
        setIsOpen(false);
        router.push("/mains-pyqs");
      },
    });

    items.push({
      id: "action-chill-zone",
      title: "Chill Zone · Cognitive Break Lounge",
      category: "Action",
      subtitle: "6 lightweight speed, memory, and reaction games to reset momentum",
      icon: "🎮",
      onSelect: () => {
        sound.playWarp();
        setIsOpen(false);
        router.push("/chill-zone");
      },
    });

    // 3. Syllabus Topics
    UPSC_FULL_SYLLABUS.forEach((subj) => {
      safeArray<SyllabusTopic>(subj.topics).slice(0, 8).forEach((item: SyllabusTopic) => {
        items.push({
          id: `syl-${item.id}`,
          title: item.name,

          category: "Syllabus",
          subtitle: `${subj.name} · ${item.paper} · High Yield: ${item.importance}`,
          icon: subj.icon || "🗺️",
          onSelect: () => {
            sound.playWarp();
            setIsOpen(false);
            router.push(`/syllabus?topic=${encodeURIComponent(item.name)}`);
          },
        });
      });
    });


    // 4. Prelims PYQs
    STATIC_PYQ_DATASET.slice(0, 30).forEach((q) => {
      items.push({
        id: `pyq-${q.id}`,
        title: q.question.slice(0, 75) + (q.question.length > 75 ? "..." : ""),
        category: "Prelims PYQ",
        subtitle: `UPSC ${q.year} · ${q.subject}`,
        icon: "🎯",
        onSelect: () => {
          sound.playWarp();
          setIsOpen(false);
          router.push(`/pyqs?search=${encodeURIComponent(q.question.slice(0, 30))}`);
        },
      });
    });

    // 5. Mains PYQs
    STATIC_MAINS_PYQ_DATASET.slice(0, 20).forEach((mq) => {
      items.push({
        id: `mains-${mq.id}`,
        title: mq.question.slice(0, 75) + (mq.question.length > 75 ? "..." : ""),
        category: "Mains PYQ",
        subtitle: `UPSC Mains ${mq.year} · ${mq.paper} (${mq.marks}M)`,
        icon: "✍️",
        onSelect: () => {
          sound.playWarp();
          setIsOpen(false);
          router.push(`/mains-pyqs?search=${encodeURIComponent(mq.question.slice(0, 30))}`);
        },
      });
    });

    return items;
  }, [router]);

  // Filter items based on user search
  const filteredItems = useMemo(() => {
    if (!search.trim()) return allCommands.slice(0, 10);

    const q = search.toLowerCase();
    return allCommands
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q))
      )
      .slice(0, 12);
  }, [allCommands, search]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      sound.playHover();
      setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      sound.playHover();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      filteredItems[selectedIndex].onSelect();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          sound.playLock();
          setIsOpen(true);
        }}
        data-cursor="SEARCH"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-[#D8A63A]/40 bg-[#0d0d0d]/95 px-4 py-2.5 font-mono text-xs font-black text-[#F4C95D] shadow-[0_0_20px_rgba(216,166,58,0.3)] backdrop-blur-xl transition-all hover:scale-105 hover:border-[#D8A63A] hover:bg-[#1a1405]"
        title="WHYNOTUPSC Command Palette (Ctrl + K)"
      >
        <span>⚡</span>
        <span className="hidden sm:inline">COMMAND</span>
        <kbd className="rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/70">
          Ctrl K
        </kbd>
      </button>
    );
  }

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 p-4 pt-16 backdrop-blur-md transition-all sm:pt-24 font-mono select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D8A63A]/50 bg-[#0d0d0d] shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_30px_rgba(216,166,58,0.2)] transition-all"
      >
        {/* INPUT FIELD */}
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
          <span className="text-lg text-[#F4C95D]">⚡</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a topic, question, clue, or command... (e.g. 'Basic Structure', 'GS-2', 'Monsoon')"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30 font-sans"
          />
          <kbd className="hidden rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-white/40 sm:inline-block">
            ESC to close
          </kbd>
        </div>

        {/* RESULTS LIST */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-xs text-white/40">
              No matching modules, PYQs, or syllabus topics found for &ldquo;{search}&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <div
                    key={item.id}
                    onClick={item.onSelect}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 transition-all ${
                      isSelected
                        ? "border border-[#D8A63A] bg-[#D8A63A]/15 text-white shadow-[0_0_15px_rgba(216,166,58,0.25)]"
                        : "border border-transparent hover:bg-white/[0.04] text-white/80"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-base">
                        {item.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold truncate text-white">{item.title}</p>
                        {item.subtitle && (
                          <p className="text-[11px] text-[#8C8C8C] truncate mt-0.5">{item.subtitle}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-[#F4C95D]">
                        {item.category}
                      </span>
                      {isSelected && <span className="text-xs text-[#F4C95D]">↵</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER SHORTCUTS */}
        <div className="flex items-center justify-between border-t border-white/10 bg-black/40 px-5 py-2.5 text-[11px] text-white/40">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Exit</span>
          </div>
          <span className="text-[#F4C95D] font-bold">WHYNOTUPSC Command Matrix</span>
        </div>
      </div>
    </div>
  );
}

