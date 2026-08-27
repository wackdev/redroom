import { SyllabusSubject, SyllabusTopic, SyllabusSubtopic, GSPaper } from "../core/types";
import { CANONICAL_UPSC_SYLLABUS, getFullHierarchicalSyllabus } from "./hierarchy-engine";

const SUBJECT_ICONS: Record<string, string> = {
  "ancient-indian-history": "🏛️",
  "medieval-indian-history": "🏰",
  "modern-indian-history": "🇮🇳",
  "indian-art-culture": "🎭",
  "physical-world-geography": "🌍",
  "geography-of-india": "🗺️",
  "indian-society": "👥",
  "indian-constitution-polity": "⚖️",
  "governance-public-policy": "📋",
  "social-justice-welfare": "🤝",
  "international-relations": "🌐",
  "indian-economy-macroeconomics": "📈",
  "agriculture-food-security": "🌾",
  "science-and-technology": "🔬",
  "environment-ecology-biodiversity": "🌱",
  "internal-security-disaster": "🛡️",
  "ethics-integrity-aptitude": "💡",
  "csat-prelims-paper-2": "📐",
};

/**
 * Transforms the 2026-27 hierarchical syllabus tree into the canonical SyllabusSubject[] structure.
 */
export function getFullSyllabusSubjects(): SyllabusSubject[] {
  const hierarchicalTree = getFullHierarchicalSyllabus();
  return hierarchicalTree.map((subj) => {
    const topics: SyllabusTopic[] = [];

    const mappedPaper: GSPaper =
      subj.paper === "GS-1"
        ? "GS-1"
        : subj.paper === "GS-2"
        ? "GS-2"
        : subj.paper === "GS-3"
        ? "GS-3"
        : subj.paper === "GS-4"
        ? "GS-4"
        : subj.paper === "CSAT"
        ? "CSAT"
        : subj.paper === "OPTIONAL"
        ? "Optional"
        : "Essay";

    (subj.units || []).forEach((unit) => {
      (unit.topics || []).forEach((t) => {
        const examStage: "Prelims" | "Mains" | "Both" =
          subj.exam_stage === "PRELIMS"
            ? "Prelims"
            : subj.exam_stage === "MAINS"
            ? "Mains"
            : "Both";

        const importance: "High" | "Medium" | "Low" =
          t.importance === "CRITICAL" || t.importance === "HIGH"
            ? "High"
            : t.importance === "LOW"
            ? "Low"
            : "Medium";

        const subtopics: SyllabusSubtopic[] = (t.subtopics || []).map((st, sIdx) => ({
          id: `${t.id}-st-${sIdx + 1}`,
          name: st,
          importance,
        }));

        topics.push({
          id: t.id,
          name: `${unit.name}: ${t.name}`,
          subjectId: subj.slug,
          exam: examStage,
          paper: mappedPaper,
          importance,
          subtopics,
        });
      });
    });

    return {
      id: subj.slug,
      name: subj.name,
      icon: SUBJECT_ICONS[subj.slug] || "📚",
      description: subj.description,
      topics,
    };
  });
}

export const UPSC_FULL_SYLLABUS: SyllabusSubject[] = getFullSyllabusSubjects();
