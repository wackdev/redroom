"use client";

import { useEffect, useMemo, useState } from "react";

type Exam = "Prelims" | "Mains";

type Topic = {
  id: string;
  name: string;
  exam: Exam;
};

type Subject = {
  id: string;
  name: string;
  icon: string;
  topics: Topic[];
};

const STORAGE_KEY = "redroom_syllabus_progress";

/* =========================================================
   HELPER
========================================================= */

function makeTopics(
  subjectId: string,
  exam: Exam,
  names: string[]
): Topic[] {
  return names.map((name, index) => ({
    id: `${subjectId}-${exam.toLowerCase()}-${index + 1}`,
    name,
    exam,
  }));
}

/* =========================================================
   SYLLABUS DATA
========================================================= */

const syllabus: Subject[] = [
  {
    id: "polity",
    name: "Polity & Governance",
    icon: "🏛️",
    topics: [
      ...makeTopics("polity", "Prelims", [
        "Historical Background of the Constitution",
        "Making of the Constitution",
        "Salient Features of the Constitution",
        "Preamble",
        "Union and its Territory",
        "Citizenship",
        "Fundamental Rights",
        "Directive Principles of State Policy",
        "Fundamental Duties",
        "Constitutional Amendments",
        "Basic Structure Doctrine",
        "President",
        "Vice-President",
        "Prime Minister and Council of Ministers",
        "Parliament",
        "Parliamentary Committees",
        "Supreme Court",
        "High Courts",
        "Judicial Review and Judicial Activism",
        "Governor",
        "Chief Minister and State Council of Ministers",
        "State Legislature",
        "Centre-State Relations",
        "Inter-State Relations",
        "Emergency Provisions",
        "Constitutional Bodies",
        "Non-Constitutional Bodies",
        "Local Government",
        "Panchayati Raj",
        "Municipalities",
      ]),
    ],
  },

  {
    id: "history",
    name: "History",
    icon: "📜",
    topics: [
      ...makeTopics("history", "Prelims", [
        "Prehistoric India",
        "Indus Valley Civilization",
        "Vedic Age",
        "Mahajanapadas",
        "Buddhism",
        "Jainism",
        "Mauryan Empire",
        "Post-Mauryan India",
        "Gupta Empire",
        "Sangam Age",
        "Early Medieval India",
        "South Indian Kingdoms",
        "Delhi Sultanate",
        "Vijayanagara and Bahmani Kingdoms",
        "Mughal Empire",
        "Marathas",
        "Advent of Europeans",
        "British Expansion in India",
        "Economic Impact of British Rule",
        "Socio-Religious Reform Movements",
        "Revolt of 1857",
        "Indian National Congress",
        "Moderate and Extremist Phase",
        "Swadeshi Movement",
        "Gandhian Era",
        "Non-Cooperation Movement",
        "Civil Disobedience Movement",
        "Quit India Movement",
        "Revolutionary Movement",
        "Constitutional Developments and Independence",
      ]),
    ],
  },

  {
    id: "geography",
    name: "Geography",
    icon: "🌍",
    topics: [
      ...makeTopics("geography", "Prelims", [
        "Earth and Universe",
        "Latitude and Longitude",
        "Interior of the Earth",
        "Geomorphic Processes",
        "Rocks and Minerals",
        "Earthquakes",
        "Volcanoes",
        "Plate Tectonics",
        "Mountains and Plateaus",
        "Rivers and Drainage Systems",
        "Glaciers",
        "Oceans and Ocean Currents",
        "Atmosphere",
        "Temperature and Pressure",
        "Winds",
        "Monsoon",
        "Cyclones",
        "Jet Streams",
        "Climatic Regions",
        "Soils",
        "Natural Vegetation",
        "Agriculture",
        "World Resources",
        "Indian Physical Geography",
        "Indian Drainage",
        "Indian Climate",
        "Indian Soils",
        "Indian Agriculture",
      ]),
    ],
  },

  {
    id: "economy",
    name: "Indian Economy",
    icon: "💰",
    topics: [
      ...makeTopics("economy", "Prelims", [
        "Basic Concepts of Economics",
        "Micro Economics",
        "Demand and Supply",
        "Production and Cost",
        "Market Structures",
        "National Income Accounting",
        "GDP and GNP",
        "Economic Growth",
        "Economic Development",
        "Inclusive Growth",
        "Inflation",
        "Unemployment",
        "Poverty",
        "Banking System",
        "Reserve Bank of India",
        "Monetary Policy",
        "Money Market",
        "Capital Market",
        "Financial Markets",
        "Fiscal Policy",
        "Government Budget",
        "Taxation",
        "Public Finance",
        "Planning in India",
        "NITI Aayog",
        "Infrastructure",
        "Indian Industry",
        "Service Sector",
        "External Sector",
        "Balance of Payments",
      ]),
    ],
  },

  {
    id: "environment",
    name: "Environment & Ecology",
    icon: "🌱",
    topics: [
      ...makeTopics("environment", "Prelims", [
        "Ecology and Ecosystems",
        "Ecosystem Functions",
        "Ecosystem Services",
        "Food Chain and Food Web",
        "Biogeochemical Cycles",
        "Ecological Succession",
        "Biomes",
        "Terrestrial Ecosystems",
        "Aquatic Ecosystems",
        "Environmental Pollution",
        "Air Pollution",
        "Water Pollution",
        "Soil Pollution",
        "Noise Pollution",
        "Plastic Pollution",
        "Solid Waste Management",
        "Climate Change",
        "Global Warming",
        "Ocean Acidification",
        "Ozone Depletion",
        "Climate Change Mitigation",
        "Climate Change Adaptation",
        "International Environmental Conventions",
        "Biodiversity",
        "Biodiversity Hotspots",
        "Forests",
        "Indian Flora",
        "Indian Fauna",
        "Protected Areas",
        "Environmental Laws and Institutions",
      ]),
    ],
  },

  {
    id: "science",
    name: "Science & Technology",
    icon: "🔬",
    topics: [
      ...makeTopics("science", "Prelims", [
        "General Science",
        "Physics in Everyday Life",
        "Chemistry in Everyday Life",
        "Biology Basics",
        "Human Biology",
        "Genetics",
        "Biotechnology",
        "Genetic Engineering",
        "Stem Cell Technology",
        "CRISPR Technology",
        "Vaccines",
        "Diseases and Public Health",
        "Space Technology",
        "Indian Space Programme",
        "Satellites",
        "Launch Vehicles",
        "Defence Technology",
        "Nuclear Technology",
        "Renewable Energy Technology",
        "Artificial Intelligence",
        "Machine Learning",
        "Robotics",
        "Nanotechnology",
        "Quantum Technology",
        "Cyber Technology",
      ]),
    ],
  },

  {
    id: "society",
    name: "Indian Society",
    icon: "👥",
    topics: [
      ...makeTopics("society", "Mains", [
        "Salient Features of Indian Society",
        "Diversity of India",
        "Caste System",
        "Tribal Communities",
        "Women and Society",
        "Population Issues",
        "Urbanisation",
        "Migration",
        "Poverty and Social Issues",
        "Communalism",
        "Regionalism",
        "Secularism",
        "Globalisation and Indian Society",
        "Social Empowerment",
        "Role of Civil Society",
      ]),
    ],
  },

  {
    id: "international",
    name: "International Relations",
    icon: "🌐",
    topics: [
      ...makeTopics("international", "Mains", [
        "India and Neighbourhood",
        "India-China Relations",
        "India-Pakistan Relations",
        "India-Nepal Relations",
        "India-Bhutan Relations",
        "India-Bangladesh Relations",
        "India-Sri Lanka Relations",
        "India-Myanmar Relations",
        "India-USA Relations",
        "India-Russia Relations",
        "India-EU Relations",
        "India-Japan Relations",
        "India-Australia Relations",
        "India-Africa Relations",
        "International Organisations",
      ]),
    ],
  },

  {
    id: "ethics",
    name: "Ethics & Integrity",
    icon: "⚖️",
    topics: [
      ...makeTopics("ethics", "Mains", [
        "Ethics and Human Interface",
        "Human Values",
        "Attitude",
        "Aptitude and Foundational Values",
        "Emotional Intelligence",
        "Moral Thinkers and Philosophers",
        "Ethics in Public Administration",
        "Probity in Governance",
        "Transparency and Accountability",
        "RTI and Citizen Charter",
        "Case Studies",
        "Ethical Decision Making",
      ]),
    ],
  },
];

