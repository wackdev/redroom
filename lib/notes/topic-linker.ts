import { NoteItem, PYQQuestion, MainsPYQQuestion } from "@/lib/core/types";
import { STATIC_PYQ_DATASET } from "@/lib/pyq/static-dataset";
import { STATIC_MAINS_PYQ_DATASET } from "@/lib/mains-pyq/static-dataset";
import { safeArray } from "@/lib/core/utils";

/**
 * Normalizes text for semantic token comparison.
 */
export function normalizeTokens(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "this", "that", "from", "which", "about", "into",
  "under", "over", "what", "when", "where", "how", "all", "any", "both", "each",
  "more", "most", "other", "some", "such", "than", "too", "very", "can", "will",
  "just", "should", "now", "only", "also", "have", "has", "had", "are", "were",
  "been", "being", "give", "given", "following", "statements", "consider", "correct",
]);

/**
 * Calculates keyword overlap score between two sets of tokens.
 */
export function calculateMatchScore(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setB = new Set(tokensB);
  let overlap = 0;
  for (const token of tokensA) {
    if (setB.has(token)) overlap += 2;
    else {
      // Substring match
      for (const b of setB) {
        if (token.length > 3 && b.includes(token)) {
          overlap += 1;
          break;
        }
      }
    }
  }
  return overlap;
}

/**
 * Extracts comprehensive search tokens from a Note.
 */
export function extractNoteTokens(note: NoteItem): string[] {
  const subjectTokens = normalizeTokens(note.subject);
  const topicTokens = normalizeTokens(note.topic);
  const titleTokens = normalizeTokens(note.title);
  const tagsTokens = safeArray(note.tags).flatMap(normalizeTokens);
  const keyKeywordTokens = safeArray(note.keyKeywords).flatMap(normalizeTokens);
  const contentTokens = normalizeTokens(note.content.substring(0, 1000));

  return Array.from(
    new Set([
      ...subjectTokens,
      ...topicTokens,
      ...titleTokens,
      ...tagsTokens,
      ...keyKeywordTokens,
      ...contentTokens,
    ])
  );
}

/**
 * Extracts comprehensive search tokens from a Prelims Question.
 */
export function extractPrelimsTokens(pyq: PYQQuestion): string[] {
  const subjectTokens = normalizeTokens(pyq.subject);
  const topicTokens = normalizeTokens(pyq.topic);
  const subtopicTokens = normalizeTokens(pyq.subtopic || "");
  const conceptTagsTokens = safeArray(pyq.conceptTags).flatMap(normalizeTokens);
  const questionTokens = normalizeTokens(pyq.question);
  const explanationTokens = normalizeTokens(pyq.explanation.substring(0, 500));

  return Array.from(
    new Set([
      ...subjectTokens,
      ...topicTokens,
      ...subtopicTokens,
      ...conceptTagsTokens,
      ...questionTokens,
      ...explanationTokens,
    ])
  );
}

/**
 * Extracts comprehensive search tokens from a Mains Question.
 */
export function extractMainsTokens(mains: MainsPYQQuestion): string[] {
  const paperTokens = normalizeTokens(mains.paper);
  const subjectTokens = normalizeTokens(mains.subject);
  const topicTokens = normalizeTokens(mains.topic);
  const subtopicTokens = normalizeTokens(mains.subtopic || "");
  const syllabusTagsTokens = safeArray(mains.syllabusTags).flatMap(normalizeTokens);
  const questionTokens = normalizeTokens(mains.question);
  const frameworkTokens = mains.framework?.keywords ? safeArray(mains.framework.keywords).flatMap(normalizeTokens) : [];

  return Array.from(
    new Set([
      ...paperTokens,
      ...subjectTokens,
      ...topicTokens,
      ...subtopicTokens,
      ...syllabusTagsTokens,
      ...questionTokens,
      ...frameworkTokens,
    ])
  );
}

/**
 * Finds all Prelims PYQs matching a Note.
 */
