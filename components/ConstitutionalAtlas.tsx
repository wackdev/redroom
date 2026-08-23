"use client";

import { useMemo, useState } from "react";
import { sound } from "@/lib/audio/sound-engine";

interface ConstitutionalEntry {
  article: string;
  part: string;
  subject: string;
  keyProvision: string;
  mainsRelevance: string;
  landmarkCases?: string[];
}

interface LandmarkCaseEntry {
  caseName: string;
  year: number;
  doctrine: string;
  bench: string;
  ratioDecidendi: string;
  articlesInvolved: string[];
}

const CONSTITUTIONAL_ARTICLES: ConstitutionalEntry[] = [
  {
    article: "Article 13",
    part: "Part III (Fundamental Rights)",
    subject: "Laws Inconsistent with Fundamental Rights",
    keyProvision: "All laws in force declared void to the extent of their inconsistency with Fundamental Rights. Includes the Doctrine of Judicial Review.",
    mainsRelevance: "Shield against arbitrary legislative & executive action; foundation for basic structure review.",
    landmarkCases: ["Shankari Prasad (1951)", "Golaknath (1967)", "Kesavananda Bharati (1973)"],
  },
  {
    article: "Article 14",
    part: "Part III (Fundamental Rights)",
    subject: "Equality Before Law & Equal Protection of Laws",
    keyProvision: "Prohibits discrimination; non-arbitrariness doctrine (E.P. Royappa); reasonable classification test.",
    mainsRelevance: "Administrative fairness, anti-corruption, policy equality.",
    landmarkCases: ["E.P. Royappa (1974)", "Maneka Gandhi (1978)", "Shayara Bano (2017)"],
  },
  {
    article: "Article 19",
    part: "Part III (Fundamental Rights)",
    subject: "Six Democratic Freedoms & Reasonable Restrictions",
    keyProvision: "Speech, assembly, association, movement, residence, and profession subject to Article 19(2)-(6) restrictions.",
    mainsRelevance: "Press freedom, right to protest, digital expression vs national security and public order.",
    landmarkCases: ["Romesh Thappar (1950)", "Shreya Singhal (2015)", "Anuradha Bhasin (2020)"],
  },
  {
    article: "Article 21",
    part: "Part III (Fundamental Rights)",
    subject: "Protection of Life & Personal Liberty",
    keyProvision: "No person shall be deprived of life or personal liberty except according to procedure established by law (expanded to Due Process).",
    mainsRelevance: "Right to privacy, clean environment, dignified life, speedy trial, health.",
    landmarkCases: ["A.K. Gopalan (1950)", "Maneka Gandhi (1978)", "K.S. Puttaswamy (2017)"],
  },
  {
    article: "Article 32",
    part: "Part III (Fundamental Rights)",
    subject: "Right to Constitutional Remedies",
    keyProvision: "Empowers Supreme Court to issue writs (Habeas Corpus, Mandamus, Prohibition, Quo Warranto, Certiorari) for FR enforcement.",
    mainsRelevance: "Dr. B.R. Ambedkar's 'Heart and Soul of the Constitution'; Public Interest Litigation (PIL).",
    landmarkCases: ["Bandhua Mukti Morcha (1984)", "SP Gupta (1981)"],
  },
  {
    article: "Article 44",
    part: "Part IV (Directive Principles)",
    subject: "Uniform Civil Code (UCC)",
    keyProvision: "The State shall endeavour to secure for the citizens a Uniform Civil Code throughout the territory of India.",
    mainsRelevance: "Gender justice, secular jurisprudence, personal law reforms vs religious autonomy.",
    landmarkCases: ["Shah Bano (1985)", "Sarla Mudgal (1995)", "Shayara Bano (2017)"],
  },
  {
    article: "Article 142",
    part: "Part V (The Union Judiciary)",
    subject: "Complete Justice Powers of Supreme Court",
    keyProvision: "The Supreme Court may pass such decree or make such order as is necessary for doing complete justice in any cause or matter.",
    mainsRelevance: "Judicial activism, environmental orders, Ayodhya dispute resolution, consumer relief.",
    landmarkCases: ["Union Carbide (1991)", "Ayodhya Title Dispute (2019)"],
  },
  {
    article: "Article 356",
    part: "Part XVIII (Emergency Provisions)",
    subject: "President's Rule (Failure of Constitutional Machinery)",
    keyProvision: "Allows President on Governor's report or otherwise to assume state executive and legislative functions.",
    mainsRelevance: "Cooperative federalism vs executive centralism; limits on gubernatorial discretion.",
    landmarkCases: ["S.R. Bommai v. Union of India (1994)"],
  },
  {
    article: "Article 368",
    part: "Part XX (Amendment of the Constitution)",
    subject: "Power of Parliament to Amend the Constitution",
    keyProvision: "Parliament may amend by way of addition, variation or repeal any provision according to the prescribed procedure.",
    mainsRelevance: "Constituent vs Legislative power; Basic Structure Doctrine as a substantive limit.",
    landmarkCases: ["Kesavananda Bharati (1973)", "Minerva Mills (1980)", "I.R. Coelho (2007)"],
  },
];