/* =========================================================
   COMPONENT
========================================================= */

export default function SyllabusPage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState<
    "All" | "Prelims" | "Mains"
  >("All");

  const [selectedSubject, setSelectedSubject] =
    useState<string>("all");

  const [loaded, setLoaded] = useState(false);

  /* ---------------------------------------------------------
     LOAD SAVED PROGRESS
  --------------------------------------------------------- */

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setCompleted(parsed);
          }
        }
      } catch (error) {
        console.error(
          "Failed to load syllabus progress:",
          error
        );
      } finally {
        setLoaded(true);
      }
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  /* ---------------------------------------------------------
     SAVE PROGRESS
  --------------------------------------------------------- */

  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(completed)
      );
    } catch (error) {
      console.error(
        "Failed to save syllabus progress:",
        error
      );
    }
  }, [completed, loaded]);

  /* ---------------------------------------------------------
     ALL TOPICS
  --------------------------------------------------------- */

  const allTopics = useMemo(() => {
    return syllabus.flatMap((subject) => subject.topics);
  }, []);

  /* ---------------------------------------------------------
     OVERALL PROGRESS
  --------------------------------------------------------- */

  const overallCompleted = completed.length;

  const overallTotal = allTopics.length;

  const overallPercent =
    overallTotal === 0
      ? 0
      : Math.round(
          (overallCompleted / overallTotal) * 100
        );

  /* ---------------------------------------------------------
     TOGGLE TOPIC
  --------------------------------------------------------- */

  function toggleTopic(topicId: string) {
    setCompleted((previous) => {
      if (previous.includes(topicId)) {
        return previous.filter((id) => id !== topicId);
      }

      return [...previous, topicId];
    });
  }

  /* ---------------------------------------------------------
     RESET
  --------------------------------------------------------- */

  function resetProgress() {
    const confirmed = window.confirm(
      "Are you sure you want to reset all syllabus progress?"
    );

    if (!confirmed) return;

    setCompleted([]);

    localStorage.removeItem(STORAGE_KEY);
  }

  /* ---------------------------------------------------------
     FILTER SUBJECTS
  --------------------------------------------------------- */

  const visibleSubjects = useMemo(() => {
    return syllabus
      .filter((subject) => {
        if (selectedSubject === "all") {
          return true;
        }

        return subject.id === selectedSubject;
      })
      .map((subject) => {
        const topics = subject.topics.filter((topic) => {
          const matchesExam =
            examFilter === "All" ||
            topic.exam === examFilter;

          const matchesSearch =
            topic.name
              .toLowerCase()
              .includes(search.toLowerCase());

          return matchesExam && matchesSearch;
        });

        return {
          ...subject,
          topics,
        };
      })
      .filter((subject) => subject.topics.length > 0);
  }, [
    selectedSubject,
    examFilter,
    search,
  ]);

  /* ---------------------------------------------------------
     SUBJECT PROGRESS
  --------------------------------------------------------- */

  function getSubjectProgress(subject: Subject) {
    const total = subject.topics.length;

    const done = subject.topics.filter((topic) =>
      completed.includes(topic.id)
    ).length;

    const percent =
      total === 0
        ? 0
        : Math.round((done / total) * 100);

    return {
      done,
      total,
      percent,
    };
  }

  /* ---------------------------------------------------------
     UI
  --------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-[#090909] text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">

        {/* BACK */}
        <a
          href="/dashboard"
          className="inline-flex mb-8 text-sm text-white/70 hover:text-white transition"
        >
          ← Back to Dashboard
        </a>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <p className="text-sm font-bold tracking-wide text-pink-400 uppercase">
              UPSC Syllabus Tracker
            </p>

            <h1 className="mt-2 text-5xl font-black tracking-tight">
              Syllabus
            </h1>

            <p className="mt-3 max-w-2xl text-white/60">
              Track your complete UPSC preparation topic by
              topic. Your progress is automatically saved.
            </p>
          </div>

          <button
            onClick={resetProgress}
            className="rounded-xl border border-pink-400/30 bg-pink-500/10 px-5 py-3 text-sm font-bold text-pink-300 hover:bg-pink-500/20 transition"
          >
            Reset Progress
          </button>
        </div>

        {/* OVERALL PROGRESS */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-700 via-purple-700 to-violet-700 p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white/70">
                Overall Syllabus Progress
              </p>

              <p className="mt-1 text-4xl font-black">
                {overallPercent}%
              </p>
            </div>

            <p className="text-sm font-semibold text-white/80">
              {overallCompleted} / {overallTotal} topics completed
            </p>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full rounded-full bg-pink-400 transition-all duration-500"
              style={{
                width: `${overallPercent}%`,
              }}
            />
          </div>
        </section>

        {/* SUBJECT CARDS */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Subjects
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9">
            <button
              onClick={() => setSelectedSubject("all")}
              className={`rounded-2xl border p-4 text-left transition ${
                selectedSubject === "all"
                  ? "border-pink-400 bg-purple-700/50"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="text-2xl">📚</div>

              <p className="mt-3 font-bold">
                All Subjects
              </p>

              <p className="mt-1 text-xs text-white/60">
                {overallCompleted}/{overallTotal}
              </p>
            </button>

            {syllabus.map((subject) => {
              const progress =
                getSubjectProgress(subject);

              return (
                <button
                  key={subject.id}
                  onClick={() =>
                    setSelectedSubject(subject.id)
                  }
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedSubject === subject.id
                      ? "border-pink-400 bg-purple-700/50"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="text-2xl">
                    {subject.icon}
                  </div>

                  <p className="mt-3 font-bold truncate">
                    {subject.name}
                  </p>

                  <p className="mt-1 text-xs text-white/60">
                    {progress.done}/{progress.total}
                  </p>

                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-pink-400 transition-all"
                      style={{
                        width: `${progress.percent}%`,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* FILTERS */}
        <section className="mt-8 flex flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search syllabus topics..."
            className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-pink-400"
          />

          <select
            value={examFilter}
            onChange={(event) =>
              setExamFilter(
                event.target.value as
                  | "All"
                  | "Prelims"
                  | "Mains"
              )
            }
            className="rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-sm text-white outline-none focus:border-pink-400"
          >
            <option value="All">
              All Exams
            </option>

            <option value="Prelims">
              Prelims
            </option>

            <option value="Mains">
              Mains
            </option>
          </select>
        </section>

        {/* TOPICS */}
        <section className="mt-8 space-y-6">
          {visibleSubjects.map((subject) => {
            const progress =
              getSubjectProgress(subject);

            return (
              <div
                key={subject.id}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
              >
                {/* SUBJECT HEADER */}
                <div className="border-b border-white/10 bg-gradient-to-r from-purple-900/50 to-indigo-900/30 p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600/30 text-2xl">
                        {subject.icon}
                      </div>

                      <div>
                        <h3 className="text-xl font-black">
                          {subject.name}
                        </h3>

                        <p className="text-sm text-white/50">
                          {progress.done} of{" "}
                          {progress.total} completed
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-48">
                      <div className="mb-2 flex justify-between text-xs text-white/50">
                        <span>Progress</span>
                        <span>
                          {progress.percent}%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-pink-400 transition-all"
                          style={{
                            width: `${progress.percent}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* TOPIC LIST */}
                <div className="divide-y divide-white/5">
                  {subject.topics.map(
                    (topic, index) => {
                      const isCompleted =
                        completed.includes(topic.id);

                      return (
                        <button
                          key={topic.id}
                          onClick={() =>
                            toggleTopic(topic.id)
                          }
                          className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition"
                        >
                          {/* CHECKBOX */}
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition ${
                              isCompleted
                                ? "border-pink-400 bg-pink-500 text-white"
                                : "border-white/20 bg-white/5"
                            }`}
                          >
                            {isCompleted && (
                              <span className="text-sm font-black">
                                ✓
                              </span>
                            )}
                          </div>

                          {/* NUMBER */}
                          <span className="w-8 shrink-0 text-sm text-white/30">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                          {/* NAME */}
                          <div className="min-w-0 flex-1">
                            <p
                              className={`font-semibold ${
                                isCompleted
                                  ? "text-white/40 line-through"
                                  : "text-white"
                              }`}
                            >
                              {topic.name}
                            </p>

                            <span className="mt-1 inline-block text-[10px] font-bold uppercase tracking-wider text-white/30">
                              {topic.exam}
                            </span>
                          </div>

                          {/* STATUS */}
                          <span
                            className={`hidden sm:block text-xs font-bold ${
                              isCompleted
                                ? "text-pink-400"
                                : "text-white/30"
                            }`}
                          >
                            {isCompleted
                              ? "Completed"
                              : "Pending"}
                          </span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {/* EMPTY */}
        {visibleSubjects.length === 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-xl font-bold">
              No topics found
            </p>

            <p className="mt-2 text-sm text-white/50">
              Try changing your search or exam filter.
            </p>
          </div>
        )}

        {/* FOOTER STATS */}
        <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Total Topics
            </p>

            <p className="mt-2 text-3xl font-black">
              {overallTotal}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Completed
            </p>

            <p className="mt-2 text-3xl font-black text-pink-400">
              {overallCompleted}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-white/50">
              Remaining
            </p>

            <p className="mt-2 text-3xl font-black">
              {overallTotal - overallCompleted}
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
