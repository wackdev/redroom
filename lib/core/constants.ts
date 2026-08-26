/**
 * REDROOM Core Constants & Configurations
 */

export const UPSC_SUBJECTS = [
  "Polity",
  "History",
  "Geography",
  "Economy",
  "Environment",
  "Science & Technology",
  "International Relations",
  "Ethics & Integrity",
  "Indian Society",
  "CSAT",
  "Current Affairs",
] as const;

export type UPSCSubject = (typeof UPSC_SUBJECTS)[number];

export const GS_PAPERS = [
  "GS-1",
  "GS-2",
  "GS-3",
  "GS-4",
  "Essay",
  "CSAT",
  "Optional",
] as const;

export const SUBJECT_TO_GS_PAPER: Record<string, string> = {
  History: "GS-1",
  Geography: "GS-1",
  "Indian Society": "GS-1",
  Polity: "GS-2",
  Governance: "GS-2",
  "International Relations": "GS-2",
  Economy: "GS-3",
  Environment: "GS-3",
  "Science & Technology": "GS-3",
  "Internal Security": "GS-3",
  "Disaster Management": "GS-3",
  "Ethics & Integrity": "GS-4",
};

export const SUBJECT_ICONS: Record<string, string> = {
  Polity: "🏛️",
  History: "📜",
  Geography: "🌍",
  Economy: "💰",
  Environment: "🌱",
  "Science & Technology": "🔬",
  "International Relations": "🌐",
  "Ethics & Integrity": "⚖️",
  "Indian Society": "👥",
  CSAT: "📐",
  "Current Affairs": "📰",
  Revision: "🔄",
};

export const DEFAULT_AI_MODELS = [
  {
    id: "moon-primary",
    name: "Qwen 2.5 72B / DeepSeek V3",
    provider: "moon" as const,
    modelParam: "Qwen/Qwen2.5-72B-Instruct",
    isPreferred: true,
  },
  {
    id: "hf-llama",
    name: "Llama 3.3 70B Instruct",
    provider: "huggingface" as const,
    modelParam: "meta-llama/Llama-3.3-70B-Instruct",
    isPreferred: false,
  },
  {
    id: "hf-mistral",
    name: "Mistral Small 24B",
    provider: "huggingface" as const,
    modelParam: "mistralai/Mistral-Small-24B-Instruct-2501",
    isPreferred: false,
  },
  {
    id: "hf-qwen-coder",
    name: "Qwen 2.5 7B Instruct",
    provider: "huggingface" as const,
    modelParam: "Qwen/Qwen2.5-7B-Instruct",
    isPreferred: false,
  },
];

export interface AppRoute {
  path: string;
  label: string;
  icon: string;
  description: string;
  sector: "core" | "prelims" | "mains" | "routine" | "peer" | "system";
  badge?: string;
}

