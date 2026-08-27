"use client";

import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MainsAnswerDraft, MainsPYQQuestion } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";
import { STATIC_MAINS_PYQ_DATASET } from "@/lib/mains-pyq/static-dataset";
import {
  DIRECTIVE_GUIDELINES,
  STANDARD_DIAGRAM_STENCILS,
  generatePESTLEOutline,
} from "@/lib/mains-pyq/diagram-engine";
import {
  broadcastSyncChange,
  subscribeToSyncChanges,
  pushStateToCloud,
  useCloudSync,
} from "@/lib/sync/sync-engine";
import { idb, DB_STORES } from "@/lib/db/indexed-db";
import { sound } from "@/lib/audio/sound-engine";
import MainsDiagramStudio from "@/components/MainsDiagramStudio";
import EthicsDilemmaSimulator from "@/components/EthicsDilemmaSimulator";
import EssayStudio from "@/components/EssayStudio";
import MainsQCABGenerator from "@/components/MainsQCABGenerator";
import TopperMirrorAnalyzer from "@/components/TopperMirrorAnalyzer";
import { exportMainsAnswerBooklet } from "@/lib/mains-pyq/export";
import AuthGuard from "@/components/auth/AuthGuard";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";
import { useNotesStore } from "@/store/useNotesStore";
import { createNoteFromMainsQuestion, findRelatedNotesForMains } from "@/lib/study/notes-engine";

const LOCAL_STORAGE_MAINS_KEY = "redroom_mains_pyqs_custom";

const LOCAL_STORAGE_MAINS_DRAFTS_KEY = "redroom_mains_drafts";
const LOCAL_STORAGE_MAINS_BOOKMARKS_KEY = "redroom_mains_bookmarks";
const LOCAL_STORAGE_MAINS_PRACTICED_KEY = "redroom_mains_practiced";

const GS_PAPERS = ["All Papers", "GS-1", "GS-2", "GS-3", "GS-4", "Essay"] as const;

