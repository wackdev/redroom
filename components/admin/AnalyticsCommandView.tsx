"use client";

const FUNNEL_DATA = [
  { stage: "VISITORS", count: 14200, rate: "100%" },
  { stage: "SIGN UPS", count: 3840, rate: "27.0%" },
  { stage: "ONBOARDING", count: 3120, rate: "81.2%" },
  { stage: "FIRST STUDY SESSION", count: 2890, rate: "92.6%" },
  { stage: "RETURNING CADETS", count: 2140, rate: "74.0%" },
];

const RETENTION_COHORTS = [
  { cohort: "Day 1", retention: 78.4 },
  { cohort: "Day 7", retention: 64.2 },
  { cohort: "Day 14", retention: 56.1 },
  { cohort: "Day 30", retention: 48.0 },
  { cohort: "Day 60", retention: 42.5 },
  { cohort: "Day 90", retention: 38.2 },
];

const FEATURE_ADOPTION = [
  { feature: "PYQ Command Centre", percent: 82, color: "#D8A63A" },
  { feature: "Spaced Revision Engine", percent: 64, color: "#E5B94E" },
  { feature: "Mock Test Simulations", percent: 48, color: "#F4C95D" },
  { feature: "Mains Answer Writing Studio", percent: 37, color: "#10B981" },
  { feature: "Chill Zone Arcade Lounge", percent: 29, color: "#8B5CF6" },
  { feature: "DAF Voice Viva Lab", percent: 18, color: "#3B82F6" },
];

const TROUBLESOME_QUESTIONS = [
  {
    id: "Q-POL-04",
    topic: "Governor's Discretion under Art 163",
    subject: "Polity",
    failRate: "62.4%",
    issue: "Frequent ambiguity on Shamsher Singh precedent",
  },
  {
    id: "Q-ENV-12",
    topic: "CRZ Rules Coastal Clearances",
    subject: "Environment",
    failRate: "58.1%",
    issue: "Candidates confused on 2019 vs 2011 amendments",
  },
  {
    id: "Q-HIS-18",
    topic: "Cabinet Mission Plan 1946 Grouping",
    subject: "History",
    failRate: "54.8%",
    issue: "Need clearer timeline infographic on Section A/B/C",
  },
];

export default function AnalyticsCommandView() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-[#090909] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <span className="font-mono text-[10px] font-black tracking-widest text-[#F4C95D] uppercase">
            GROWTH & COHORT TELEMETRY
          </span>
          <h2 className="mt-1 font-mono text-2xl font-black text-white uppercase">
            PLATFORM ANALYTICS & FUNNEL
          </h2>
          <p className="mt-1 text-xs text-[#8C8C8C]">
            Inspect cadet retention curves, feature adoption weights, and identify questions needing improved explanations.
          </p>
        </div>
      </div>

      {/* Real-Time User Conversion Funnel */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs">
        <h3 className="font-black text-[#D8A63A] uppercase tracking-wider mb-4">
          ASPIRANT CONVERSION FUNNEL
        </h3>
        <div className="space-y-3">
          {FUNNEL_DATA.map((item, idx) => (
            <div key={item.stage} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">
                  {idx + 1}. {item.stage}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-white">{item.count.toLocaleString()}</span>
                  <span className="text-[#F4C95D] font-black">({item.rate})</span>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#D8A63A] to-[#F4C95D]"
                  style={{ width: `${(item.count / 14200) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Feature Adoption & Retention Cohorts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Feature Adoption */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-4">
          <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
            FEATURE ENGAGEMENT RATIOS
          </h3>
          <div className="space-y-3">
            {FEATURE_ADOPTION.map((f) => (
              <div key={f.feature} className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-white">{f.feature}</span>
                  <span className="text-[#F4C95D] font-bold">{f.percent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${f.percent}%`, backgroundColor: f.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Cohorts */}
        <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-4">
          <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
            CADET RETENTION COHORTS
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RETENTION_COHORTS.map((c) => (
              <div key={c.cohort} className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <span className="text-[10px] text-[#8C8C8C] uppercase">{c.cohort}</span>
                <span className="mt-1 text-2xl font-black text-emerald-400">{c.retention}%</span>
                <span className="text-[9px] text-[#8C8C8C] mt-1">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Quality Control / Question Diagnostics */}
      <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-6 font-mono text-xs space-y-3">
        <h3 className="font-black text-[#D8A63A] uppercase tracking-wider">
          CONTENT THAT NEEDS BETTER EXPLANATION (HIGH ERROR RATE)
        </h3>
        <p className="text-[11px] text-[#8C8C8C]">
          Identified based on cadet attempt error spikes and repeated elimination trap triggers:
        </p>
        <div className="space-y-2">
          {TROUBLESOME_QUESTIONS.map((q) => (
            <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-amber-500/20 bg-amber-950/10 p-3.5 rounded-2xl gap-2">
              <div>
                <span className="text-[10px] text-[#F4C95D] font-bold">[{q.id}] {q.subject} // {q.topic}</span>
                <p className="text-white font-bold text-xs mt-0.5">{q.issue}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-red-400 font-black">FAIL RATE: {q.failRate}</span>
                <button className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white hover:border-[#D8A63A]">
                  ENHANCE HINT →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
