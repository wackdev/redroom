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

export const APP_ROUTES = [
  // 1. Core Routine & Intelligence
  { path: "/dashboard", label: "Command Centre", icon: "⚡", description: "Central tactical HUD, priority missions & readiness radar." },
  { path: "/knowledge", label: "Universal Knowledge Vault", icon: "🏛️", description: "One Topic • All Sources • 38+ Subjects • Connected Knowledge Graph & Source Notes." },
  { path: "/syllabus", label: "Syllabus Matrix", icon: "📚", description: "GS-1 to GS-4 micro-topic tracker with yield analysis & PYQ cross-links." },
  { path: "/current-affairs", label: "Current Affairs & Editorials", icon: "📰", description: "The Hindu & Indian Express editorial digests, audio briefs & live news quizzes." },
  { path: "/study-plan", label: "Study Plan & Sanctuary", icon: "📅", description: "Dynamic daily schedule, Pomodoro sprints & active study tracker." },
  { path: "/notes", label: "Notes & Mindmaps", icon: "✍️", description: "Offline notes vault, Markdown editor & Graph mindmap canvas." },

  // 2. Prelims Sector
  { path: "/pyqs", label: "Prelims PYQ Arena", icon: "📝", description: "30-Year UPSC Question Archive with trap diagnostics & elimination radar." },
  { path: "/tests", label: "Mock Test Series", icon: "🎯", description: "Subject-wise multi-statement test series with elimination techniques." },
  { path: "/csat", label: "CSAT Logic & Math Lab", icon: "📐", description: "Speed Math trainer, Syllogisms Venn Studio & Formula Blitz drawer." },
  { path: "/performance", label: "Performance & Mistake Diagnostics", icon: "📊", description: "6-Axis GS Radar, Mistake Anatomy Lab, Cut-off Comparator & Trend Forecaster." },
  { path: "/3d-zone", label: "3D Simulation Zone", icon: "🌌", description: "10 Interactive 3D Visual Labs: Geography Globe, History Tunnel & Constitutional Atlas." },

  // 3. Mains Sector
  { path: "/mains-pyqs", label: "Mains PYQ & Model Copies", icon: "🏛️", description: "Topper Model Copies, PESTLE Frameworks & multi-dimensional answer blueprints." },
  { path: "/mains-writing", label: "Mains Speed Lab & QCAB", icon: "⏱️", description: "Timed 10 & 15-marker answer lab with real-time WPM, diagram studio & QCAB sheets." },
  { path: "/essay", label: "Essay Studio & Lab", icon: "🖋️", description: "250-mark UPSC Essay frameworks, thesis hooks & AI multi-dimensional grading." },
  { path: "/ethics", label: "Ethics & Dilemma Simulator", icon: "⚖️", description: "GS-4 Case Studies, stakeholder mapping, ethical dilemmas & Nolan principles." },
  { path: "/optional", label: "500-Mark Optional Hub", icon: "🏛️", description: "25 Optional subjects catalogue, Paper 1 & 2 breakdown & Topper blueprints." },

  // 4. Recall & Community
  { path: "/revision", label: "SM-2 Spaced Revision", icon: "🔄", description: "Spaced repetition flashcards & forgetting curve memory drills." },
  { path: "/study-room", label: "Virtual Peer Study Sanctuary", icon: "👥", description: "24/7 Peer accountability study halls with synchronized Pomodoro & ambient sound." },
  { path: "/voice-notes", label: "Voice Notes & Audio Studio", icon: "🎙️", description: "AI speech-to-text dictation for rapid revision and walk-and-learn study." },
  { path: "/leaderboard", label: "National Cadet Leaderboard", icon: "🏆", description: "All-India cadet rankings, XP badges, streaks, and peer comparison." },

  // 5. Personality & Mentorship
  { path: "/interview", label: "Personality Test Simulator", icon: "🎙️", description: "DAF Profiler & 5-Member Board Room Viva audio simulator." },
  { path: "/chill-zone", label: "Cognitive Arcade", icon: "🎮", description: "6 Cognitive reaction games, spatial puzzles & Cadet Leaderboard." },
  { path: "/assistant", label: "AI Strategic Mentor", icon: "🤖", description: "Direct conversational AI mentor for strategy, answers & doubt clearance." },

  // 6. System & Management
  { path: "/profile", label: "Cadet Dossier & DAF", icon: "👤", description: "Cadet DAF details, optional subject, target year & rank telemetry." },
  { path: "/settings", label: "System Preferences", icon: "⚙️", description: "Audio synthesis toggles, AI model selection & offline sync." },
  { path: "/notifications", label: "Notification Center", icon: "🔔", description: "Spaced repetition alerts, streak reminders & Telegram dispatches." },
  { path: "/admin", label: "Admin & Telemetry Hub", icon: "👑", description: "Live cadet telemetry, Telegram broadcast dispatch & DB health monitor." },
];
