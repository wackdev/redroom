"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface EssayFramework {
  id: string;
  topic: string;
  themeCategory: "Philosophical" | "Societal" | "Governance & Tech" | "Environmental & Global";
  quoteOrPrompt: string;
  anecdoteHook: {
    title: string;
    narrative: string;
    connectionToTheme: string;
  };
  dimensions360: {
    dimension: string;
    perspective: string;
    realWorldExamples: string[];
  }[];
  counterNuance: {
    critique: string;
    reconciliation: string;
  };
  forwardLookingConclusion: {
    philosophicalSynthesis: string;
    constitutionalAndGlobalAnchors: string;
  };
}

const ESSAY_BLUEPRINT_BANK: EssayFramework[] = [
  {
    id: "essay-1",
    topic: "Internal Resilience vs External Chaos",
    themeCategory: "Philosophical",
    quoteOrPrompt: "Ships do not sink because of water around them; ships sink because of water that gets into them.",
    anecdoteHook: {
      title: "The Unyielding Stoicism of Marcus Aurelius & the Antonine Plague",
      narrative: "In 165 CE, when the Antonine Plague decimated Rome and Germanic tribes breached the Danube frontier, Emperor Marcus Aurelius retreated not into despair, but into his personal journal 'Meditations', reminding himself that external calamities have no power over the internal citadel of the human mind.",
      connectionToTheme: "The Roman Empire was enveloped by turbulent waters of crisis, yet its enduring institutional anchor was the moral and psychological fortitude within."
    },
    dimensions360: [
      {
        dimension: "1. Individual & Psychological Dimension",
        perspective: "Cognitive autonomy and emotional regulation. Emotional intelligence (EQ) as the ballast that prevents negative external stress from penetrating individual character.",
        realWorldExamples: ["Nelson Mandela's 27 years in Robben Island cell", "Viktor Frankl's 'Man's Search for Meaning' in concentration camps"]
      },
      {
        dimension: "2. Societal & Cultural Dimension",
        perspective: "Societies collapse not because of external invasions, but when internal social cohesion, moral trust, and civic morality corrode from within.",
        realWorldExamples: ["Toynbee's Challenge and Response thesis", "Internal caste divisions facilitating British colonial divide-and-rule"]
      },
      {
        dimension: "3. Institutional & Governance Dimension",
        perspective: "Constitutional democracy thrives amid global turbulence if internal integrity, judicial independence, and civil service neutrality remain uncompromised.",
        realWorldExamples: ["Basic Structure Doctrine (*Kesavananda Bharati*) preserving constitutional spirit", "Election Commission upholding institutional credibility"]
      },
      {
        dimension: "4. Economic & National Security Dimension",
        perspective: "Macroeconomic resilience: External trade shocks or commodity surges cannot derail a nation with strong domestic buffers, fiscal prudence, and robust forex reserves.",
        realWorldExamples: ["India navigating 2008 Global Financial Crisis & 2022 supply chain shocks", "Self-reliance via Atmanirbhar Bharat"]
      }
    ],
    counterNuance: {
      critique: "Can a ship withstand extreme external tsunamis regardless of its internal integrity? Excessive isolationism or ignoring external systemic shocks (e.g. Climate Change, Geopolitical War) can overwhelm even the strongest internal hull.",
      reconciliation: "Internal fortitude must be paired with proactive external diplomacy and adaptive structural engineering."
    },
    forwardLookingConclusion: {
      philosophicalSynthesis: "In an interconnected world of hyper-globalization and algorithmic turbulence, the ultimate defense of human civilization lies in guarding the internal sanctuary of constitutional values, empathy, and ethical clarity.",
      constitutionalAndGlobalAnchors: "Anchoring national policy in the Preamble's ideals of Justice, Liberty, and Fraternity, ensuring India acts as a 'Vishwa-Bandhu' navigating stormy global waters with internal moral clarity."
    }
  },
  {
    id: "essay-2",
    topic: "Epistemic Humility & Democratic Dialogue",
    themeCategory: "Philosophical",
    quoteOrPrompt: "Wisdom finds truth in dialogue, not certainty.",
    anecdoteHook: {
      title: "The Socratic Elenchus and Adi Shankara's Shastrarthas",
      narrative: "When Socrates walked the Agora of Athens, he famously proclaimed that his only wisdom was knowing that he knew nothing. Centuriess later in ancient India, Adi Shankara engaged Mandana Mishra in open philosophical debate (Shastrartha), where Mandana's wife Bharati judged the discourse, proving that truth emerges through fearless dialectics.",
      connectionToTheme: "Dogmatic certainty calcifies thought; genuine wisdom is forged through respectful, rigorous interrogation of opposing viewpoints."
    },
    dimensions360: [
      {
        dimension: "1. Philosophical & Epistemological Dimension",
        perspective: "Jain philosophy of Anekantavada (Many-sidedness of reality) and Syadvada (Conditionality of truth). Truth is multi-faceted like the elephant examined by the blind men.",
        realWorldExamples: ["Socratic dialectic method", "Jain doctrine of Anekantavada & Nayavada"]
      },
      {
        dimension: "2. Democratic & Parliamentary Governance",
        perspective: "Democracy is institutionalized dialogue. When parliamentary debate is replaced by legislative guillotine or echo chambers, democratic legitimacy erodes.",
        realWorldExamples: ["Constituent Assembly debates (1946-49) crafting consensus without a single violent clash", "Inter-State Council under Article 263"]
      },
      {
        dimension: "3. Scientific & Technological Progress",
        perspective: "Karl Popper's Falsification Principle: Science advances not through immutable dogma, but through relentless questioning, peer review, and disprovable hypotheses.",
        realWorldExamples: ["Einstein challenging Newtonian mechanics", "Open-source AI research vs walled proprietary silos"]
      },
      {
        dimension: "4. Geopolitical & Conflict Resolution",
        perspective: "Diplomatic multilateralism: The greatest global peace accords are born from patient dialogue rather than coercive unilateral dominance.",
        realWorldExamples: ["India's G20 Presidency forging New Delhi Declaration amid Ukraine deadlock", "Panchsheel principles"]
      }
    ],
    counterNuance: {
      critique: "Does endless dialogue lead to policy paralysis (Analysis Paralysis)? In acute crises (pandemics, military aggression), executive decision-making requires swift conviction and decisive action.",
      reconciliation: "Dialogue informs the blueprint of policy; decisive conviction executes it without succumbing to dogma."
    },
    forwardLookingConclusion: {
      philosophicalSynthesis: "In the 21st-century digital public square inundated with polarized echo chambers and algorithmic certitude, reclaiming the art of deep listening is the highest civilizational virtue.",
      constitutionalAndGlobalAnchors: "Reflecting the Rigvedic prayer 'Ano bhadrah kratavo yantu vishwatah' (Let noble thoughts come to us from all sides) to build an enlightened, deliberative democracy."
    }
  }
];

