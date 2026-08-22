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
  { path: "/dashboard", label: "Command Centre", icon: "⚡" },
  { path: "/syllabus", label: "Syllabus", icon: "📚" },
  { path: "/study-plan", label: "Study Plan", icon: "📅" },
  { path: "/pyqs", label: "Prelims PYQs", icon: "📝" },
  { path: "/mains-pyqs", label: "Mains PYQs", icon: "🏛️" },
  { path: "/csat", label: "CSAT Logic Lab", icon: "📐" },
  { path: "/interview", label: "Personality Test (Viva)", icon: "🎙️" },
  { path: "/current-affairs", label: "Current Affairs", icon: "📰" },
  { path: "/revision", label: "Revision", icon: "🔄" },
  { path: "/notes", label: "Notes", icon: "✍️" },
  { path: "/tests", label: "Mock Tests", icon: "🎯" },
  { path: "/chill-zone", label: "Chill Zone (Arcade)", icon: "🎮" },
  { path: "/performance", label: "Analytics", icon: "📈" },
  { path: "/assistant", label: "AI Mentor", icon: "🤖" },
  { path: "/admin", label: "Admin Console", icon: "👑" },
];
