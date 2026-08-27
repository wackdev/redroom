import gs1Data from "@/data/syllabus/gs1-heritage-geography-society.json";
import gs2Data from "@/data/syllabus/gs2-polity-governance-justice-ir.json";
import gs3Data from "@/data/syllabus/gs3-economy-scitech-environment-security.json";
import gs4Data from "@/data/syllabus/gs4-ethics-integrity-aptitude.json";
import csatData from "@/data/syllabus/prelims-csat.json";

export type ExamStage = "PRELIMS" | "MAINS" | "BOTH" | "INTERVIEW";
export type PaperType = "GS-1" | "GS-2" | "GS-3" | "GS-4" | "CSAT" | "ESSAY" | "OPTIONAL";
export type ImportanceLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface HierarchicalTopicNode {
  id: string;
  name: string;
  slug: string;
  importance: ImportanceLevel;
  display_order: number;
  subtopics: string[];
}

export interface HierarchicalUnitNode {
  id: string;
  name: string;
  slug: string;
  description: string;
  importance: ImportanceLevel;
  display_order: number;
  topics: HierarchicalTopicNode[];
}

export interface HierarchicalSubjectNode {
  id: string;
  name: string;
  slug: string;
  description: string;
  parent_id: string | null;
  exam_stage: ExamStage;
  paper: PaperType;
  subject: string;
  importance: ImportanceLevel;
  display_order: number;
  units: HierarchicalUnitNode[];
}

export interface FlatSyllabusTopicRecord {
  id: string;
  name: string;
  slug: string;
  subjectId: string;
  subjectName: string;
  paper: PaperType;
  examStage: ExamStage;
  importance: ImportanceLevel;
  unitName: string;
  subtopics: string[];
}

export const LOCAL_STORAGE_CUSTOM_SYLLABUS_KEY = "redroom_custom_syllabus";

export const CANONICAL_UPSC_SYLLABUS: HierarchicalSubjectNode[] = [
  ...(gs1Data as HierarchicalSubjectNode[]),
  ...(gs2Data as HierarchicalSubjectNode[]),
  ...(gs3Data as HierarchicalSubjectNode[]),
  ...(gs4Data as HierarchicalSubjectNode[]),
  ...(csatData as HierarchicalSubjectNode[]),
];

/**
 * Returns the hierarchical syllabus taxonomy tree from user uploads or the canonical 2026-27 syllabus.
 */
export function getFullHierarchicalSyllabus(): HierarchicalSubjectNode[] {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_SYLLABUS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        }
      }
    } catch (err) {
      console.warn("Failed to read custom syllabus from storage, falling back to canonical:", err);
    }
  }
  return CANONICAL_UPSC_SYLLABUS;
}

/**
 * Saves candidate uploaded syllabus tree into storage.
 */
export function saveUploadedSyllabus(subjects: HierarchicalSubjectNode[]): number {
  if (typeof window === "undefined" || !Array.isArray(subjects)) return 0;
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_SYLLABUS_KEY, JSON.stringify(subjects));
    return subjects.length;
  } catch (err) {
    console.error("Failed to save uploaded syllabus:", err);
    throw err;
  }
}

/**
 * Resets the syllabus to the canonical 2026-27 GS SCORE baseline.
 */
export function resetToCanonicalSyllabus(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCAL_STORAGE_CUSTOM_SYLLABUS_KEY);
  } catch {}
}

/**
 * Filter syllabus tree by Paper.
 */
export function filterSyllabusByPaper(
  paper: PaperType | "ALL" | "PRELIMS_GS1"
): HierarchicalSubjectNode[] {
  const fullTree = getFullHierarchicalSyllabus();
  if (paper === "ALL") return fullTree;
  if (paper === "PRELIMS_GS1") {
    return fullTree.filter(
      (s) => (s.exam_stage === "PRELIMS" || s.exam_stage === "BOTH") && s.paper !== "CSAT"
    );
  }
  return fullTree.filter((s) => s.paper === paper);
}

/**
 * Filter syllabus tree by Exam Stage (PRELIMS, MAINS, BOTH).
 */
export function filterSyllabusByStage(stage: ExamStage | "ALL"): HierarchicalSubjectNode[] {
  const fullTree = getFullHierarchicalSyllabus();
  if (stage === "ALL") return fullTree;
  return fullTree.filter((s) => s.exam_stage === stage || s.exam_stage === "BOTH");
}

/**
 * Returns a flattened array of all micro-topics across all papers for easy searching,
 * progress tracking, and relationship mapping.
 */
export function getFlatSyllabusTopics(): FlatSyllabusTopicRecord[] {
  const fullTree = getFullHierarchicalSyllabus();
  const flattened: FlatSyllabusTopicRecord[] = [];

  for (const subject of fullTree) {
    for (const unit of subject.units || []) {
      for (const topic of unit.topics || []) {
        flattened.push({
          id: topic.id,
          name: topic.name,
          slug: topic.slug,
          subjectId: subject.id,
          subjectName: subject.name,
          paper: subject.paper,
          examStage: subject.exam_stage,
          importance: topic.importance || subject.importance || "HIGH",
          unitName: unit.name,
          subtopics: Array.isArray(topic.subtopics) ? topic.subtopics : [],
        });
      }
    }
  }

  return flattened;
}

/**
 * Find a topic or subject node by ID or slug.
 */
export function findSyllabusNodeById(idOrSlug: string): FlatSyllabusTopicRecord | undefined {
  const all = getFlatSyllabusTopics();
  return all.find(
    (t) =>
      t.id.toLowerCase() === idOrSlug.toLowerCase() ||
      t.slug.toLowerCase() === idOrSlug.toLowerCase()
  );
}

/**
 * Searches across all micro-topics and subtopics.
 */
export function searchSyllabus(query: string): FlatSyllabusTopicRecord[] {
  if (!query || query.trim().length === 0) return [];
  const q = query.toLowerCase().trim();
  const all = getFlatSyllabusTopics();

  return all.filter((item) => {
    if (item.name.toLowerCase().includes(q)) return true;
    if (item.subjectName.toLowerCase().includes(q)) return true;
    if (item.unitName.toLowerCase().includes(q)) return true;
    return item.subtopics.some((st) => st.toLowerCase().includes(q));
  });
}