const LANDMARK_JUDGEMENTS: LandmarkCaseEntry[] = [
  {
    caseName: "Kesavananda Bharati v. State of Kerala",
    year: 1973,
    doctrine: "Basic Structure Doctrine",
    bench: "13-Judge Constitution Bench (7:6 Majority)",
    ratioDecidendi: "Parliament's amending power under Article 368 is not unlimited. It cannot damage or emasculate the foundational pillars and basic structure of the Constitution.",
    articlesInvolved: ["Article 13", "Article 368", "Part III"],
  },
  {
    caseName: "Maneka Gandhi v. Union of India",
    year: 1978,
    doctrine: "Substantive Due Process & Golden Triangle (Arts 14, 19, 21)",
    bench: "7-Judge Bench",
    ratioDecidendi: "The procedure under Article 21 must be 'just, fair, and reasonable', not arbitrary. Articles 14, 19, and 21 form an interconnected Golden Triangle.",
    articlesInvolved: ["Article 14", "Article 19", "Article 21"],
  },
  {
    caseName: "Justice K.S. Puttaswamy (Retd.) v. Union of India",
    year: 2017,
    doctrine: "Fundamental Right to Privacy",
    bench: "9-Judge Unanimous Constitution Bench",
    ratioDecidendi: "Privacy is a fundamental right emanating from Article 21 and the right to dignity, subject to the 3-fold proportionality test (Legitimate Aim, Suitability, Necessity).",
    articlesInvolved: ["Article 21", "Article 14", "Article 19"],
  },
  {
    caseName: "S.R. Bommai v. Union of India",
    year: 1994,
    doctrine: "Federalism & Secularism as Basic Structure; Judicial Review of Art 356",
    bench: "9-Judge Bench",
    ratioDecidendi: "Secularism and Federalism are essential features of the Basic Structure. Proclamations under Article 356 are subject to judicial review; floor test is mandatory.",
    articlesInvolved: ["Article 356", "Article 163", "Preamble"],
  },
];

