"use client";
import { useState, useEffect, useRef } from "react";
import AppUniversalHeader from "@/components/AppUniversalHeader";
import { UserSessionManager } from "@/lib/core/user-context";

interface VoiceNote {
  id: string;
  title: string;
  transcript: string;
  gsPaper: "GS-1" | "GS-2" | "GS-3" | "GS-4" | "Optional" | "General";
  durationSeconds: number;
  createdAt: string;
  tags: string[];
}

const SAMPLE_VOICE_NOTES: VoiceNote[] = [
  {
    id: "vn-1",
    title: "Basic Structure Doctrine & Kesavananda Bharati Landmark Summary",
    transcript: "Kesavananda Bharati v. State of Kerala (1973) 13-judge bench 7-6 majority. Article 368 gives constituent power to amend the constitution but cannot alter its basic structure. Core pillars include supremacy of Constitution, republican and democratic form of government, secular character, separation of powers, and judicial review under Articles 32 and 226.",
    gsPaper: "GS-2",
    durationSeconds: 74,
    createdAt: "Aug 24, 2026",
    tags: ["Polity", "Judiciary", "Landmark Judgments"]
  },
  {
    id: "vn-2",
    title: "CRISPR-Cas9 Gene Editing & Somatic vs Germline Therapy",
    transcript: "CRISPR uses guide RNA to direct Cas9 endonuclease to cut targeted DNA sequence. Somatic cell therapy modifies non-reproductive cells with no transmissible inheritable changes (approved for sickle cell anemia). Germline editing changes sperm/egg/embryo DNA which gets passed to future generations, carrying severe bioethical risks under ICMR guidelines.",
    gsPaper: "GS-3",
    durationSeconds: 62,
    createdAt: "Aug 23, 2026",
    tags: ["Science & Tech", "Biotechnology", "Ethics"]
  }
];

export default function VoiceNotesPage() {
  const [user] = useState(UserSessionManager.getActiveUser());
  const [notes, setNotes] = useState<VoiceNote[]>(SAMPLE_VOICE_NOTES);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [selectedPaper, setSelectedPaper] = useState<VoiceNote["gsPaper"]>("GS-2");
  const [searchFilter, setSearchFilter] = useState("");

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Web Speech API if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event: any) => {
          let full = "";
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + " ";
          }
          setLiveTranscript(full);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const startRecording = () => {
    setLiveTranscript("");
    setRecordingSeconds(0);
    setIsRecording(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {}
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const saveNote = () => {
    if (!liveTranscript.trim()) return;

    const newNote: VoiceNote = {
      id: `vn-${Date.now()}`,
      title: noteTitle.trim() || `Voice Note (${selectedPaper}) - ${new Date().toLocaleDateString()}`,
      transcript: liveTranscript.trim(),
      gsPaper: selectedPaper,
      durationSeconds: recordingSeconds,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      tags: [selectedPaper, "Audio Dictation"]
    };

    setNotes([newNote, ...notes]);
    setNoteTitle("");
    setLiveTranscript("");
    setRecordingSeconds(0);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const filteredNotes = notes.filter(n => {
    return searchFilter === "" ||
      n.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      n.transcript.toLowerCase().includes(searchFilter.toLowerCase()) ||
      n.gsPaper.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0b16 0%, #150e24 50%, #070711 100%)" }}>
      <AppUniversalHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3 text-xs font-semibold uppercase tracking-wider"
            style={{ background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.3)", color: "#fb7185" }}>
            <span>🎙️</span> AI Voice Dictation & Audio Memory Studio
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            UPSC Voice Note & Quick Recall Studio
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm">
            Dictate thoughts, audio summaries, and keyword associations during walks or travel. Uses browser speech recognition with real-time transcription and GS Paper categorization.
          </p>
        </div>

        {/* Recording Engine Bar */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl backdrop-blur-xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.4)"
          }}>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white transition-all shadow-xl shrink-0"
                style={{
                  background: isRecording ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #f43f5e, #e11d48)",
                  boxShadow: isRecording ? "0 0 30px rgba(239,68,68,0.5)" : "0 8px 24px rgba(244,63,94,0.3)"
                }}>
                {isRecording ? "⏹" : "🎙️"}
              </button>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isRecording ? "Listening & Transcribing Voice..." : "Ready to Record Audio Note"}
                </h3>
                <p className="text-xs text-gray-400">
                  {isRecording ? `Recording time: ${formatSeconds(recordingSeconds)}` : "Click the mic button and speak clearly in English/Hindi."}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={selectedPaper}
                onChange={(e) => setSelectedPaper(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white bg-black/40 border border-white/10 focus:outline-none">
                <option value="GS-1">GS-1 (History/Geo/Society)</option>
                <option value="GS-2">GS-2 (Polity/IR/Governance)</option>
                <option value="GS-3">GS-3 (Economy/Sci-Tech/Env)</option>
                <option value="GS-4">GS-4 (Ethics/Integrity)</option>
                <option value="Optional">Optional Subject</option>
                <option value="General">General / Strategy</option>
              </select>

              {liveTranscript && (
                <button
                  onClick={saveNote}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-lg"
                  style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
                  ✓ Save Note
                </button>
              )}
            </div>
          </div>

          {/* Title & Live Transcript Area */}
          <div className="pt-5 space-y-3">
            <input
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Give your note a title (optional)..."
              className="w-full px-4 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 bg-black/30 border border-white/10 focus:outline-none"
            />

            <textarea
              value={liveTranscript}
              onChange={(e) => setLiveTranscript(e.target.value)}
              placeholder="Your transcribed words will appear here in real-time as you speak... You can also edit text directly."
              className="w-full h-32 bg-black/20 text-xs text-gray-200 placeholder-gray-600 rounded-2xl p-4 border border-white/5 resize-none leading-relaxed focus:outline-none"
            />
          </div>
        </div>

        {/* Saved Notes Header & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>📚</span> Your Audio Revision Vault ({filteredNotes.length})
          </h2>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search voice notes by topic or keyword..."
            className="w-full sm:w-72 px-4 py-2 rounded-xl text-xs text-white placeholder-gray-500 bg-black/40 border border-white/10 focus:outline-none"
          />
        </div>

        {/* Voice Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="p-6 rounded-3xl backdrop-blur-xl flex flex-col justify-between"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)"
              }}>
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                    {note.gsPaper}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    ⏱️ {formatSeconds(note.durationSeconds)} • {note.createdAt}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-2 leading-snug">{note.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-4 mb-4">
                  "{note.transcript}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (typeof window !== "undefined" && "speechSynthesis" in window) {
                      const utterance = new SpeechSynthesisUtterance(note.transcript);
                      utterance.rate = 1.0;
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="px-3 py-1 rounded-xl text-xs font-semibold text-pink-300 bg-pink-500/20 border border-pink-500/30 hover:bg-pink-500/30 transition-all flex items-center gap-1.5">
                  <span>🔊</span> Listen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
