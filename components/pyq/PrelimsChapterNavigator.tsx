"use client";

import { useMemo, useState } from "react";
import {
  ALL_TAXONOMY_SUBJECTS,
  PYQSubject,
  PYQChapter,
  getAllChaptersForSubject,
} from "@/lib/pyq/taxonomy";
import { PYQQuestion } from "@/lib/core/types";
import { sound } from "@/lib/audio/sound-engine";

interface Props {
  selectedSubject: string;
  selectedTopic: string;
  onSelectTopic: (topicName: string) => void;
  onSelectSubject: (subjectName: string) => void;
  questions: PYQQuestion[];
  completedIds: Set<string>;
}

export default function PrelimsChapterNavigator({
  selectedSubject,
  selectedTopic,
  onSelectTopic,
  onSelectSubject,
  questions,
  completedIds,
}: Props) {
  const [chapterSearch, setChapterSearch] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Active subject metadata
  const activeSubjectData: PYQSubject | undefined = useMemo(() => {
    return ALL_TAXONOMY_SUBJECTS.find(
      (s) =>
        s.name.toLowerCase() === selectedSubject.toLowerCase() ||
        s.id.toLowerCase() === selectedSubject.toLowerCase()
    );
  }, [selectedSubject]);

  const chapters: PYQChapter[] = useMemo(() => {
    if (!activeSubjectData) return [];
    return activeSubjectData.chapters;
  }, [activeSubjectData]);

  // Question counts by chapter name
  const chapterStats = useMemo(() => {
    const map = new Map<
      string,
      { total: number; solved: number; correct: number }
    >();

    chapters.forEach((ch) => {
      map.set(ch.name.toLowerCase(), { total: 0, solved: 0, correct: 0 });
    });

    questions.forEach((q) => {
      const topicLower = (q.topic || "").toLowerCase();
      for (const ch of chapters) {
        const chLower = ch.name.toLowerCase();
        if (topicLower === chLower || topicLower.includes(chLower) || chLower.includes(topicLower)) {
          const cur = map.get(chLower) || { total: 0, solved: 0, correct: 0 };
          cur.total++;
          if (completedIds.has(String(q.id))) {
            cur.solved++;
          }
          map.set(chLower, cur);
          break;
        }
      }
    });

    return map;
  }, [chapters, questions, completedIds]);

  const filteredChapters = useMemo(() => {
    if (!chapterSearch.trim()) return chapters;
    const q = chapterSearch.toLowerCase();
    return chapters.filter(
      (ch) =>
        ch.name.toLowerCase().includes(q) ||
        String(ch.chapterNumber).includes(q) ||
        String(ch.pageNumber).includes(q) ||
        ch.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }, [chapters, chapterSearch]);

  if (!activeSubjectData) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5 shadow-xl mb-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl text-xl font-bold"
            style={{ backgroundColor: `${activeSubjectData.color}20`, border: `1px solid ${activeSubjectData.color}50` }}
          >
            {activeSubjectData.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-bold text-white">
                {activeSubjectData.name} · Official Chapters
              </h3>
              <span className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[10px] text-white/70">
                p. {activeSubjectData.startPage} Index
              </span>
            </div>
            <p className="text-xs text-white/50">{activeSubjectData.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search chapters or topics..."
            value={chapterSearch}
            onChange={(e) => setChapterSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-xs text-white outline-none placeholder:text-white/30 focus:border-[#D8A63A] w-48 sm:w-60"
          />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white/70 hover:bg-white/10 transition"
          >
            {isCollapsed ? "Expand ▼" : "Collapse ▲"}
          </button>
        </div>
      </div>

      {/* Chapters Grid / Chips */}
      {!isCollapsed && (
        <div className="pt-4">
          <div className="flex items-center justify-between mb-3 text-xs font-mono text-white/50">
            <span>
              Showing {filteredChapters.length} of {chapters.length} chapters
            </span>
            <button
              onClick={() => {
                sound.playClick();
                onSelectTopic("All Topics");
              }}
              className={`font-bold transition ${
                selectedTopic === "All Topics"
                  ? "text-[#F4C95D] underline"
                  : "hover:text-white"
              }`}
            >
              Reset to All Chapters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-h-64 overflow-y-auto pr-1">
            {filteredChapters.map((ch) => {
              const stat = chapterStats.get(ch.name.toLowerCase()) || {
                total: 0,
                solved: 0,
                correct: 0,
              };
              const isSelected =
                selectedTopic.toLowerCase() === ch.name.toLowerCase();

              return (
                <button
                  key={ch.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectTopic(ch.name);
                  }}
                  className={`flex flex-col justify-between rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? "border-[#D8A63A] bg-[#D8A63A]/15 shadow-lg shadow-[#D8A63A]/10 scale-[1.01]"
                      : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-white/40">
                      CH {ch.chapterNumber}
                    </span>
                    <span className="font-mono text-[10px] text-white/40">
                      p. {ch.pageNumber}
                    </span>
                  </div>

                  <p
                    className={`mt-1 line-clamp-2 text-xs font-semibold leading-snug ${
                      isSelected ? "text-[#F4C95D]" : "text-white"
                    }`}
                  >
                    {ch.name}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px] font-mono text-white/40">
                    <span>
                      {stat.total > 0 ? (
                        <span className="text-white/80">
                          <strong>{stat.solved}</strong> / {stat.total} Qs
                        </span>
                      ) : (
                        <span className="italic text-white/30">Ready for upload</span>
                      )}
                    </span>
                    {ch.importance === "High" && (
                      <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300 font-bold">
                        ★ High Yield
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
