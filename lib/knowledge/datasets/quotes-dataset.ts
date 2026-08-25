import upscQuotesRaw from "@/data/upsc-quotes.json";

export type QuoteTheme =
  | "Society"
  | "Polity"
  | "Economy"
  | "Environment"
  | "Science & Tech"
  | "Education & Culture"
  | "Ethics & Integrity"
  | "International Relations"
  | "Health & Well-being"
  | "Leadership & Administration"
  | "History & Philosophy";

export type ApplicablePaper = "Essay" | "GS-1" | "GS-2" | "GS-3" | "GS-4";

export interface UPSCQuote {
  id: string;
  theme: QuoteTheme;
  quote: string;
  author: string;
  coreConcept: string;
  applicablePapers: ApplicablePaper[];
  placement: string;
  anchoringTips: string;
}

export const UPSC_QUOTES_DATASET: UPSCQuote[] = upscQuotesRaw as UPSCQuote[];

export const QUOTE_THEMES: { label: string; value: QuoteTheme | "ALL"; icon: string; description: string }[] = [
  { label: "All Themes", value: "ALL", icon: "🌐", description: "Complete 325+ UPSC CSE Mains quotes repository" },
  { label: "Society & Gender", value: "Society", icon: "👥", description: "Social justice, women empowerment, poverty & inclusion" },
  { label: "Polity & Governance", value: "Polity", icon: "🏛️", description: "Constitutional morality, democracy, rule of law & rights" },
  { label: "Economy & Growth", value: "Economy", icon: "📈", description: "Inclusive growth, capability approach, reforms & equity" },
  { label: "Environment & Ecology", value: "Environment", icon: "🌿", description: "Climate change, planetary boundaries, deep ecology & stewardship" },
  { label: "Science & Technology", value: "Science & Tech", icon: "🔬", description: "Scientific temper, AI ethics, tech disruption & inquiry" },
  { label: "Education & Culture", value: "Education & Culture", icon: "📚", description: "Holistic learning, cultural syncretism & human capital" },
  { label: "Ethics & Integrity", value: "Ethics & Integrity", icon: "⚖️", description: "Nolan principles, moral courage, probity & conscience" },
  { label: "International Relations", value: "International Relations", icon: "🌍", description: "Diplomacy, strategic autonomy, soft power & peace" },
  { label: "Health & Well-being", value: "Health & Well-being", icon: "🩺", description: "Public health, nutrition, preventive care & mental health" },
  { label: "Leadership & Admin", value: "Leadership & Administration", icon: "🎖️", description: "Servant leadership, adaptive planning & execution" },
  { label: "History & Philosophy", value: "History & Philosophy", icon: "📜", description: "Historical awareness, rationalism, justice & resilience" },
];

export const ARGUMENTATIVE_ANCHORING_GUIDE = {
  title: "Argumentative Anchoring for UPSC Mains & Essay",
  summary: "A quote is not decorative embroidery—it is the structural engine of your argument. Unpack, interrogate, and anchor quotes to real data, court cases, committees, and constitutional articles.",
  placementPrinciples: [
    {
      position: "Introduction Hook",
      purpose: "Grabs immediate examiner attention, sets the philosophical tone, and establishes the essay thesis.",
      example: "Start a social-justice essay with Dr. Ambedkar's 'Life of contradictions' or Gandhi's Talisman."
    },
    {
      position: "Body Paragraph Mini-Thesis",
      purpose: "Becomes the conceptual anchor for that specific section, followed by empirical validation.",
      example: "Open a foreign-policy section with Dr. Jaishankar's 'The India Way is to be a shaper, not just an abstainer'."
    },
    {
      position: "Conclusion Call-to-Action",
      purpose: "Leaves a punchy, elevating final takeaway that unites constitutional ideals with visionary forward momentum.",
      example: "End an ethics or governance answer with Marcus Aurelius: 'Waste no more time arguing about what a good man should be; be one.'"
    }
  ]
};
