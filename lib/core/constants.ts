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
  { path: "/dashboard", label: "Command Centre", icon: "⚡", description: "Central tactical HUD, live focus sprints, intelligence priority & metrics." },
  { path: "/syllabus", label: "Syllabus Matrix", icon: "📚", description: "GS-1 to GS-4 micro-topic tracker with yield analysis & PYQ cross-links." },
  { path: "/3d-zone", label: "3D Simulation Zone", icon: "🌌", description: "10 Interactive 3D Visual Labs: Geography Globe, History Tunnel, Constitutional Atlas & GIS." },
  { path: "/pyqs", label: "Prelims PYQ Arena", icon: "📝", description: "30-Year UPSC Question Archive with trap diagnostics & elimination radar." },
  { path: "/mains-pyqs", label: "Mains Answer Studio", icon: "🏛️", description: "Topper Model Copies, PESTLE Frameworks & live scannability scorecard." },
  { path: "/csat", label: "CSAT Logic & Math Lab", icon: "📐", description: "Speed Math trainer, Syllogisms Venn Studio & Formula Blitz drawer." },
  { path: "/study-plan", label: "Study Plan & Sanctuary", icon: "📅", description: "Dynamic daily schedule, Pomodoro sprints & active study network." },
  { path: "/revision", label: "SM-2 Active Recall", icon: "🔄", description: "Spaced repetition flashcards & forgetting curve memory drills." },
  { path: "/current-affairs", label: "Current Affairs & Audio", icon: "📰", description: "Daily editorial analysis, UPSC Prelims pointers & AI quiz generator." },
  { path: "/tests", label: "Mock Test Series", icon: "🎯", description: "Subject-wise multi-statement test series with elimination techniques." },
  { path: "/interview", label: "Personality Test Simulator", icon: "🎙️", description: "DAF Profiler & 5-Member Board Room Viva audio simulator." },
  { path: "/notes", label: "Notes & Mindmaps", icon: "✍️", description: "Offline notes vault, Markdown editor & Graph mindmap canvas." },
  { path: "/chill-zone", label: "Cognitive Arcade", icon: "🎮", description: "6 Cognitive reaction games, spatial puzzles & Cadet Leaderboard." },
  { path: "/performance", label: "Cognitive Radar & Reports", icon: "📈", description: "6-Axis GS Radar, Velocity metrics & Sunday Telegram PDF digests." },
  { path: "/assistant", label: "AI Strategic Mentor", icon: "🤖", description: "Direct conversational AI mentor for strategy, answers & doubt clearance." },
  { path: "/admin", label: "Admin & Telemetry Hub", icon: "👑", description: "Live cadet telemetry, Telegram broadcast dispatch & DB health monitor." },
];