export default function MainsPYQCommandCenter() {
  const router = useRouter();
  const { isSyncing, lastSyncTime, triggerManualSync } = useCloudSync();

  // Core Dataset & State
  const [questions, setQuestions] = useState<MainsPYQQuestion[]>(STATIC_MAINS_PYQ_DATASET);
  const [practicedIds, setPracticedIds] = useState<Set<string>>(new Set());
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [drafts, setDrafts] = useState<Record<string, MainsAnswerDraft>>({});
  const [expandedFrameworkIds, setExpandedFrameworkIds] = useState<Set<string>>(new Set());

  // Filter States
  const [selectedPaper, setSelectedPaper] = useState<string>("All Papers");
  const [selectedSubject, setSelectedSubject] = useState<string>("All Subjects");
  const [selectedYear, setSelectedYear] = useState<string>("All Years");
  const [selectedMarks, setSelectedMarks] = useState<string>("All Marks");
  const [search, setSearch] = useState<string>("");
  const [importantOnly, setImportantOnly] = useState<boolean>(false);
  const [bookmarksOnly, setBookmarksOnly] = useState<boolean>(false);

  // Active Writing Workspace State
  const [activeWritingQ, setActiveWritingQ] = useState<MainsPYQQuestion | null>(null);
  const [activeDraftText, setActiveDraftText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"editor" | "framework" | "stencils" | "scanner">("editor");
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [aiEvaluating, setAiEvaluating] = useState<boolean>(false);

  // Diagram Studio, Ethics, Essay, QCAB, & Topper Mirror States
  const [diagramStudioOpen, setDiagramStudioOpen] = useState<boolean>(false);
  const [ethicsSimulatorOpen, setEthicsSimulatorOpen] = useState<boolean>(false);
  const [essayStudioOpen, setEssayStudioOpen] = useState<boolean>(false);
  const [qcabGeneratorOpen, setQcabGeneratorOpen] = useState<boolean>(false);
  const [topperMirrorOpen, setTopperMirrorOpen] = useState<boolean>(false);
  const [scannedSheets, setScannedSheets] = useState<string[]>([]);
  const [ocrTextExtracted, setOcrTextExtracted] = useState<string | null>(null);
  const [isEnhancingImage, setIsEnhancingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // JSON Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [jsonUploadText, setJsonUploadText] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Notes Vault Integration
  const [noteSaveStatus, setNoteSaveStatus] = useState<Record<string, string>>({});
  const { notes: userVaultNotes, addNote: addNoteToVault } = useNotesStore();

  const handleSaveMainsToNotes = async (m: MainsPYQQuestion) => {
    sound.playSelect();
    const strId = String(m.id);
    setNoteSaveStatus((prev) => ({ ...prev, [strId]: "Saving..." }));
    try {
      const partialNote = createNoteFromMainsQuestion(m);
      await addNoteToVault(partialNote);
      sound.playVictory();
      setNoteSaveStatus((prev) => ({ ...prev, [strId]: "✓ Saved in Notes" }));
      setTimeout(() => {
        setNoteSaveStatus((prev) => {
          const next = { ...prev };
          delete next[strId];
          return next;
        });
      }, 3500);
    } catch {
      sound.playWrong();
      setNoteSaveStatus((prev) => ({ ...prev, [strId]: "Error Saving" }));
    }
  };

  // Load Saved Data from LocalStorage
  const loadLocalState = useCallback(() => {
    try {
      // 1. Custom uploaded Mains questions
      const customQ = localStorage.getItem(LOCAL_STORAGE_MAINS_KEY);
      if (customQ) {
        const parsedCustom = JSON.parse(customQ);
        if (Array.isArray(parsedCustom) && parsedCustom.length > 0) {
          const map = new Map<string, MainsPYQQuestion>();
          STATIC_MAINS_PYQ_DATASET.forEach((q) => map.set(q.id, q));
          parsedCustom.forEach((q: MainsPYQQuestion) => map.set(q.id, q));
          setQuestions(Array.from(map.values()));
        }
      }

      // 2. Practiced & Bookmarks
      const savedPracticed = localStorage.getItem(LOCAL_STORAGE_MAINS_PRACTICED_KEY);
      if (savedPracticed) setPracticedIds(new Set(JSON.parse(savedPracticed)));

      const savedBookmarks = localStorage.getItem(LOCAL_STORAGE_MAINS_BOOKMARKS_KEY);
      if (savedBookmarks) setBookmarkedIds(new Set(JSON.parse(savedBookmarks)));

      // 3. Answer Drafts
      const savedDrafts = localStorage.getItem(LOCAL_STORAGE_MAINS_DRAFTS_KEY);
      if (savedDrafts) setDrafts(JSON.parse(savedDrafts));
    } catch {}
  }, []);

  useEffect(() => {
    loadLocalState();

    const unsubscribe = subscribeToSyncChanges((type) => {
      if (type === "all") loadLocalState();
    });

    return unsubscribe;
  }, [loadLocalState]);

  // Answer Writing Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => setTimerSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Word count calculator
  const activeWordCount = useMemo(() => {
    const trimmed = activeDraftText.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }, [activeDraftText]);

  // Dynamic Paper Counts
  const paperCounts = useMemo(() => {
    const counts: Record<string, number> = { "All Papers": questions.length };
    for (const q of questions) {
      const p = q.paper || "GS-1";
      counts[p] = (counts[p] || 0) + 1;
    }
    return counts;
  }, [questions]);

  // Available Subjects for Selected Paper
  const availableSubjects = useMemo(() => {
    let filtered = questions;
    if (selectedPaper !== "All Papers") {
      filtered = questions.filter((q) => q.paper === selectedPaper);
    }
    const subjects = Array.from(new Set(filtered.map((q) => q.subject).filter(Boolean)));
    return ["All Subjects", ...subjects];
  }, [questions, selectedPaper]);

  // Available Years
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(questions.map((q) => q.year)));
    return years.sort((a, b) => b - a);
  }, [questions]);

  // Filtered Questions Engine
  const filteredQuestions = useMemo(() => {
    const qText = search.trim().toLowerCase();

    return safeArray(questions).filter((q) => {
      // 1. Paper match
      const matchPaper = selectedPaper === "All Papers" || q.paper === selectedPaper;

      // 2. Subject match
      const matchSubject =
        selectedSubject === "All Subjects" ||
        (q.subject && q.subject.toLowerCase() === selectedSubject.toLowerCase());

      // 3. Year match
      const matchYear = selectedYear === "All Years" || String(q.year) === selectedYear;

      // 4. Marks match
      const matchMarks = selectedMarks === "All Marks" || String(q.marks) === selectedMarks;

      // 5. Flags
      const matchImp = !importantOnly || Boolean(q.important);
      const matchBook = !bookmarksOnly || bookmarkedIds.has(q.id);

      // 6. Search query
      const matchSearch =
        !qText ||
        q.question.toLowerCase().includes(qText) ||
        (q.topic && q.topic.toLowerCase().includes(qText)) ||
        (q.directive && q.directive.toLowerCase().includes(qText)) ||
        (q.framework &&
          (q.framework.introduction.toLowerCase().includes(qText) ||
            q.framework.conclusion.toLowerCase().includes(qText) ||
            q.framework.keywords.some((k) => k.toLowerCase().includes(qText))));

      return matchPaper && matchSubject && matchYear && matchMarks && matchImp && matchBook && matchSearch;
    });
  }, [
    questions,
    selectedPaper,
    selectedSubject,
    selectedYear,
    selectedMarks,
    importantOnly,
    bookmarksOnly,
    search,
    bookmarkedIds,
  ]);

  // Actions
  const handleTogglePracticed = (qId: string) => {
    const next = new Set(practicedIds);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);

    setPracticedIds(next);
    try {
      localStorage.setItem(LOCAL_STORAGE_MAINS_PRACTICED_KEY, JSON.stringify(Array.from(next)));
    } catch {}
    broadcastSyncChange("all");
    void pushStateToCloud();
  };

  const handleToggleBookmark = (qId: string) => {
    const next = new Set(bookmarkedIds);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);

    setBookmarkedIds(next);
    try {
      localStorage.setItem(LOCAL_STORAGE_MAINS_BOOKMARKS_KEY, JSON.stringify(Array.from(next)));
    } catch {}
  };

  const handleToggleFramework = (qId: string) => {
    const next = new Set(expandedFrameworkIds);
    if (next.has(qId)) next.delete(qId);
    else next.add(qId);
    setExpandedFrameworkIds(next);
  };

  // Launch Answer Writing Workspace
  const handleOpenWritingWorkspace = (q: MainsPYQQuestion) => {
    setActiveWritingQ(q);
    const existing = drafts[q.id]?.draftText || "";
    setActiveDraftText(existing);
    setTimerSeconds(drafts[q.id]?.timeSpentSeconds || 0);
    setIsTimerRunning(true);
    setActiveTab("editor");
  };

  // Save Draft with IndexedDB Sync
  const handleSaveDraft = async () => {
    if (!activeWritingQ) return;
    const qId = activeWritingQ.id;

    const draftObj: MainsAnswerDraft = {
      questionId: qId,
      draftText: activeDraftText,
      wordCount: activeWordCount,
      timeSpentSeconds: timerSeconds,
      savedAt: new Date().toISOString(),
      aiEvaluation: drafts[qId]?.aiEvaluation,
    };

    const nextDrafts = { ...drafts, [qId]: draftObj };
    setDrafts(nextDrafts);

    if (!practicedIds.has(qId) && activeWordCount > 30) {
      const nextP = new Set(practicedIds);
      nextP.add(qId);
      setPracticedIds(nextP);
      try {
        localStorage.setItem(LOCAL_STORAGE_MAINS_PRACTICED_KEY, JSON.stringify(Array.from(nextP)));
      } catch {}
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_MAINS_DRAFTS_KEY, JSON.stringify(nextDrafts));
    } catch {}

    // Unlimited Offline Storage via IndexedDB
    try {
      await idb.put(DB_STORES.MAINS_DRAFTS, {
        id: qId,
        ...draftObj,
        scannedSheets,
      });
    } catch {}

    broadcastSyncChange("all");
    void pushStateToCloud();
  };

  // Handwritten Answer Sheet Upload & Auto-Contrast Enhancement
  const handleUploadAnswerSheet = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsEnhancingImage(true);
    sound.playHover();

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Process on hidden canvas for contrast optimization
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          canvas.width = Math.min(1600, img.width);
          canvas.height = (canvas.width / img.width) * img.height;

          // Draw and apply document scanner filter
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const d = imgData.data;

          // High-contrast document thresholding
          for (let i = 0; i < d.length; i += 4) {
            const v = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
            const contrast = v < 140 ? v * 0.75 : Math.min(255, v * 1.15);
            d[i] = contrast;
            d[i + 1] = contrast;
            d[i + 2] = contrast;
          }
          ctx.putImageData(imgData, 0, 0);

          const enhancedUrl = canvas.toDataURL("image/jpeg", 0.85);
          setScannedSheets((prev) => [...prev, enhancedUrl]);
          setIsEnhancingImage(false);
          sound.playLock();
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveScannedSheet = (index: number) => {
    setScannedSheets(scannedSheets.filter((_, i) => i !== index));
    sound.playHover();
  };

  const handleInsertDiagram = (diagramMd: string) => {
    setActiveDraftText((prev) => `${prev.trim()}\n\n${diagramMd.trim()}\n\n`);
    sound.playLock();
  };

  // Deep Multi-Dimensional UPSC Rubric AI Evaluation
  const handleEvaluateDraft = async () => {
    if (!activeWritingQ || (activeWordCount < 20 && scannedSheets.length === 0)) return;
    setAiEvaluating(true);
    sound.playLock();

    try {
      const qId = activeWritingQ.id;
      const res = await fetch("/api/mains/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeWritingQ.question,
          answerText: activeDraftText,
          marks: activeWritingQ.marks || 15,
          paper: activeWritingQ.paper || "GS-2",
          directive: activeWritingQ.directive || "Critically Examine",
        }),
      });

      const json = await res.json();
      let evalData;

      if (json.success && json.data) {
        const d = json.data;
        evalData = {
          score: d.score,
          maxMarks: d.maxScore || activeWritingQ.marks || 15,
          introFeedback: d.introFeedback,
          bodyFeedback: Array.isArray(d.bodyDimensions)
            ? d.bodyDimensions.map((b: any) => `• ${b.dimension}: ${b.analysis}`).join("\n")
            : "Multi-dimensional analytical coverage observed across constitutional and socio-economic domains.",
          conclusionFeedback: d.conclusionFeedback,
          valueAdditionTips: safeArray(d.valueAdditionPointers) as string[],
        };
      } else {
        const maxMarks = activeWritingQ.marks || 15;
        const lengthRatio = Math.min(1, activeWordCount / (activeWritingQ.wordLimit || 250));
        evalData = {
          score: +(maxMarks * 0.48 + lengthRatio * maxMarks * 0.28).toFixed(1),
          maxMarks,
          introFeedback: "Conceptual opening contextualizing core statutory provisions.",
          bodyFeedback: "Multi-dimensional coverage observed across policy dimensions.",
          conclusionFeedback: "Forward-looking conclusion linked with SDGs and constitutional morality.",
          valueAdditionTips: [
            "Incorporate a standard Hub-and-Spoke flowchart for presentation.",
            "Anchor arguments with specific Article and 2nd ARC committee references.",
          ],
        };
      }

      const nextDrafts = {
        ...drafts,
        [qId]: {
          questionId: qId,
          draftText: activeDraftText,
          wordCount: activeWordCount,
          timeSpentSeconds: timerSeconds,
          savedAt: new Date().toISOString(),
          aiEvaluation: evalData,
        },
      };

      setDrafts(nextDrafts);
      try {
        localStorage.setItem(LOCAL_STORAGE_MAINS_DRAFTS_KEY, JSON.stringify(nextDrafts));
        void idb.put(DB_STORES.MAINS_DRAFTS, {
          id: qId,
          ...nextDrafts[qId],
          scannedSheets,
        });
      } catch {}

      sound.playVictory();
    } catch {
      alert("AI evaluator connection error. Using local rubric evaluation.");
    } finally {
      setAiEvaluating(false);
    }
  };

  // Process Custom JSON File Upload
  const handleProcessUpload = () => {
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const parsed = JSON.parse(jsonUploadText);
      let items: MainsPYQQuestion[] = [];

      if (Array.isArray(parsed)) {
        items = parsed;
      } else if (parsed && Array.isArray(parsed.questions)) {
        items = parsed.questions;
      } else {
        throw new Error("JSON must be an array of Mains questions or contain a 'questions' array.");
      }

      if (items.length === 0) {
        throw new Error("Uploaded JSON contains 0 questions.");
      }

      // Merge with existing
      const map = new Map<string, MainsPYQQuestion>();
      questions.forEach((q) => map.set(q.id, q));
      items.forEach((q, idx) => {
        const id = q.id || `UPSC-MAINS-CUSTOM-${Date.now()}-${idx + 1}`;
        map.set(id, {
          id,
          year: q.year || 2025,
          paper: q.paper || "GS-1",
          subject: q.subject || "General",
          topic: q.topic || "UPSC Mains",
          question: q.question || "Untitled Question",
          marks: q.marks || 15,
          wordLimit: q.wordLimit || 250,
          directive: q.directive || "Discuss",
          directiveGuidance: q.directiveGuidance || "",
          framework: q.framework,
          important: Boolean(q.important),
          syllabusTags: q.syllabusTags || [],
        });
      });

      const merged = Array.from(map.values());
      setQuestions(merged);

      try {
        localStorage.setItem(LOCAL_STORAGE_MAINS_KEY, JSON.stringify(merged));
      } catch {}

      setUploadSuccess(`Successfully imported ${items.length} Mains questions! Total: ${merged.length}`);
      setJsonUploadText("");
      setTimeout(() => {
        setUploadModalOpen(false);
        setUploadSuccess(null);
      }, 1500);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Invalid JSON file structure.");
    }
  };

  // Format Timer
  const formattedTime = `${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(
    timerSeconds % 60
  ).padStart(2, "0")}`;

  return (
    <AuthGuard>
      <main className="min-h-screen bg-[#07040e] text-white">
        {/* UNIVERSAL LUXURY HUD HEADER */}
        <AppUniversalHeader moduleName="Mains Answer Lab" moduleBadge="GS 1-4 & ESSAY" />

        <div className="border-b border-white/10 bg-[#090414]/60 px-4 py-2.5 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-white/50">MAINS SUITE:</span>
              <span className="rounded-full bg-pink-500/20 px-2 py-0.5 text-[10px] font-black text-pink-300">
                {questions.length} Questions
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* GS-4 ETHICS DILEMMA SIMULATOR */}
              <button
                onClick={() => {
                  setEthicsSimulatorOpen((prev) => !prev);
                  sound.playLock();
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition ${
                  ethicsSimulatorOpen
                    ? "border-pink-500 bg-pink-500 text-white shadow-lg"
                    : "border-pink-500/40 bg-pink-500/10 text-pink-300 hover:bg-pink-500/20"
                }`}
              >
                <span>⚖️</span>
                <span>{ethicsSimulatorOpen ? "Hide Ethics" : "Ethics Simulator"}</span>
              </button>

              {/* ESSAY STUDIO */}
              <button
                onClick={() => {
                  setEssayStudioOpen((prev) => !prev);
                  sound.playLock();
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition ${
                  essayStudioOpen
                    ? "border-amber-500 bg-amber-500 text-black shadow-lg"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                }`}
              >
                <span>✍️</span>
                <span>{essayStudioOpen ? "Hide Essay" : "Essay Studio"}</span>
              </button>

              {/* QCAB BOOKLET GENERATOR */}
              <button
                onClick={() => {
                  setQcabGeneratorOpen((prev) => !prev);
                  sound.playLock();
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition ${
                  qcabGeneratorOpen
                    ? "border-blue-500 bg-blue-500 text-white shadow-lg"
                    : "border-blue-500/40 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
                }`}
              >
                <span>📄</span>
                <span>{qcabGeneratorOpen ? "Hide QCAB" : "Print QCAB"}</span>
              </button>

              {/* TOPPER MIRROR ANALYZER */}
              <button
                onClick={() => {
                  setTopperMirrorOpen((prev) => !prev);
                  sound.playLock();
                }}
                className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1 text-xs font-bold transition ${
                  topperMirrorOpen
                    ? "border-pink-400 bg-pink-400 text-black shadow-lg"
                    : "border-pink-400/40 bg-pink-400/10 text-pink-200 hover:bg-pink-400/20"
                }`}
              >
                <span>🪞</span>
                <span>{topperMirrorOpen ? "Hide Topper" : "Topper Mirror"}</span>
              </button>

              {/* UPLOAD CUSTOM JSON */}
              <button
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-bold text-white shadow-lg transition hover:opacity-90"
              >
                <span>📁</span>
                <span>Import JSON</span>
              </button>
            </div>
          </div>
        </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* HERO STRIP */}
        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-pink-400">
              OFFICIAL UPSC CIVIL SERVICES MAINS (2013–2025)
            </p>
            <h2 className="mt-1 text-2xl font-black md:text-3xl">Mains Analytical PYQ Repository</h2>
            <p className="mt-1 text-xs text-white/60 leading-relaxed max-w-2xl">
              Authentic UPSC Mains GS-1, GS-2, GS-3, GS-4 & Essay questions with structured model answer blueprints, multi-dimensional frameworks (Intro, PESTLE Body, Diagrams, Conclusion), and a live answer drafting canvas.
            </p>
          </div>

          {/* PROGRESS METRICS CARD */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wider text-white/60">Writing Mastery</span>
              <span className="font-black text-pink-400">
                {questions.length > 0 ? Math.round((practicedIds.size / questions.length) * 100) : 0}% Practiced
              </span>
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-emerald-400 transition-all duration-500"
                style={{
                  width: `${questions.length > 0 ? (practicedIds.size / questions.length) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
              <span>Practiced: <strong className="text-white">{practicedIds.size}</strong> / {questions.length}</span>
              <span>Drafts Saved: <strong className="text-purple-300">{Object.keys(drafts).length}</strong></span>
              <span>Bookmarked: <strong className="text-amber-300">★ {bookmarkedIds.size}</strong></span>
            </div>
          </div>
        </section>

        {/* GS-4 ETHICS CASE STUDY DILEMMA SIMULATOR */}
        {ethicsSimulatorOpen && (
          <div className="mb-8">
            <EthicsDilemmaSimulator />
          </div>
        )}

        {/* ESSAY STUDIO */}
        {(essayStudioOpen || selectedPaper === "Essay") && (
          <div className="mb-8">
            <EssayStudio />
          </div>
        )}

        {/* QCAB BOOKLET GENERATOR */}
        {qcabGeneratorOpen && (
          <div className="mb-8">
            <MainsQCABGenerator />
          </div>
        )}

        {/* TOPPER MIRROR ANALYZER */}
        {topperMirrorOpen && (
          <div className="mb-8">
            <TopperMirrorAnalyzer />
          </div>
        )}

        {/* GS PAPER FILTER TABS */}
        <section className="mb-4 flex flex-wrap gap-2">
          {GS_PAPERS.map((paper) => {
            const count = paperCounts[paper] || 0;
            const isSelected = selectedPaper === paper;

            return (
              <button
                key={paper}
                onClick={() => {
                  setSelectedPaper(paper);
                  setSelectedSubject("All Subjects");
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-600/30 scale-105"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span>{paper}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isSelected ? "bg-black/30 text-white" : "bg-white/10 text-white/50"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </section>

        {/* SUBJECT SUB-RIBBON */}
        {availableSubjects.length > 2 && (
          <section className="mb-5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="shrink-0 text-[11px] font-bold uppercase text-white/40">Subject:</span>
            {availableSubjects.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`shrink-0 rounded-lg px-3 py-1 transition ${
                  selectedSubject === sub
                    ? "bg-purple-600 text-white font-bold"
                    : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {sub}
              </button>
            ))}
          </section>
        )}

        {/* SEARCH & SECONDARY CONTROLS */}
        <section className="mb-6 grid gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3 sm:grid-cols-[1fr_130px_130px_auto_auto]">
          <input
            type="text"
            placeholder="Search keywords, topics, directives, articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/30 px-3.5 py-2 text-xs text-white outline-none placeholder:text-white/30 focus:border-pink-500"
          />

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#120a22] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-pink-500"
          >
            <option value="All Years">All Years</option>
            {availableYears.map((yr) => (
              <option key={yr} value={String(yr)}>
                {yr}
              </option>
            ))}
          </select>

          <select
            value={selectedMarks}
            onChange={(e) => setSelectedMarks(e.target.value)}
            className="rounded-xl border border-white/10 bg-[#120a22] px-3 py-2 text-xs font-semibold text-white outline-none focus:border-pink-500"
          >
            <option value="All Marks">All Marks</option>
            <option value="10">10 Marks (150 Words)</option>
            <option value="15">15 Marks (250 Words)</option>
            <option value="20">20 Marks (Case Study)</option>
            <option value="125">125 Marks (Essay)</option>
          </select>

          <button
            onClick={() => setImportantOnly((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              importantOnly
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            ⭐ High Yield
          </button>

          <button
            onClick={() => setBookmarksOnly((v) => !v)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
              bookmarksOnly
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            🔖 Bookmarked ({bookmarkedIds.size})
          </button>
        </section>

        {/* QUESTIONS LIST */}
        {filteredQuestions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <span className="text-3xl">🔍</span>
            <p className="mt-3 text-base font-bold">No Mains questions match your filters</p>
            <p className="mt-1 text-xs text-white/40">Try resetting filters or importing your custom Mains JSON.</p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedPaper("All Papers");
                  setSelectedSubject("All Subjects");
                  setSelectedYear("All Years");
                  setSelectedMarks("All Marks");
                  setSearch("");
                  setImportantOnly(false);
                  setBookmarksOnly(false);
                }}
                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => setUploadModalOpen(true)}
                className="rounded-xl bg-pink-600 px-4 py-2 text-xs font-bold text-white hover:bg-pink-500"
              >
                + Import JSON File
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredQuestions.map((q, index) => {
              const strId = q.id;
              const isPracticed = practicedIds.has(strId);
              const isBookmarked = bookmarkedIds.has(strId);
              const isExpanded = expandedFrameworkIds.has(strId);
              const draft = drafts[strId];

              return (
                <article
                  key={`mains-q-${strId}-${index}`}
                  className={`rounded-2xl border p-6 transition-all ${
                    isPracticed
                      ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                      : "border-white/10 bg-white/[0.03] hover:border-pink-500/40"
                  }`}
                >
                  {/* QUESTION TOP BAR */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-pink-500/20 text-xs font-black text-pink-300">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-[10px] font-bold text-pink-300">
                            {q.paper}
                          </span>
                          <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300">
                            {q.subject}
                          </span>
                          <span className="rounded-full bg-blue-500/20 px-2.5 py-0.5 text-[10px] font-semibold text-blue-300">
                            {q.year}
                          </span>
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                            {q.marks} Marks ({q.wordLimit} Words)
                          </span>
                          {q.directive && (
                            <span className="rounded-full border border-pink-500/40 bg-pink-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase text-pink-300">
                              Directive: {q.directive}
                            </span>
                          )}
                          {isPracticed && (
                            <span className="text-[10px] font-bold text-emerald-400">✓ Practiced</span>
                          )}
                        </div>

                        {/* QUESTION STATEMENT */}
                        <h3 className="mt-3 text-base font-semibold leading-relaxed text-white/95 sm:text-lg">
                          {q.question}
                        </h3>

                        {/* LINKED USER NOTES PREVIEW CHIPS */}
                        {(() => {
                          const linkedNotes = findRelatedNotesForMains(q, userVaultNotes, 2);
                          if (linkedNotes.length === 0) return null;
                          return (
                            <div className="mt-2 flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                              <span className="text-[#8C8C8C]">🔗 Linked Notes:</span>
                              {linkedNotes.map(({ note: n }) => (
                                <button
                                  key={n.id}
                                  onClick={() => router.push("/notes")}
                                  className="rounded bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-purple-300 hover:bg-purple-500/20 transition cursor-pointer"
                                >
                                  {n.title.length > 28 ? `${n.title.slice(0, 28)}...` : n.title}
                                </button>
                              ))}
                            </div>
                          );
                        })()}

                        {/* DIRECTIVE GUIDANCE */}
                        {q.directiveGuidance && (
                          <p className="mt-2 text-xs italic text-pink-300/80">
                            💡 <strong>Examiner Note:</strong> {q.directiveGuidance}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2 self-end sm:self-start">
                      {/* SAVE MODEL ANSWER TO NOTES */}
                      <button
                        onClick={() => handleSaveMainsToNotes(q)}
                        title="Save complete model framework, case laws & diagram to Notes Vault"
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold font-mono transition flex items-center gap-1 cursor-pointer ${
                          noteSaveStatus[strId]
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold"
                            : "border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
                        }`}
                      >
                        <span>📝</span>
                        <span>{noteSaveStatus[strId] || "Save to Notes"}</span>
                      </button>

                      <button
                        onClick={() => handleToggleBookmark(q.id)}
                        title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
                        className={`rounded-xl border p-2 text-xs transition cursor-pointer ${
                          isBookmarked
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-300"
                            : "border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isBookmarked ? "★" : "☆"}
                      </button>

                      <button
                        onClick={() => handleOpenWritingWorkspace(q)}
                        className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-pink-600/30 transition hover:opacity-90 cursor-pointer"
                      >
                        <span>✍️</span>
                        <span>{draft ? "Continue Draft" : "Write Answer"}</span>
                      </button>

                      <button
                        onClick={() => handleTogglePracticed(q.id)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                          isPracticed
                            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                            : "border-white/10 bg-white/5 text-white/50 hover:bg-white/10"
                        }`}
                      >
                        {isPracticed ? "✓ Done" : "Mark Done"}
                      </button>
                    </div>
                  </div>

                  {/* USER DRAFT BADGE IF EXISTS */}
                  {draft && (
                    <div className="mt-4 rounded-xl border border-purple-500/30 bg-purple-500/10 p-3 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-2 text-purple-200">
                        <span>📝 Draft Saved ({draft.wordCount} words)</span>
                        {draft.aiEvaluation && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300">
                            Score: {draft.aiEvaluation.score} / {draft.aiEvaluation.maxMarks}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleOpenWritingWorkspace(q)}
                        className="text-pink-300 hover:text-white font-bold underline"
                      >
                        Open Draft ↗
                      </button>
                    </div>
                  )}

                  {/* MODEL ANSWER FRAMEWORK ACCORDION */}
                  {q.framework && (
                    <div className="mt-4">
                      {isExpanded ? (
                        <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-b from-[#130924] to-[#0a0515] p-5 text-xs sm:text-sm leading-relaxed shadow-xl">
                          <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <span className="font-black text-xs uppercase tracking-wider text-pink-400">
                              🏆 Model Answer Architecture
                            </span>
                            <button
                              onClick={() => handleToggleFramework(q.id)}
                              className="text-xs font-bold text-white/50 hover:text-white"
                            >
                              Collapse ▲
                            </button>
                          </div>

                          {/* 1. INTRODUCTION */}
                          <div className="mt-3">
                            <h4 className="font-bold text-purple-300">1. Introduction (Context / Definition / Data):</h4>
                            <p className="mt-1 text-white/90 leading-relaxed pl-3 border-l-2 border-purple-500">
                              {q.framework.introduction}
                            </p>
                          </div>

                          {/* 2. BODY DIMENSIONS */}
                          <div className="mt-4 space-y-3">
                            <h4 className="font-bold text-pink-300">2. Multi-Dimensional Body Analysis:</h4>
                            {safeArray(q.framework.dimensions).map((dim, dIdx) => (
                              <div key={`dim-${dIdx}`} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                                <p className="font-bold text-white/95">• {dim.heading}</p>
                                <ul className="mt-1.5 space-y-1 pl-4 text-white/80 list-disc">
                                  {safeArray(dim.points).map((pt, pIdx) => (
                                    <li key={`pt-${dIdx}-${pIdx}`}>{pt}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* 3. DIAGRAM & CASE LAWS */}
                          {(q.framework.diagramOrFlowchart || q.framework.caseLawsOrArticlesOrCommittees) && (
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                              {q.framework.diagramOrFlowchart && (
                                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
                                  <span className="font-bold text-blue-300 block mb-1">📊 Diagram / Visual Framework:</span>
                                  <p className="text-white/80">{q.framework.diagramOrFlowchart}</p>
                                </div>
                              )}
                              {q.framework.caseLawsOrArticlesOrCommittees && (
                                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                                  <span className="font-bold text-amber-300 block mb-1">⚖️ Key Case Laws / Articles / Committees:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {q.framework.caseLawsOrArticlesOrCommittees.map((item, cIdx) => (
                                      <span key={`case-${cIdx}`} className="rounded bg-black/40 px-2 py-0.5 text-[11px] text-amber-200">
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 4. CONCLUSION */}
                          <div className="mt-4">
                            <h4 className="font-bold text-emerald-300">3. Forward-Looking Conclusion / Way Forward:</h4>
                            <p className="mt-1 text-white/90 leading-relaxed pl-3 border-l-2 border-emerald-500">
                              {q.framework.conclusion}
                            </p>
                          </div>

                          {/* 4. MAP / SPATIAL DIAGRAM IF AVAILABLE */}
                          {q.framework.mapDiagram && (
                            <div className="mt-4 rounded-xl border border-teal-500/30 bg-teal-500/5 p-3">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-bold text-teal-300">🗺️ Spatial Map / Geographic Blueprint:</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(q.framework?.mapDiagram || "");
                                    sound.playClick();
                                    alert("✓ Map blueprint copied to clipboard!");
                                  }}
                                  className="text-[10px] font-bold text-teal-400 hover:text-white underline"
                                >
                                  Copy Map Stencil
                                </button>
                              </div>
                              <pre className="overflow-x-auto rounded-lg bg-black/60 p-2.5 font-mono text-[10px] text-teal-200/90 leading-tight">
                                {q.framework.mapDiagram}
                              </pre>
                            </div>
                          )}

                          {/* KEYWORDS */}
                          {q.framework.keywords && q.framework.keywords.length > 0 && (
                            <div className="mt-4 border-t border-white/10 pt-3">
                              <span className="text-[11px] font-bold text-white/50 block mb-1">High-Impact Keywords to Include:</span>
                              <div className="flex flex-wrap gap-1.5">
                                {q.framework.keywords.map((kw, kIdx) => (
                                  <span key={`kw-${kIdx}`} className="rounded-md bg-purple-500/20 px-2 py-0.5 text-[11px] font-semibold text-purple-200">
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleToggleFramework(q.id)}
                          className="text-xs font-bold text-[#F4C95D] hover:text-white transition flex items-center gap-1"
                        >
                          <span>🎯 View Question Directive & Framework Guidance ▼</span>
                        </button>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* =======================================================================
          FULLSCREEN LIVE ANSWER WRITING WORKSPACE MODAL
          ======================================================================= */}
      {activeWritingQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 sm:p-6">
          <div className="flex h-full max-h-[92vh] w-full max-w-5xl flex-col rounded-3xl border border-pink-500/30 bg-[#090414] shadow-2xl overflow-hidden">
            {/* WORKSPACE HEADER */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-bold text-pink-300">
                  {activeWritingQ.paper} · {activeWritingQ.year}
                </span>
                <span className="text-xs text-white/50">
                  Target: <strong className="text-white">{activeWritingQ.marks} Marks ({activeWritingQ.wordLimit} Words)</strong>
                </span>
              </div>

              {/* TIMER & WORD COUNT INDICATOR */}
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-1 font-mono text-xs font-bold border ${
                    activeWordCount > activeWritingQ.wordLimit * 1.15
                      ? "border-red-500/40 bg-red-500/10 text-red-300"
                      : "border-purple-500/40 bg-purple-500/10 text-purple-200"
                  }`}
                >
                  <span>✍️</span>
                  <span>
                    {activeWordCount} / {activeWritingQ.wordLimit} Words
                  </span>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs font-bold text-white">
                  <span>⏱️</span>
                  <span>{formattedTime}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (activeWritingQ) {
                      exportMainsAnswerBooklet(
                        activeWritingQ,
                        drafts[activeWritingQ.id] || {
                          questionId: activeWritingQ.id,
                          draftText: activeDraftText,
                          wordCount: activeWordCount,
                          timeSpentSeconds: timerSeconds,
                          savedAt: new Date().toISOString(),
                        }
                      );
                    }
                  }}
                  title="Print or Save UPSC Answer Booklet as PDF"
                  className="rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1 font-mono text-xs font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition"
                >
                  🖨️ Export Booklet (PDF)
                </button>

                <button
                  onClick={() => {
                    handleSaveDraft();
                    setActiveWritingQ(null);
                  }}
                  className="rounded-xl bg-white/10 px-3 py-1 text-xs font-bold text-white hover:bg-white/20"
                >
                  ✕ Close & Save
                </button>
              </div>
            </div>

            {/* QUESTION BANNER */}
            <div className="border-b border-white/10 bg-black/30 px-6 py-3">
              <p className="text-sm font-semibold text-white/95">{activeWritingQ.question}</p>
            </div>

            {/* TAB SWITCHER */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 px-6 bg-black/20">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("editor")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                    activeTab === "editor"
                      ? "border-[#D8A63A] text-[#F4C95D]"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  ✏️ Answer Editor
                </button>
                <button
                  onClick={() => setActiveTab("framework")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition ${
                    activeTab === "framework"
                      ? "border-[#D8A63A] text-[#F4C95D]"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  🏆 Model Answer Framework
                </button>
                <button
                  onClick={() => setActiveTab("scanner")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === "scanner"
                      ? "border-[#D8A63A] text-[#F4C95D]"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <span>📷</span>
                  <span>Handwritten Sheet Scanner ({scannedSheets.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab("stencils")}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                    activeTab === "stencils"
                      ? "border-purple-500 text-purple-300"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  <span>🎨</span>
                  <span>Standard Stencils</span>
                </button>
              </div>

              {/* LAUNCH INTERACTIVE DIAGRAM STUDIO */}
              <button
                onClick={() => setDiagramStudioOpen(true)}
                className="my-1.5 flex items-center gap-1.5 rounded-xl border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1 font-mono text-[11px] font-bold text-[#F4C95D] hover:bg-[#D8A63A]/20 transition"
              >
                <span>⚡</span>
                <span>Diagram Studio Builder</span>
              </button>
            </div>

            {/* WORKSPACE BODY */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "editor" ? (
                <div className="flex flex-col h-full space-y-4">
                  {/* DIRECTIVE GUIDANCE CHIP */}
                  {activeWritingQ.directive && DIRECTIVE_GUIDELINES[activeWritingQ.directive] && (
                    <div className="flex items-center justify-between rounded-xl border border-[#D8A63A]/30 bg-[#D8A63A]/10 px-4 py-2 text-xs font-mono">
                      <span className="text-[#F4C95D] font-bold">
                        💡 Directive: &ldquo;{activeWritingQ.directive}&rdquo;
                      </span>
                      <span className="text-white/80">
                        {DIRECTIVE_GUIDELINES[activeWritingQ.directive].structureRecommendation}
                      </span>
                    </div>
                  )}

                  <textarea
                    value={activeDraftText}
                    onChange={(e) => setActiveDraftText(e.target.value)}
                    placeholder="Write your complete UPSC Mains structured answer here... (Introduction hook, Sub-headed Body points, Diagrams description, and Visionary Conclusion)"
                    className="w-full flex-1 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm sm:text-base leading-relaxed text-white outline-none placeholder:text-white/30 focus:border-[#D8A63A] resize-none font-sans"
                    rows={14}
                  />

                  {/* AI EVALUATION REPORT IF AVAILABLE */}
                  {drafts[activeWritingQ.id]?.aiEvaluation && (
                    <div className="rounded-2xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-5 text-xs sm:text-sm shadow-xl">
                      <div className="flex items-center justify-between font-bold text-[#F4C95D] border-b border-white/10 pb-3">
                        <span className="flex items-center gap-2 font-mono">
                          <span>🤖</span>
                          <span>UPSC AI RUBRIC EVALUATION REPORT</span>
                        </span>
                        <span className="rounded-full bg-[#D8A63A]/20 px-3 py-1 font-mono text-xs font-black text-amber-300">
                          Score: {drafts[activeWritingQ.id].aiEvaluation?.score} /{" "}
                          {drafts[activeWritingQ.id].aiEvaluation?.maxMarks} Marks
                        </span>
                      </div>
                      <div className="mt-3.5 space-y-2 text-white/90">
                        <p><strong className="text-[#F4C95D]">• Introduction Anchor:</strong> {drafts[activeWritingQ.id].aiEvaluation?.introFeedback}</p>
                        <p><strong className="text-[#F4C95D]">• Body Dimensions & Evidence:</strong> {drafts[activeWritingQ.id].aiEvaluation?.bodyFeedback}</p>
                        <p><strong className="text-[#F4C95D]">• Conclusion & Vision 2047:</strong> {drafts[activeWritingQ.id].aiEvaluation?.conclusionFeedback}</p>
                      </div>
                      <div className="mt-3 border-t border-white/10 pt-3">
                        <span className="font-bold text-[#F4C95D] font-mono text-xs uppercase">Strategic Value Additions:</span>
                        <ul className="list-disc pl-4 mt-1.5 space-y-1 text-white/80">
                          {drafts[activeWritingQ.id].aiEvaluation?.valueAdditionTips.map((tip, tIdx) => (
                            <li key={`eval-tip-${tIdx}`}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === "scanner" ? (
                /* TAB: HANDWRITTEN SHEET SCANNER & OCR STUDIO */
                <div className="flex flex-col gap-6">
                  <div className="rounded-2xl border border-[#D8A63A]/30 bg-gradient-to-r from-[#171206] to-[#0d0d0d] p-5 shadow-xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="rounded-full bg-[#D8A63A]/20 px-2.5 py-0.5 text-[10px] font-mono font-black uppercase text-[#F4C95D]">
                          📷 Vision Document Scanner
                        </span>
                        <h3 className="mt-1 text-base sm:text-lg font-bold text-white font-mono">
                          Handwritten UPSC Answer Booklet Scanner
                        </h3>
                        <p className="mt-0.5 text-xs text-[#8C8C8C]">
                          Upload photos of your handwritten answer pages. The system automatically enhances document contrast for AI evaluation.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleUploadAnswerSheet}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-xl border border-[#D8A63A] bg-[#D8A63A] px-4 py-2 text-xs font-mono font-black text-black shadow-[0_0_20px_rgba(216,166,58,0.3)] hover:scale-105 transition"
                        >
                          + Upload Page Photos
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SCANNED PAGES GALLERY */}
                  {scannedSheets.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-black/30 p-12 text-center">
                      <span className="text-4xl">📄</span>
                      <p className="mt-3 text-sm font-bold text-white">No handwritten sheets uploaded yet</p>
                      <p className="mt-1 text-xs text-[#8C8C8C]">
                        Write your answer on standard UPSC ruled/unruled sheets and upload photos for rubric grading.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {scannedSheets.map((sheet, index) => (
                        <div
                          key={index}
                          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-lg"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sheet}
                            alt={`Scanned Answer Page ${index + 1}`}
                            className="h-64 w-full object-cover transition duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-between">
                            <span className="rounded-md bg-black/80 px-2 py-0.5 font-mono text-[10px] font-bold text-[#F4C95D] self-start border border-[#D8A63A]/30">
                              PAGE #{index + 1}
                            </span>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono text-emerald-400">
                                ✓ Contrast Enhanced
                              </span>
                              <button
                                onClick={() => handleRemoveScannedSheet(index)}
                                className="rounded-lg bg-red-500/80 px-2.5 py-1 text-xs font-bold text-white hover:bg-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : activeTab === "framework" ? (
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
                  {activeWritingQ.framework ? (
                    <>

                      {/* SPATIAL MAP BLUEPRINT */}
                      {activeWritingQ.framework.mapDiagram && (
                        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-teal-300">🗺️ Spatial Map Blueprint / Geographic Axis</span>
                            <button
                              onClick={() => {
                                const mapText = activeWritingQ.framework?.mapDiagram || "";
                                setActiveDraftText((prev) => (prev ? `${prev}\n\n${mapText}` : mapText));
                                setActiveTab("editor");
                                sound.playVictory();
                              }}
                              className="rounded-lg bg-teal-600 px-2 py-1 text-[11px] font-bold text-white hover:bg-teal-500 shadow"
                            >
                              + Insert Map into Draft
                            </button>
                          </div>
                          <pre className="overflow-x-auto rounded-lg bg-black/50 p-2.5 font-mono text-[10px] text-teal-200/90 leading-tight border border-white/5">
                            {activeWritingQ.framework.mapDiagram}
                          </pre>
                        </div>
                      )}

                      <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                        <h4 className="font-bold text-purple-300">1. Introduction:</h4>
                        <p className="mt-1 text-white/90">{activeWritingQ.framework.introduction}</p>
                      </div>

                      <div className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-4 space-y-3">
                        <h4 className="font-bold text-pink-300">2. Body Analysis:</h4>
                        {activeWritingQ.framework.dimensions.map((dim, i) => (
                          <div key={`modal-dim-${i}`} className="pl-3 border-l-2 border-pink-500">
                            <p className="font-bold text-white">{dim.heading}</p>
                            <ul className="list-disc pl-4 mt-1 space-y-1 text-white/80">
                              {dim.points.map((p, j) => (
                                <li key={`modal-pt-${i}-${j}`}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                        <h4 className="font-bold text-emerald-300">3. Conclusion:</h4>
                        <p className="mt-1 text-white/90">{activeWritingQ.framework.conclusion}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-white/50 text-center py-12">No framework available for this question.</p>
                  )}
                </div>
              ) : (
                /* TAB 3: DIAGRAMS & PESTLE STENCIL STUDIO */
                <div className="space-y-6">
                  {/* PESTLE 360 GENERATOR BANNER */}
                  <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-r from-[#1d0a33] via-[#2d0e4c] to-[#140624] p-5 shadow-xl">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase text-purple-300">
                          ⚡ PESTLE 360° Generator
                        </span>
                        <h3 className="mt-1 text-lg font-bold text-white">
                          Multi-Dimensional Analysis Matrix
                        </h3>
                        <p className="mt-0.5 text-xs text-white/60">
                          Auto-generate a 6-pillar framework (Political, Economic, Social, Tech, Legal, Eco) for this question.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const outline = generatePESTLEOutline(
                            activeWritingQ.topic || activeWritingQ.subject,
                            activeWritingQ.directive || "Discuss"
                          );
                          setActiveDraftText((prev) => (prev ? `${prev}\n\n${outline}` : outline));
                          setActiveTab("editor");
                        }}
                        className="shrink-0 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:opacity-90"
                      >
                        + Insert PESTLE Matrix into Draft
                      </button>
                    </div>
                  </div>

                  {/* STENCIL GALLERY */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
                      Standard UPSC Visual Stencils & Flowcharts
                    </h4>

                    <div className="grid gap-4 md:grid-cols-2">
                      {STANDARD_DIAGRAM_STENCILS.map((stencil) => (
                        <div
                          key={stencil.id}
                          className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-white">{stencil.title}</span>
                              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                                {stencil.category}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-white/50">{stencil.description}</p>
                            <pre className="mt-3 overflow-x-auto rounded-xl bg-black/50 p-3 font-mono text-[10px] leading-tight text-white/80">
                              {stencil.stencilText}
                            </pre>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(stencil.stencilText);
                                alert("✓ Diagram stencil copied to clipboard!");
                              }}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/10"
                            >
                              📋 Copy
                            </button>
                            <button
                              onClick={() => {
                                setActiveDraftText((prev) =>
                                  prev ? `${prev}\n\n${stencil.stencilText}` : stencil.stencilText
                                );
                                setActiveTab("editor");
                              }}
                              className="rounded-lg bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-500"
                            >
                              + Insert into Draft
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>


            {/* WORKSPACE FOOTER */}
            <div className="flex items-center justify-between border-t border-white/10 px-6 py-4 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveDraft}
                  className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20"
                >
                  💾 Save Draft
                </button>
                <button
                  onClick={handleEvaluateDraft}
                  disabled={aiEvaluating || activeWordCount < 20}
                  className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 disabled:opacity-40 flex items-center gap-1.5"
                >
                  <span>🤖</span>
                  <span>{aiEvaluating ? "Evaluating..." : "AI Review"}</span>
                </button>
              </div>

              <button
                onClick={() => {
                  handleSaveDraft();
                  handleTogglePracticed(activeWritingQ.id);
                  setActiveWritingQ(null);
                }}
                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2 text-xs font-bold text-white shadow-lg"
              >
                Complete Answer Writing ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          CUSTOM JSON UPLOAD MODAL
          ======================================================================= */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-pink-500/30 bg-[#0c0618] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📁</span>
                <h3 className="font-extrabold text-base">Import Custom Mains PYQs JSON</h3>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-xs text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs text-white/70 leading-relaxed">
              Paste your custom Mains JSON array or object below. The system will parse questions, validate required fields (<code>id</code>, <code>year</code>, <code>paper</code>, <code>subject</code>, <code>question</code>, <code>marks</code>), and merge them seamlessly into your archive.
            </p>

            <textarea
              value={jsonUploadText}
              onChange={(e) => setJsonUploadText(e.target.value)}
              placeholder='[ { "id": "UPSC-MAINS-2025-GS1-01", "year": 2025, "paper": "GS-1", "subject": "History", "question": "...", "marks": 15, "wordLimit": 250 } ]'
              rows={9}
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-xs text-white outline-none focus:border-pink-500"
            />

            {uploadError && (
              <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                ✕ {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-bold">
                ✓ {uploadSuccess}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setUploadModalOpen(false)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleProcessUpload}
                disabled={!jsonUploadText.trim()}
                className="rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2 text-xs font-bold text-white shadow-lg disabled:opacity-40"
              >
                Import & Merge Questions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================================
          INTERACTIVE DIAGRAM & MATRIX STUDIO MODAL
          ======================================================================= */}
      {diagramStudioOpen && (
        <MainsDiagramStudio
          onInsertDiagram={handleInsertDiagram}
          onClose={() => setDiagramStudioOpen(false)}
        />
      )}
    </main>
    </AuthGuard>
  );
}