export default function ConstitutionalAtlas() {
  const [activeTab, setActiveTab] = useState<"articles" | "judgements">("articles");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    return CONSTITUTIONAL_ARTICLES.filter(
      (a) =>
        a.article.toLowerCase().includes(search.toLowerCase()) ||
        a.subject.toLowerCase().includes(search.toLowerCase()) ||
        a.keyProvision.toLowerCase().includes(search.toLowerCase()) ||
        a.mainsRelevance.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredCases = useMemo(() => {
    return LANDMARK_JUDGEMENTS.filter(
      (c) =>
        c.caseName.toLowerCase().includes(search.toLowerCase()) ||
        c.doctrine.toLowerCase().includes(search.toLowerCase()) ||
        c.ratioDecidendi.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sound.playHover();
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#D8A63A] animate-pulse" />
            <span className="font-mono text-[10px] font-black uppercase tracking-widest text-[#D8A63A]">
              POLITY ATLAS // CONSTITUTIONAL JURISPRUDENCE
            </span>
          </div>
          <h2 className="mt-1 font-mono text-lg font-bold text-white">
            Constitutional Articles & Landmark Judgements Atlas
          </h2>
          <p className="text-xs text-[#8C8C8C]">
            Instant access to high-yield articles and landmark Supreme Court ratios for GS-2 and Essay value-addition.
          </p>
        </div>

        {/* Search Bar */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Articles, Doctrines, Cases..."
          className="rounded-xl border border-white/10 bg-black/60 px-3.5 py-2 font-mono text-xs text-white placeholder-white/40 focus:border-[#D8A63A] focus:outline-none w-full sm:w-64"
        />
      </div>

      {/* Tab Switcher */}
      <div className="mt-5 flex gap-2 border-b border-white/10 pb-3 font-mono text-xs">
        <button
          onClick={() => {
            setActiveTab("articles");
            sound.playHover();
          }}
          className={`rounded-xl px-4 py-2 font-bold transition ${
            activeTab === "articles"
              ? "bg-[#D8A63A] text-black shadow-lg"
              : "bg-white/5 text-[#8C8C8C] hover:text-white"
          }`}
        >
          📜 Constitutional Articles ({filteredArticles.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("judgements");
            sound.playHover();
          }}
          className={`rounded-xl px-4 py-2 font-bold transition ${
            activeTab === "judgements"
              ? "bg-[#D8A63A] text-black shadow-lg"
              : "bg-white/5 text-[#8C8C8C] hover:text-white"
          }`}
        >
          ⚖️ Landmark Judgements ({filteredCases.length})
        </button>
      </div>

      {/* Content Grid */}
      <div className="mt-6 space-y-4">
        {activeTab === "articles" ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredArticles.map((art) => (
              <div
                key={art.article}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-[#D8A63A]/40"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-xs font-black text-[#F4C95D]">
                      {art.article}
                    </span>
                    <span className="font-mono text-[10px] text-[#8C8C8C]">{art.part}</span>
                  </div>

                  <h3 className="mt-2 font-bold text-sm text-white">{art.subject}</h3>
                  <p className="mt-1 text-xs text-white/70 leading-relaxed font-sans">
                    {art.keyProvision}
                  </p>

                  <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-[11px] font-sans">
                    <strong className="text-emerald-400 block mb-0.5">🎯 Mains Value Addition:</strong>
                    <span className="text-white/80">{art.mainsRelevance}</span>
                  </div>
                </div>

                {/* Footer Citation Copy */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex flex-wrap gap-1">
                    {art.landmarkCases?.map((c, idx) => (
                      <span key={idx} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-[#8C8C8C]">
                        {c}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      handleCopyCitation(
                        `${art.article} (${art.subject}): ${art.keyProvision}`,
                        art.article
                      )
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold text-[#F4C95D] hover:border-[#D8A63A] transition"
                  >
                    {copiedId === art.article ? "✓ Copied" : "📋 Copy Citation"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredCases.map((jc) => (
              <div
                key={jc.caseName}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/40 p-5 transition hover:border-[#D8A63A]/40"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-mono text-xs font-black text-[#F4C95D]">
                      {jc.caseName} ({jc.year})
                    </span>
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-300">
                      {jc.doctrine}
                    </span>
                  </div>

                  <p className="mt-2 font-mono text-[10px] text-[#8C8C8C]">
                    🏛️ Bench: <strong>{jc.bench}</strong>
                  </p>

                  <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-white/90 leading-relaxed font-sans">
                    <strong className="text-pink-300 block mb-1">⚖️ Ratio Decidendi:</strong>
                    {jc.ratioDecidendi}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex gap-1.5 font-mono text-[10px] text-white/50">
                    {jc.articlesInvolved.map((art, idx) => (
                      <span key={idx} className="rounded bg-black/60 px-2 py-0.5 text-amber-200">
                        {art}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      handleCopyCitation(
                        `${jc.caseName} (${jc.year}): ${jc.ratioDecidendi}`,
                        jc.caseName
                      )
                    }
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[10px] font-bold text-[#F4C95D] hover:border-[#D8A63A] transition"
                  >
                    {copiedId === jc.caseName ? "✓ Copied" : "📋 Copy Citation"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