export const APP_ROUTES: AppRoute[] = [
  // 1. Core Routine & Tactical HUD
  { path: "/dashboard", label: "Command Centre", icon: "⚡", description: "Central tactical HUD, priority missions & readiness radar.", sector: "core", badge: "OS HUB" },
  { path: "/knowledge", label: "Universal Knowledge Vault", icon: "🏛️", description: "One Topic • All Sources • 38+ Subjects • Connected Knowledge Graph & Source Notes.", sector: "routine", badge: "KNOWLEDGE" },
  { path: "/syllabus", label: "Syllabus Matrix", icon: "📚", description: "GS-1 to GS-4 micro-topic tracker with yield analysis & PYQ cross-links.", sector: "routine", badge: "MATRIX" },
  { path: "/current-affairs", label: "Current Affairs & Editorials", icon: "📰", description: "The Hindu & Indian Express editorial digests, audio briefs & live news quizzes.", sector: "routine", badge: "DAILY" },
  { path: "/study-plan", label: "Study Plan & Sanctuary", icon: "📅", description: "Dynamic daily schedule, Pomodoro sprints & active study tracker.", sector: "routine", badge: "ROUTINE" },
  { path: "/notes", label: "Notes & Mindmaps", icon: "✍️", description: "Offline notes vault, Markdown editor & Graph mindmap canvas.", sector: "routine", badge: "NOTES" },

  // 2. Prelims Sector
  { path: "/pyqs", label: "Prelims PYQ Arena", icon: "📝", description: "30-Year UPSC Question Archive with trap diagnostics & elimination radar.", sector: "prelims", badge: "PRELIMS" },
  { path: "/tests", label: "Mock Test Series", icon: "🎯", description: "Subject-wise multi-statement test series with elimination techniques.", sector: "prelims", badge: "TESTS" },
  { path: "/csat", label: "CSAT Logic & Math Lab", icon: "📐", description: "Speed Math trainer, Syllogisms Venn Studio & Formula Blitz drawer.", sector: "prelims", badge: "CSAT" },
  { path: "/performance", label: "Performance & Mistake Diagnostics", icon: "📊", description: "6-Axis GS Radar, Mistake Anatomy Lab, Cut-off Comparator & Trend Forecaster.", sector: "prelims", badge: "RADAR" },
  { path: "/3d-zone", label: "3D Simulation Zone", icon: "🌌", description: "10 Interactive 3D Visual Labs: Geography Globe, History Tunnel & Constitutional Atlas.", sector: "prelims", badge: "3D LABS" },

  // 3. Mains Sector
  { path: "/mains-pyqs", label: "Mains PYQ & Model Copies", icon: "🏛️", description: "Topper Model Copies, PESTLE Frameworks & multi-dimensional answer blueprints.", sector: "mains", badge: "MAINS PYQ" },
  { path: "/mains-writing", label: "Mains Speed Lab & QCAB", icon: "⏱️", description: "Timed 10 & 15-marker answer lab with real-time WPM, diagram studio & QCAB sheets.", sector: "mains", badge: "SPEED LAB" },
  { path: "/answer-lab", label: "Answer Writing Speed Lab", icon: "✍️", description: "Live WPM counter, target word pacing & model outline benchmarks.", sector: "mains", badge: "ANSWER LAB" },
  { path: "/essay", label: "Essay Studio & Lab", icon: "🖋️", description: "250-mark UPSC Essay frameworks, thesis hooks & AI multi-dimensional grading.", sector: "mains", badge: "ESSAY" },
  { path: "/ethics", label: "Ethics & Dilemma Simulator", icon: "⚖️", description: "GS-4 Case Studies, stakeholder mapping, ethical dilemmas & Nolan principles.", sector: "mains", badge: "ETHICS" },
  { path: "/optional", label: "500-Mark Optional Hub", icon: "🏛️", description: "25 Optional subjects catalogue, Paper 1 & 2 breakdown & Topper blueprints.", sector: "mains", badge: "OPTIONAL" },

  // 4. Recall & Community Sanctuary
  { path: "/revision", label: "SM-2 Spaced Revision", icon: "🔄", description: "Spaced repetition flashcards & forgetting curve memory drills.", sector: "routine", badge: "SM-2 MEMORY" },
  { path: "/study-room", label: "Virtual Peer Study Sanctuary", icon: "👥", description: "24/7 Peer accountability study halls with synchronized Pomodoro & ambient sound.", sector: "peer", badge: "PEER HALL" },
  { path: "/voice-notes", label: "Voice Notes & Audio Studio", icon: "🎙️", description: "AI speech-to-text dictation for rapid revision and walk-and-learn study.", sector: "routine", badge: "AUDIO" },
  { path: "/leaderboard", label: "National Cadet Leaderboard", icon: "🏆", description: "All-India cadet rankings, XP badges, streaks, and peer comparison.", sector: "peer", badge: "RANKINGS" },

  // 5. Personality & Mentorship
  { path: "/interview", label: "Personality Test Simulator", icon: "🎙️", description: "DAF Profiler & 5-Member Board Room Viva audio simulator.", sector: "peer", badge: "INTERVIEW" },
  { path: "/chill-zone", label: "Cognitive Arcade", icon: "🎮", description: "6 Cognitive reaction games, spatial puzzles & Cadet Leaderboard.", sector: "system", badge: "ARCADE" },
  { path: "/assistant", label: "AI Strategic Mentor", icon: "🤖", description: "Direct conversational AI mentor for strategy, answers & doubt clearance.", sector: "system", badge: "AI MENTOR" },

  // 6. System & Management
  { path: "/profile", label: "Cadet Dossier & DAF", icon: "👤", description: "Cadet DAF details, optional subject, target year & rank telemetry.", sector: "system", badge: "DOSSIER" },
  { path: "/settings", label: "System Preferences", icon: "⚙️", description: "Audio synthesis toggles, AI model selection & offline sync.", sector: "system", badge: "CONFIG" },
  { path: "/notifications", label: "Notification Center", icon: "🔔", description: "Spaced repetition alerts, streak reminders & Telegram dispatches.", sector: "system", badge: "ALERTS" },
  { path: "/admin", label: "Admin & Telemetry Hub", icon: "👑", description: "Live cadet telemetry, Telegram broadcast dispatch & DB health monitor.", sector: "system", badge: "ADMIN" },
];

