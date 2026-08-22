"use client";

import { useEffect, useState, useRef } from "react";
import { sound } from "@/lib/audio/sound-engine";
import { useRouter } from "next/navigation";

export interface HistoryEra {
  year: number;
  eraTitle: string;
  codename: string;
  theme: string;
  causes: string[];
  keyEvents: string[];
  consequences: string[];
  pyqCount: number;
  pyqSample: string;
}

export default function HistoryTimeTunnel() {
  const router = useRouter();
  const [activeEraIndex, setActiveEraIndex] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const historyTimeline: HistoryEra[] = [
    {
      year: 1757,
      eraTitle: "Battle of Plassey & British Foothold",
      codename: "ERA-1757",
      theme: "Advent of British Imperial Control in Bengal",
      causes: [
        "Misuse of Dastaks (trade permits) by English East India Company officials",
        "Fortification of Calcutta without Nawab Siraj-ud-Daulah's permission",
        "Asylum granted to political fugitive Krishna Das",
      ],
      keyEvents: [
        "Secret conspiracy between Robert Clive and Mir Jafar, Rai Durlabh, and Jagat Seth",
        "Battle of Plassey (23 June 1757) — tactical victory with minimal combat",
        "Mir Jafar proclaimed puppet Nawab; 24 Parganas ceded to Company",
      ],
      consequences: [
        "Transformation of English Company from commercial traders to military arbiters",
        "Economic drain of Bengal began; laid foundation for Battle of Buxar (1764)",
      ],
      pyqCount: 14,
      pyqSample: "With reference to the Battle of Plassey (1757), consider the role of Mir Jafar and the subsequent Dual Government system.",
    },
    {
      year: 1857,
      eraTitle: "The Great Revolt of 1857",
      codename: "ERA-1857",
      theme: "First Major Structural Challenge to Colonial Rule",
      causes: [
        "Lord Dalhousie's aggressive Doctrine of Lapse (Satara, Jhansi, Nagpur)",
        "Introduction of Enfield Rifle with greased cartridges offensive to religious beliefs",
        "Severe economic ruin of Indian handicrafts, artisans, and zamindars under Permanent Settlement",
      ],
      keyEvents: [
        "Mangal Pandey's revolt at Barrackpore (29 March 1857)",
        "Meerut outbreak (10 May 1857) and proclamation of Bahadur Shah Zafar as Emperor of India",
        "Resistance centers: Rani Lakshmibai (Jhansi), Nana Saheb & Tatya Tope (Kanpur), Begum Hazrat Mahal (Awadh)",
      ],
      consequences: [
        "Abolition of British East India Company rule via Government of India Act 1858",
        "Queen Victoria's Proclamation; Indian Army reorganization on divide-and-rule balance",
      ],
      pyqCount: 26,
      pyqSample: "The 1857 uprising was the culmination of recurrent big and small local rebellions. Elaborate.",
    },
    {
      year: 1885,
      eraTitle: "Genesis of National Consciousness & INC",
      codename: "ERA-1885",
      theme: "Formation of Indian National Congress & Moderate Phase",
      causes: [
        "Growth of modern vernacular press and Western education creating pan-Indian elite",
        "Lord Lytton's reactionary policies (Vernacular Press Act 1878, Arms Act)",
        "Ilbert Bill controversy (1883) exposing white racism",
      ],
      keyEvents: [
        "First session of INC held at Gokuldas Tejpal Sanskrit College, Bombay (Dec 1885)",
        "Presided over by W.C. Bonnerjee; 72 political delegates attended",
        "Early Moderate leadership: Dadabhai Naoroji, Gopal Krishna Gokhale, Pherozeshah Mehta",
      ],
      consequences: [
        "Development of economic critique of imperialism (Naoroji's Drain Theory)",
        "Constitutional agitation leading to Indian Councils Act 1892",
      ],
      pyqCount: 18,
      pyqSample: "Discuss the economic critique of colonial rule formulated by early Indian nationalists.",
    },
    {
      year: 1905,
      eraTitle: "Partition of Bengal & Swadeshi Movement",
      codename: "ERA-1905",
      theme: "Rise of Extremism & Mass Boycott Agitation",
      causes: [
        "Lord Curzon's administrative partition of Bengal on communal lines (Oct 1905)",
        "Deliberate strategy to foster Muslim separatism and divide Bengali intelligentsia",
      ],
      keyEvents: [
        "Boycott and Swadeshi resolution passed at Calcutta Town Hall (7 Aug 1905)",
        "Raksha Bandhan observed as symbol of Hindu-Muslim unity",
        "Rise of Lal-Bal-Pal and Aurobindo Ghosh advocating Passive Resistance and Swaraj",
      ],
      consequences: [
        "Emergence of revolutionary terrorism and Surat Split (1907)",
        "Partition of Bengal annulled in 1911; Capital shifted from Calcutta to Delhi",
      ],
      pyqCount: 22,
      pyqSample: "The Swadeshi Movement marks an important milestone in modern Indian mass mobilization. Explain.",
    },
    {
      year: 1919,
      eraTitle: "Rowlatt Satyagraha & Non-Cooperation",
      codename: "ERA-1919",
      theme: "Gandhian Ascendancy & Mass Mobilization",
      causes: [
        "Montagu-Chelmsford Reforms (GoI Act 1919) introducing limited provincial Dyarchy",
        "Rowlatt Act allowing detention without trial, curtailing civil liberties",
        "Khilafat issue following the dismemberment of the Ottoman Empire",
      ],
      keyEvents: [
        "Jallianwala Bagh Massacre in Amritsar under General Dyer (13 April 1919)",
        "Launch of Non-Cooperation Movement & Khilafat Alliance (1920)",
        "Surrender of colonial titles, boycott of British cloth and law courts",
      ],
      consequences: [
        "Transformed freedom struggle into a true peasant and mass movement",
        "Withdrawal of movement following Chauri Chaura incident (Feb 1922)",
      ],
      pyqCount: 31,
      pyqSample: "Examine how Gandhian Non-Cooperation mobilized multiple social strata across India.",
    },
    {
      year: 1930,
      eraTitle: "Civil Disobedience & Round Table Conferences",
      codename: "ERA-1930",
      theme: "Defiance of Colonial Laws & Constitutional Deadlock",
      causes: [
        "Simon Commission boycott (1928) and death of Lala Lajpat Rai",
        "Lahore Congress (1929) adopting Purna Swaraj (Complete Independence)",
        "Viceroy Irwin's refusal of Gandhi's 11-point ultimatum",
      ],
      keyEvents: [
        "Dandi March (12 March – 6 April 1930) and breaking of the Salt Law",
        "First, Second (Gandhi attended), and Third Round Table Conferences in London",
        "Gandhi-Irwin Pact (1931) and Poona Pact with Dr. B.R. Ambedkar (1932)",
      ],
      consequences: [
        "Enactment of the Government of India Act 1935 (Provincial Autonomy)",
        "Demonstrated that British rule could no longer govern without consent",
      ],
      pyqCount: 29,
      pyqSample: "Analyze the ideological significance of the Salt Satyagraha in mobilizing women and marginalized communities.",
    },
    {
      year: 1942,
      eraTitle: "Quit India Movement & INA Surge",
      codename: "ERA-1942",
      theme: "Final Mass Struggle & Armed Vanguard",
      causes: [
        "Failure of the Cripps Mission (1942) offering post-war Dominion status",
        "Imminent threat of Japanese invasion during World War II",
        "Severe wartime inflation, food scarcity, and Bengal Famine",
      ],
      keyEvents: [
        "AICC Mumbai session (8 Aug 1942) passing 'Quit India' with Gandhi's 'Do or Die' call",
        "Arrest of all top Congress leaders; spontaneous underground resistance (Aruna Asaf Ali, Usha Mehta)",
        "Subhas Chandra Bose reorganizing Indian National Army (Azad Hind Fauj) with 'Delhi Chalo'",
      ],
      consequences: [
        "Destruction of colonial administrative apparatus across key districts (Parallel Governments)",
        "Royal Indian Navy (RIN) Mutiny (Feb 1946) sealing the end of British dominance",
      ],
      pyqCount: 24,
      pyqSample: "The Quit India Movement was unique in its spontaneous underground leadership. Discuss.",
    },
    {
      year: 1947,
      eraTitle: "Partition & Dawn of Sovereign India",
      codename: "ERA-1947",
      theme: "Transfer of Power & Constitutional Foundation",
      causes: [
        "Cabinet Mission Plan (1946) failure to bridge Congress and Muslim League rift",
        "Direct Action Day (16 Aug 1946) triggering widespread communal violence",
      ],
      keyEvents: [
        "Lord Mountbatten's 3rd June Plan partitioning British India into India and Pakistan",
        "Passing of Indian Independence Act 1947 by British Parliament",
        "Sardar Vallabhbhai Patel and V.P. Menon orchestrating the integration of 565 Princely States",
      ],
      consequences: [
        "Birth of the Sovereign Democratic Republic of India (15 August 1947)",
        "Adoption of the Constitution of India drafted by Dr. B.R. Ambedkar (26 Nov 1949)",
      ],
      pyqCount: 35,
      pyqSample: "Evaluate the role of Sardar Patel in integrating princely states into the Indian Union.",
    },
  ];

  const currentEra = historyTimeline[activeEraIndex];

  // 3D Canvas Time Tunnel Wormhole
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    let tunnelTime = 0;

    const render = () => {
      ctx.fillStyle = "#050505";
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      tunnelTime += 0.02;

      // 3D Concentric Tunnel Rings
      const ringCount = 12;
      for (let i = 0; i < ringCount; i++) {
        const progress = ((i + tunnelTime) % ringCount) / ringCount;
        const radius = Math.pow(progress, 2.5) * (width * 0.6);
        const alpha = Math.min(1, progress * 1.5);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 27, 27, ${alpha * 0.35})`;
        ctx.lineWidth = 1 + progress * 2;
        ctx.stroke();

        // Warp Ray Lines
        if (i % 3 === 0) {
          const rayAngle = (i * Math.PI) / 3 + tunnelTime * 0.5;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(centerX + Math.cos(rayAngle) * radius, centerY + Math.sin(rayAngle) * radius);
          ctx.strokeStyle = `rgba(255, 27, 27, ${alpha * 0.15})`;
          ctx.stroke();
        }
      }

      // Year Floating Hologram in Center
      ctx.font = "900 36px monospace";
      ctx.fillStyle = "#FF1B1B";
      ctx.textAlign = "center";
      ctx.shadowColor = "#FF1B1B";
      ctx.shadowBlur = 20;
      ctx.fillText(String(currentEra.year), centerX, centerY + 12);
      ctx.shadowBlur = 0;

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [currentEra]);

  const handleSelectEra = (idx: number) => {
    sound.playLock();
    setActiveEraIndex(idx);
  };

  return (
    <div className="flex flex-col rounded-3xl border border-[#FF1B1B]/30 bg-[#0d0d0d] p-6 backdrop-blur-xl shadow-2xl">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase text-[#FF1B1B]">
              CHRONO-WARP PROTOCOL // MODERN INDIAN HISTORY
            </span>
          </div>
          <h2 className="mt-1 font-mono text-xl sm:text-2xl font-black text-white">
            3D Historical Time Tunnel (1757 – 1947)
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Warp through defining moments of India&apos;s colonial expansion and national struggle.
          </p>
        </div>

        <button
          onClick={() => router.push("/tests")}
          data-cursor="TEST"
          className="rounded-xl border border-[#FF1B1B]/50 bg-[#FF1B1B]/10 px-4 py-2 font-mono text-xs font-bold text-[#FF1B1B] hover:bg-[#FF1B1B]/20 transition"
        >
          Take Modern History Mock →
        </button>
      </div>

      {/* TIMELINE YEAR SELECTOR SCRUBBER */}
      <div className="my-6 flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {historyTimeline.map((era, idx) => {
          const isActive = idx === activeEraIndex;
          return (
            <button
              key={era.year}
              onClick={() => handleSelectEra(idx)}
              data-cursor="WARP"
              className={`flex shrink-0 flex-col items-center rounded-2xl border px-4 py-3 font-mono transition-all ${
                isActive
                  ? "border-[#FF1B1B] bg-[#FF1B1B] text-black shadow-[0_0_20px_rgba(255,27,27,0.6)] scale-105"
                  : "border-white/10 bg-black/40 text-[#8C8C8C] hover:border-white/30 hover:text-white"
              }`}
            >
              <span className={`text-base font-black ${isActive ? "text-black" : "text-white"}`}>
                {era.year}
              </span>
              <span className={`text-[9px] font-bold uppercase ${isActive ? "text-black/80" : "text-[#8C8C8C]"}`}>
                {era.codename}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3D TIME TUNNEL & DEEP DIVE CONTAINER */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* 3D TIME TUNNEL VISUALIZER */}
        <div className="relative h-[300px] lg:h-auto lg:col-span-5 overflow-hidden rounded-2xl border border-[#FF1B1B]/20 bg-[#050505] flex items-center justify-center">
          <canvas ref={canvasRef} className="h-full w-full" />
          <div className="pointer-events-none absolute bottom-4 text-center">
            <span className="font-mono text-[10px] tracking-widest text-white/50 uppercase">
              WARP VECTOR LOCKED
            </span>
          </div>
        </div>

        {/* HISTORICAL REVELATION MATRIX */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[10px] font-bold text-[#FF1B1B] uppercase">
                  {currentEra.theme}
                </span>
                <h3 className="text-lg font-black text-white">{currentEra.eraTitle}</h3>
              </div>
              <span className="rounded-full bg-[#FF1B1B]/15 px-3 py-1 font-mono text-xs font-black text-[#FF1B1B]">
                {currentEra.pyqCount} PYQs Mapped
              </span>
            </div>

            {/* CAUSES & EVENTS */}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h4 className="font-mono text-xs font-bold text-red-400 uppercase">⚡ Catalysts & Causes</h4>
                <ul className="mt-2 space-y-1.5 text-xs text-white/80">
                  {currentEra.causes.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FF1B1B]">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-mono text-xs font-bold text-amber-400 uppercase">🏛️ Key Developments</h4>
                <ul className="mt-2 space-y-1.5 text-xs text-white/80">
                  {currentEra.keyEvents.map((e, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CONSEQUENCES */}
            <div className="mt-4 border-t border-white/10 pt-3">
              <h4 className="font-mono text-xs font-bold text-emerald-400 uppercase">🎯 Historical Consequences</h4>
              <ul className="mt-2 space-y-1.5 text-xs text-white/80">
                {currentEra.consequences.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* UPSC PYQ RADAR BOX */}
            <div className="mt-4 rounded-xl border border-[#FF1B1B]/30 bg-[#FF1B1B]/5 p-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF1B1B]">
                <span>🎯</span>
                <span>UPSC EXAM RADAR</span>
              </div>
              <p className="mt-1 text-xs text-white/90 italic">&quot;{currentEra.pyqSample}&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
