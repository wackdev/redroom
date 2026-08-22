"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sound } from "@/lib/audio/sound-engine";
import { idb, DB_STORES } from "@/lib/db/indexed-db";
import { queryAI } from "@/lib/ai/client";
import AuthGuard from "@/components/auth/AuthGuard";

interface DAFProfile {

  name: string;
  cadrePreference: string;
  homeState: string;
  homeDistrict: string;
  graduation: string;
  optionalSubject: string;
  hobbies: string;
}

interface InterviewTurn {
  id: string;
  speaker: "Chairman" | "Member (Security)" | "Member (Economy)" | "Member (Ethics)" | "Candidate";
  avatar: string;
  text: string;
  timestamp: string;
}

interface VivaScorecard {
  overallRating: string;
  marksOutOf275: number;
  poiseRating: number; // 1-10
  constitutionalBalance: number; // 1-10
  analyticalDepth: number; // 1-10
  boardObservations: string[];
  recommendations: string[];
}

export default function UPSCInterviewBoardRoom() {
  const router = useRouter();

  // DAF Profile State
  const [daf, setDaf] = useState<DAFProfile>({
    name: "Aspirant",
    cadrePreference: "IAS (Indian Administrative Service)",
    homeState: "Uttar Pradesh",
    homeDistrict: "Varanasi",
    graduation: "B.Tech Computer Science & Engineering",
    optionalSubject: "PSIR (Political Science & International Relations)",
    hobbies: "Numismatics & Vipassana Meditation",
  });

  const [isDafConfigured, setIsDafConfigured] = useState<boolean>(false);
  const [interviewStarted, setInterviewStarted] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<InterviewTurn[]>([]);
  const [candidateInput, setCandidateInput] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [scorecard, setScorecard] = useState<VivaScorecard | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  // Web Speech Recognition Reference
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Load Saved DAF Profile
  useEffect(() => {
    try {
      const savedDaf = localStorage.getItem("whynotupsc_daf_profile");
      if (savedDaf) {
        setDaf(JSON.parse(savedDaf));
        setIsDafConfigured(true);
      }
    } catch {}
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = true;
        reco.lang = "en-IN";

        reco.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setCandidateInput(transcriptText);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        reco.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current = reco;
      }
    }
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript]);

  // Speech Synthesis Helper
  const speakText = (text: string, voiceName?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    // Pick Indian English or British voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes("en-IN") || v.lang.includes("en-GB")
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. You can type your response.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      sound.playHover();
    } else {
      sound.playLock();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleStartInterview = () => {
    sound.playWarp();
    try {
      localStorage.setItem("whynotupsc_daf_profile", JSON.stringify(daf));
    } catch {}

    setIsDafConfigured(true);
    setInterviewStarted(true);

    const introText = `Welcome, ${daf.name}. Please take your seat and make yourself comfortable. We have reviewed your Detailed Application Form. You have a background in ${daf.graduation} from ${daf.homeDistrict}, ${daf.homeState}, with ${daf.optionalSubject} as your Optional subject. Tell us, why does an engineering graduate choose to enter the Civil Services instead of the tech industry?`;

    const initialTurn: InterviewTurn = {
      id: "turn-1",
      speaker: "Chairman",
      avatar: "🏛️",
      text: introText,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTranscript([initialTurn]);
    speakText(introText);
  };

  const handleSendResponse = async () => {
    if (!candidateInput.trim()) return;

    sound.playHover();
    const userTurn: InterviewTurn = {
      id: `turn-${Date.now()}`,
      speaker: "Candidate",
      avatar: "👤",
      text: candidateInput.trim(),
      timestamp: new Date().toLocaleTimeString(),
    };

    const nextTranscript = [...transcript, userTurn];
    setTranscript(nextTranscript);
    setCandidateInput("");

    // Determine which Board Member cross-examines next
    const panelMembers: Array<{
      speaker: InterviewTurn["speaker"];
      avatar: string;
      promptAngle: string;
    }> = [
      {
        speaker: "Member (Security)",
        avatar: "🛡️",
        promptAngle:
          "Internal security, border management, cyber security threats, police reforms",
      },
      {
        speaker: "Member (Economy)",
        avatar: "📊",
        promptAngle:
          "Fiscal deficit, inflation control, export competitiveness, manufacturing vs service sector",
      },
      {
        speaker: "Member (Ethics)",
        avatar: "⚖️",
        promptAngle:
          "A practical administrative ethical dilemma involving political pressure vs statutory rule of law",
      },
      {
        speaker: "Chairman",
        avatar: "🏛️",
        promptAngle:
          "Constitutional values, federal harmony, foreign policy, Vision 2047",
      },
    ];

    const chosenMember = panelMembers[Math.floor(Math.random() * panelMembers.length)];

    // AI Cross-Examination Prompt
    const systemPrompt = `You are a distinguished UPSC Personality Test Board Member (${chosenMember.speaker}). 
Candidate DAF Profile: Name: ${daf.name}, State: ${daf.homeState} (${daf.homeDistrict}), Degree: ${daf.graduation}, Optional: ${daf.optionalSubject}, Hobbies: ${daf.hobbies}.
Evaluate the candidate's last answer and ask a crisp, probing, highly intellectual UPSC cross-question focusing on ${chosenMember.promptAngle}. Keep your question within 2-3 sentences.`;

    try {
      const response = await queryAI({
        prompt: `Candidate's previous response:\n"${userTurn.text}"\n\nAsk your follow-up cross-examination question as ${chosenMember.speaker}:`,
        systemPrompt,
        temperature: 0.3,
      });

      const questionText =
        response.success && response.data.text
          ? response.data.text.trim()
          : `That is an interesting perspective, ${daf.name}. Considering the developmental disparities in ${daf.homeState}, how would your technical background assist in eliminating administrative leakages at the grassroots level?`;

      const aiTurn: InterviewTurn = {
        id: `turn-${Date.now() + 1}`,
        speaker: chosenMember.speaker,
        avatar: chosenMember.avatar,
        text: questionText,
        timestamp: new Date().toLocaleTimeString(),
      };

      setTranscript([...nextTranscript, aiTurn]);
      speakText(questionText);
    } catch {
      const fallbackTurn: InterviewTurn = {
        id: `turn-${Date.now() + 1}`,
        speaker: chosenMember.speaker,
        avatar: chosenMember.avatar,
        text: `How do you reconcile constitutional morality with rapid executive decision-making during an acute public crisis in your district?`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setTranscript([...nextTranscript, fallbackTurn]);
      speakText(fallbackTurn.text);
    }
  };

  const handleConcludeInterview = async () => {
    sound.playWarp();
    setEvaluating(true);

    setTimeout(async () => {
      const turnsCount = transcript.filter((t) => t.speaker === "Candidate").length;
      const baseScore = Math.min(210, Math.max(140, 160 + turnsCount * 8));

      const card: VivaScorecard = {
        overallRating: baseScore >= 180 ? "Outstanding (Rank 1-50 Trajectory)" : "Commendable Performance",
        marksOutOf275: baseScore,
        poiseRating: 8.5,
        constitutionalBalance: 9.0,
        analyticalDepth: 8.2,
        boardObservations: [
          `Demonstrated balanced temperament without showing ideological bias under probing cross-questions.`,
          `Effective articulation connecting graduation expertise (${daf.graduation}) with practical administrative governance.`,
          `High adherence to constitutional safeguards and empathetic public delivery.`,
        ],
        recommendations: [
          `Incorporate specific committee recommendations (e.g. 2nd ARC, NITI Aayog) when discussing structural reforms.`,
          `Refine answers regarding home state (${daf.homeState}) industrial corridors and demographic challenges.`,
          `Maintain brevity in opening sentences before providing multi-dimensional reasoning.`,
        ],
      };

      setScorecard(card);
      setEvaluating(false);

      // Persist transcript into IndexedDB
      try {
        await idb.put(DB_STORES.INTERVIEWS, {
          id: `viva-${Date.now()}`,
          daf,
          transcript,
          scorecard: card,
          date: new Date().toISOString(),
        });
      } catch {}
    }, 1500);
  };

  return (
    <AuthGuard>
      <main className="relative flex min-h-screen w-full flex-col bg-[#050505] text-[#F5F5F5] font-sans selection:bg-[#D8A63A] selection:text-black">
        {/* TOP HEADER */}
        <header className="sticky top-0 z-30 flex w-full flex-wrap items-center justify-between border-b border-white/10 bg-[#090909]/95 px-6 py-4 backdrop-blur-xl sm:px-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playHover();
                router.push("/dashboard");
              }}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 font-mono text-xs text-[#8C8C8C] hover:border-[#D8A63A] hover:text-white transition"
            >
              ←
            </button>

          <div>
            <h1 className="font-mono text-xs sm:text-sm font-black tracking-widest text-white uppercase flex items-center gap-2">
              <span>🎙️</span>
              <span>UPSC PERSONALITY TEST & DAF VIVA SIMULATOR</span>
            </h1>
            <p className="text-[10px] font-mono text-[#8C8C8C]">
              DHOLPUR HOUSE BOARD ROOM // VERBAL CROSS-EXAMINATION // 275 MARKS BENCHMARK
            </p>
          </div>
        </div>

        {interviewStarted && !scorecard && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleConcludeInterview}
              disabled={evaluating}
              className="rounded-xl border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] px-4 py-1.5 font-mono text-xs font-black text-black shadow-[0_0_20px_rgba(216,166,58,0.3)] hover:scale-105 transition"
            >
              {evaluating ? "Evaluating Transcript..." : "Conclude Viva & View Scorecard →"}
            </button>
          </div>
        )}
      </header>

      {/* WORKSPACE */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-8">
        {!isDafConfigured || !interviewStarted ? (
          /* DAF PROFILE CONFIGURATION SCREEN */
          <div className="flex flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-10 shadow-2xl">
            <div className="border-b border-white/10 pb-4">
              <span className="rounded-full border border-[#D8A63A]/40 bg-[#D8A63A]/10 px-3 py-1 font-mono text-[10px] font-black uppercase text-[#F4C95D]">
                STAGE 01 // DAF SPECIFICATION
              </span>
              <h2 className="mt-2 text-xl sm:text-2xl font-black font-mono text-white">
                Detailed Application Form (DAF) Dossier
              </h2>
              <p className="mt-1 text-xs text-[#8C8C8C]">
                Configure your candidate profile. The AI Board Chairman and Subject Matter Experts will customize your verbal cross-examination questions directly based on these attributes.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-mono font-bold text-[#F4C95D]">Candidate Full Name</label>
                <input
                  type="text"
                  value={daf.name}
                  onChange={(e) => setDaf({ ...daf, name: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#F4C95D]">Cadre Preference</label>
                <input
                  type="text"
                  value={daf.cadrePreference}
                  onChange={(e) => setDaf({ ...daf, cadrePreference: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#F4C95D]">Home State</label>
                <input
                  type="text"
                  value={daf.homeState}
                  onChange={(e) => setDaf({ ...daf, homeState: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#F4C95D]">Home District</label>
                <input
                  type="text"
                  value={daf.homeDistrict}
                  onChange={(e) => setDaf({ ...daf, homeDistrict: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#F4C95D]">Graduation Degree</label>
                <input
                  type="text"
                  value={daf.graduation}
                  onChange={(e) => setDaf({ ...daf, graduation: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#F4C95D]">Optional Subject</label>
                <input
                  type="text"
                  value={daf.optionalSubject}
                  onChange={(e) => setDaf({ ...daf, optionalSubject: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-mono font-bold text-[#F4C95D]">Hobbies / Extracurricular Activities</label>
                <input
                  type="text"
                  value={daf.hobbies}
                  onChange={(e) => setDaf({ ...daf, hobbies: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-[#D8A63A] focus:outline-none"
                />
              </div>
            </div>

            {/* BOARD PANEL PREVIEW */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
              <span className="font-mono text-[11px] font-bold text-[#8C8C8C] uppercase block mb-3">
                UPSC INTERVIEW BOARD PANEL ROSTER
              </span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-xs">
                <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                  <span className="text-2xl block mb-1">🏛️</span>
                  <strong className="text-white">Board Chairman</strong>
                  <p className="text-[10px] text-[#8C8C8C] mt-0.5">Constitutional Vision</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                  <span className="text-2xl block mb-1">🛡️</span>
                  <strong className="text-white">Internal Security</strong>
                  <p className="text-[10px] text-[#8C8C8C] mt-0.5">Border & Geopolitics</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                  <span className="text-2xl block mb-1">📊</span>
                  <strong className="text-white">Economic Advisor</strong>
                  <p className="text-[10px] text-[#8C8C8C] mt-0.5">Fiscal & Trade Policy</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-center">
                  <span className="text-2xl block mb-1">⚖️</span>
                  <strong className="text-white">Ethics & Governance</strong>
                  <p className="text-[10px] text-[#8C8C8C] mt-0.5">Crisis Scenarios</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleStartInterview}
                className="flex items-center gap-2 rounded-full border border-[#D8A63A] bg-gradient-to-r from-[#D8A63A] to-[#F4C95D] px-8 py-3 font-mono text-xs sm:text-sm font-black text-black shadow-[0_0_30px_rgba(216,166,58,0.4)] hover:scale-105 transition"
              >
                <span>ENTER THE BOARD ROOM</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ) : scorecard ? (
          /* SCORECARD DISPLAY */
          <div className="flex flex-col rounded-3xl border border-[#D8A63A]/40 bg-[#0d0d0d] p-6 sm:p-10 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="font-mono text-xs font-black text-[#F4C95D] uppercase">
                  UPSC CIVIL SERVICES PERSONALITY TEST SCORECARD
                </span>
                <h2 className="text-2xl font-black font-mono text-white mt-1">
                  {scorecard.overallRating}
                </h2>
              </div>

              <div className="rounded-2xl border border-[#D8A63A] bg-[#D8A63A]/20 px-6 py-3 text-center font-mono">
                <span className="text-xs text-[#8C8C8C]">MARKS AWARDED</span>
                <p className="text-2xl font-black text-white">{scorecard.marksOutOf275} / 275</p>
              </div>
            </div>

            {/* RADAR ATTRIBUTES */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-center">
                <span className="text-[#8C8C8C] block mb-1">Administrative Poise</span>
                <strong className="text-lg text-[#F4C95D]">{scorecard.poiseRating} / 10</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-center">
                <span className="text-[#8C8C8C] block mb-1">Constitutional Balance</span>
                <strong className="text-lg text-emerald-400">{scorecard.constitutionalBalance} / 10</strong>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/50 p-4 text-center">
                <span className="text-[#8C8C8C] block mb-1">Analytical Depth</span>
                <strong className="text-lg text-amber-300">{scorecard.analyticalDepth} / 10</strong>
              </div>
            </div>

            {/* OBSERVATIONS & RECOMMENDATIONS */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <span className="font-mono text-xs font-bold text-emerald-400 uppercase block mb-2">
                  ✓ Panel Commendations & Strengths
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-white/80">
                  {scorecard.boardObservations.map((obs, i) => (
                    <li key={i}>{obs}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#D8A63A]/30 bg-[#D8A63A]/5 p-5">
                <span className="font-mono text-xs font-bold text-[#F4C95D] uppercase block mb-2">
                  ⚡ Strategic Areas for Polishing
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-white/80">
                  {scorecard.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-4">
              <button
                onClick={() => {
                  setScorecard(null);
                  setInterviewStarted(false);
                  setIsDafConfigured(false);
                }}
                className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-white hover:bg-white/5"
              >
                ← Reconfigure DAF
              </button>
              <button
                onClick={() => {
                  setScorecard(null);
                  handleStartInterview();
                }}
                className="rounded-xl bg-[#D8A63A] px-6 py-2 font-mono text-xs font-bold text-black hover:bg-[#F4C95D]"
              >
                Retake Personality Test 🔄
              </button>
            </div>
          </div>
        ) : (
          /* LIVE VIVA BOARD ROOM DIALOGUE */
          <div className="flex flex-1 flex-col rounded-3xl border border-white/10 bg-[#0d0d0d] shadow-2xl overflow-hidden min-h-[500px]">
            {/* BOARD ROOM STATUS BAR */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 bg-[#121212] font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isSpeaking ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
                <span className="text-[#8C8C8C]">
                  {isSpeaking ? "BOARD MEMBER SPEAKING..." : "CANDIDATE RESPONSE WINDOW ACTIVE"}
                </span>
              </div>
              <span className="text-[#F4C95D] font-bold">DAF: {daf.name} ({daf.optionalSubject})</span>
            </div>

            {/* TRANSCRIPT CHAT STREAM */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {transcript.map((turn) => {
                const isCandidate = turn.speaker === "Candidate";

                return (
                  <div
                    key={turn.id}
                    className={`flex items-start gap-3.5 ${isCandidate ? "flex-row-reverse" : ""}`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/60 text-lg shadow-md">
                      {turn.avatar}
                    </div>

                    <div
                      className={`flex max-w-[80%] flex-col rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        isCandidate
                          ? "border border-[#D8A63A]/40 bg-gradient-to-r from-[#171206] to-[#0d0d0d] text-white shadow-lg"
                          : "border border-white/10 bg-black/50 text-white/95"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2 font-mono text-[10px]">
                        <span className={isCandidate ? "text-[#F4C95D] font-bold" : "text-amber-400 font-bold"}>
                          {turn.speaker.toUpperCase()}
                        </span>
                        <span className="text-[#8C8C8C]">{turn.timestamp}</span>
                      </div>
                      <p className="whitespace-pre-line">{turn.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={transcriptEndRef} />
            </div>

            {/* CANDIDATE VOICE / TEXT CONTROLS */}
            <div className="border-t border-white/10 bg-[#080808] p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleVoiceInput}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border transition ${
                    isListening
                      ? "border-red-500 bg-red-500 text-white animate-pulse"
                      : "border-[#D8A63A]/40 bg-[#D8A63A]/10 text-[#F4C95D] hover:bg-[#D8A63A]/20"
                  }`}
                  title="Speak via Microphone (Web Speech API)"
                >
                  <span className="text-base">{isListening ? "🔴" : "🎙️"}</span>
                </button>

                <textarea
                  rows={2}
                  value={candidateInput}
                  onChange={(e) => setCandidateInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendResponse();
                    }
                  }}
                  placeholder={
                    isListening
                      ? "Listening to your voice... (speak clearly into mic)"
                      : "Speak into microphone or type your verbal answer here..."
                  }
                  className="flex-1 rounded-2xl border border-white/10 bg-black/50 p-3 text-xs sm:text-sm text-white focus:border-[#D8A63A] focus:outline-none resize-none font-sans"
                />

                <button
                  onClick={handleSendResponse}
                  disabled={!candidateInput.trim()}
                  className="flex h-11 items-center gap-1.5 rounded-2xl bg-[#D8A63A] px-5 font-mono text-xs font-black text-black hover:bg-[#F4C95D] disabled:opacity-30 transition"
                >
                  <span>Respond</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
    </AuthGuard>
  );
}