export default function EssayStudio() {
  const [selectedEssay, setSelectedEssay] = useState<EssayFramework>(ESSAY_BLUEPRINT_BANK[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleCopyFramework = () => {
    sound.playClick();
    const text = `📝 UPSC ESSAY ARCHITECTURE BLUEPRINT
Title: "${selectedEssay.quoteOrPrompt}"
Theme: ${selectedEssay.themeCategory}

1. ANECDOTAL HOOK:
${selectedEssay.anecdoteHook.title}
${selectedEssay.anecdoteHook.narrative}
Hook Connection: ${selectedEssay.anecdoteHook.connectionToTheme}

2. 360° MULTI-DIMENSIONAL MATRIX:
${selectedEssay.dimensions360
  .map(
    (d) =>
      `• ${d.dimension}\n  Perspective: ${d.perspective}\n  Examples: ${d.realWorldExamples.join(
        ", "
      )}`
  )
  .join("\n\n")}

3. CRITIQUE & NUANCED RECONCILIATION:
Critique: ${selectedEssay.counterNuance.critique}
Synthesis: ${selectedEssay.counterNuance.reconciliation}

4. FORWARD-LOOKING CONCLUSION:
${selectedEssay.forwardLookingConclusion.philosophicalSynthesis}
Constitutional Anchor: ${selectedEssay.forwardLookingConclusion.constitutionalAndGlobalAnchors}`;

    navigator.clipboard.writeText(text);
    alert("✓ Complete 1,200-Word Essay Blueprint copied to clipboard!");
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#080511] p-5 shadow-2xl backdrop-blur-2xl">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-sm">
              ✍️
            </span>
            <h2 className="font-mono text-base font-black tracking-wide text-white sm:text-lg">
              UPSC Essay Multi-Dimensional Architecture Studio
            </h2>
          </div>
          <p className="text-xs text-white/50">
            Deconstruct abstract & philosophical essay prompts into 1,000–1,200 word structured blueprints
          </p>
        </div>

        <button
          onClick={handleCopyFramework}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 font-mono text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition shadow-lg shadow-amber-950/40"
        >
          <span>📋</span>
          <span>Copy Complete Essay Blueprint</span>
        </button>
      </div>

      {/* ESSAY SELECTOR TABS */}
      <div className="mb-6 flex flex-wrap gap-2">
        {ESSAY_BLUEPRINT_BANK.map((e) => (
          <button
            key={e.id}
            onClick={() => {
              sound.playClick();
              setSelectedEssay(e);
            }}
            className={`rounded-2xl border px-4 py-2.5 text-left transition ${
              selectedEssay.id === e.id
                ? "border-amber-500 bg-amber-500/20 text-white shadow-lg shadow-amber-950/40"
                : "border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
              {e.themeCategory}
            </span>
            <span className="text-xs font-bold line-clamp-1">{e.quoteOrPrompt}</span>
          </button>
        ))}
      </div>

      {/* ESSAY ARCHITECTURE MATRIX */}
      <div className="space-y-6">
        {/* 1. ANECDOTAL HOOK */}
        <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
              SECTION 1: INTRODUCTORY HOOK (~150 Words)
            </span>
            <span className="text-xs font-mono text-white/50">Historical Anecdote</span>
          </div>
          <h3 className="text-sm font-bold text-white">{selectedEssay.anecdoteHook.title}</h3>
          <p className="text-xs text-white/80 leading-relaxed italic">
            "{selectedEssay.anecdoteHook.narrative}"
          </p>
          <div className="rounded-xl border border-white/5 bg-black/40 p-3 text-xs text-amber-200/90">
            <span className="font-bold text-amber-300">🔗 Thesis Connection: </span>
            {selectedEssay.anecdoteHook.connectionToTheme}
          </div>
        </div>

        {/* 2. 360° MULTI-DIMENSIONAL MATRIX */}
        <div className="space-y-3">
          <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-[10px] font-bold text-purple-300">
            SECTION 2: 360° MULTI-DIMENSIONAL ANALYSIS (~700 Words)
          </span>

          <div className="grid gap-3 sm:grid-cols-2">
            {selectedEssay.dimensions360.map((dim, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2 hover:bg-white/[0.04] transition"
              >
                <h4 className="text-xs font-bold text-purple-300">{dim.dimension}</h4>
                <p className="text-xs text-white/80 leading-relaxed">{dim.perspective}</p>
                <div className="rounded-xl bg-black/40 p-2 text-[11px] text-white/60">
                  <span className="font-semibold text-white/80">Case Studies / Citations: </span>
                  {dim.realWorldExamples.join(" • ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. COUNTER-NUANCE & SYNTHESIS */}
        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-2xl border border-pink-500/30 bg-pink-950/10 p-4 space-y-1.5">
            <span className="font-bold text-pink-300">⚡ Counter-Perspective / Critique:</span>
            <p className="text-white/80 leading-relaxed">{selectedEssay.counterNuance.critique}</p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-1.5">
            <span className="font-bold text-emerald-300">✨ Dialectical Synthesis:</span>
            <p className="text-white/80 leading-relaxed">{selectedEssay.counterNuance.reconciliation}</p>
          </div>
        </div>

        {/* 4. FORWARD-LOOKING CONCLUSION */}
        <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/10 p-5 space-y-2 text-xs">
          <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
            SECTION 4: FORWARD-LOOKING CONCLUSION (~150 Words)
          </span>
          <p className="text-white/90 leading-relaxed">
            {selectedEssay.forwardLookingConclusion.philosophicalSynthesis}
          </p>
          <div className="rounded-xl bg-black/40 p-3 text-cyan-200">
            <span className="font-bold text-cyan-300">🏛️ Constitutional & Civilizational Anchor: </span>
            {selectedEssay.forwardLookingConclusion.constitutionalAndGlobalAnchors}
          </div>
        </div>
      </div>
    </div>
  );
}
