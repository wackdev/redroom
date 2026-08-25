import prelimsGs1Data from "@/data/syllabus/prelims-gs1.json";
import csatData from "@/data/syllabus/prelims-csat.json";
import mainsGsData from "@/data/syllabus/mains-gs.json";
import essayOptionalData from "@/data/syllabus/essay-optional.json";

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

/**
 * Returns the entire hierarchical syllabus taxonomy tree.
 */
export function getFullHierarchicalSyllabus(): HierarchicalSubjectNode[] {
  const combined: HierarchicalSubjectNode[] = [
    ...(prelimsGs1Data as HierarchicalSubjectNode[]),
    ...(csatData as HierarchicalSubjectNode[]),
    ...(mainsGsData as HierarchicalSubjectNode[]),
    ...(essayOptionalData as HierarchicalSubjectNode[]),
  ];

  return combined.sort((a, b) => a.display_order - b.display_order);
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