export function findRelatedPrelimsForNote(
  note: NoteItem,
  limit = 6,
  dataset: PYQQuestion[] = STATIC_PYQ_DATASET
): { question: PYQQuestion; score: number }[] {
  const noteTokens = extractNoteTokens(note);
  const noteSubjectNorm = note.subject.toLowerCase();

  const scored = dataset.map((q) => {
    let score = 0;
    const qSubjectNorm = q.subject.toLowerCase();

    // Subject affinity boost
    if (
      noteSubjectNorm.includes(qSubjectNorm) ||
      qSubjectNorm.includes(noteSubjectNorm) ||
      (noteSubjectNorm === "polity" && qSubjectNorm === "polity") ||
      (noteSubjectNorm === "history" && qSubjectNorm.includes("history"))
    ) {
      score += 5;
    }

    const qTokens = extractPrelimsTokens(q);
    const tokenScore = calculateMatchScore(noteTokens, qTokens);
    score += tokenScore;

    return { question: q, score };
  });

  return scored
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Finds all Mains PYQs matching a Note.
 */
export function findRelatedMainsForNote(
  note: NoteItem,
  limit = 4,
  dataset: MainsPYQQuestion[] = STATIC_MAINS_PYQ_DATASET
): { question: MainsPYQQuestion; score: number }[] {
  const noteTokens = extractNoteTokens(note);
  const noteSubjectNorm = note.subject.toLowerCase();

  const scored = dataset.map((q) => {
    let score = 0;
    const qSubjectNorm = q.subject.toLowerCase();

    // Subject/Paper affinity
    if (
      noteSubjectNorm.includes(qSubjectNorm) ||
      qSubjectNorm.includes(noteSubjectNorm) ||
      (noteSubjectNorm.includes("polity") && q.paper === "GS-2") ||
      (noteSubjectNorm.includes("history") && q.paper === "GS-1") ||
      (noteSubjectNorm.includes("economy") && q.paper === "GS-3") ||
      (noteSubjectNorm.includes("environment") && q.paper === "GS-3") ||
      (noteSubjectNorm.includes("ethics") && q.paper === "GS-4")
    ) {
      score += 4;
    }

    const qTokens = extractMainsTokens(q);
    const tokenScore = calculateMatchScore(noteTokens, qTokens);
    score += tokenScore;

    return { question: q, score };
  });

  return scored
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Finds user notes matching a Prelims PYQ.
 */
export function findRelatedNotesForPrelims(
  pyq: PYQQuestion,
  userNotes: NoteItem[],
  limit = 4
): { note: NoteItem; score: number }[] {
  const qTokens = extractPrelimsTokens(pyq);

  const scored = userNotes.map((n) => {
    let score = 0;
    if (n.subject.toLowerCase().includes(pyq.subject.toLowerCase())) {
      score += 5;
    }
    const nTokens = extractNoteTokens(n);
    score += calculateMatchScore(qTokens, nTokens);
    return { note: n, score };
  });

  return scored
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Finds user notes matching a Mains PYQ.
 */
export function findRelatedNotesForMains(
  mains: MainsPYQQuestion,
  userNotes: NoteItem[],
  limit = 4
): { note: NoteItem; score: number }[] {
  const qTokens = extractMainsTokens(mains);

  const scored = userNotes.map((n) => {
    let score = 0;
    if (n.subject.toLowerCase().includes(mains.subject.toLowerCase())) {
      score += 5;
    }
    const nTokens = extractNoteTokens(n);
    score += calculateMatchScore(qTokens, nTokens);
    return { note: n, score };
  });

  return scored
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Helper to construct a structured Note from a Prelims Question.
 */
export function createNoteFromPrelimsQuestion(pyq: PYQQuestion, userId = "local-user"): Partial<NoteItem> {
  const optionsText = pyq.options.map((opt) => `- (${opt.id}) ${opt.text}`).join("\n");
  const tags = Array.from(new Set([pyq.subject, pyq.topic, ...(pyq.conceptTags || [])]));

  const markdownContent = `# ${pyq.subject}: ${pyq.topic} (UPSC Prelims ${pyq.year})

## 1. Exam Question
> **${pyq.question}**

${optionsText}

**Correct Answer:** Option **${pyq.correctAnswer}**

---

## 2. In-Depth Constitutional / Concept Analysis
${pyq.explanation}

---

## 3. High-Yield Prelims Takeaways & Traps
- **Topic**: ${pyq.topic}${pyq.subtopic ? ` → ${pyq.subtopic}` : ""}
- **Key Concepts Tested**: ${safeArray(pyq.conceptTags).join(", ")}
- **Difficulty Rating**: ${pyq.difficulty}
`;

  return {
    userId,
    subject: pyq.subject,
    topic: pyq.topic,
    title: `${pyq.subject} [PYQ ${pyq.year}]: ${pyq.topic}`,
    content: markdownContent,
    isAiGenerated: false,
    keyKeywords: tags,
    tags,
  };
}

/**
 * Helper to construct a comprehensive Model Note from a Mains Question.
 */
export function createNoteFromMainsQuestion(mains: MainsPYQQuestion, userId = "local-user"): Partial<NoteItem> {
  const framework = mains.framework;
  const dimensionsMd = framework?.dimensions
    ? framework.dimensions
        .map((dim) => `### ${dim.heading}\n${dim.points.map((p) => `- ${p}`).join("\n")}`)
        .join("\n\n")
    : "";

  const caseLaws = framework?.caseLawsOrArticlesOrCommittees
    ? `## 3. Landmark Case Laws, Articles & Committee Citations\n${framework.caseLawsOrArticlesOrCommittees.map((c) => `- **${c}**`).join("\n")}`
    : "";

  const diagram = framework?.mapDiagram
    ? `## 4. Architectural Stencil / Diagram Blueprint\n\`\`\`\n${framework.mapDiagram}\n\`\`\``
    : "";

  const tags = Array.from(
    new Set([mains.paper, mains.subject, mains.topic, ...(mains.syllabusTags || []), ...(framework?.keywords || [])])
  );

  const markdownContent = `# ${mains.paper}: ${mains.topic} (UPSC Mains ${mains.year})

## Question (${mains.marks} Marks • ${mains.wordLimit} Words • Directive: ${mains.directive})
> **${mains.question}**

---

## 1. Structural Introduction & Thesis Hook
${framework?.introduction || "Introduce the constitutional, economic, or ethical foundation."}

---

## 2. Multi-Dimensional Body Matrix
${dimensionsMd}

---

${caseLaws}

---

${diagram}

---

## 5. Full Model Topper Answer
${framework?.fullModelAnswer || "Full blueprint available in Mains Command Center."}

---

## 6. Sustainable Way Forward & Conclusion
${framework?.conclusion || "Forward-looking conclusion grounded in constitutional morality."}
`;

  return {
    userId,
    subject: mains.subject,
    topic: mains.topic,
    title: `${mains.paper} [${mains.year}]: ${mains.topic} (${mains.marks}M)`,
    content: markdownContent,
    isAiGenerated: false,
    keyKeywords: tags,
    tags,
  };
}
