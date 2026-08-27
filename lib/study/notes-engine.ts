import { NoteItem, PYQQuestion, MainsPYQQuestion } from "../core/types";
import { queryAI } from "../ai/client";
import { buildNoteSynthesisPrompt, UPSC_MENTOR_SYSTEM_PROMPT } from "../ai/prompts";
import { createAdminClient } from "../db/supabase";
import { safeArray } from "../core/utils";

/**
 * Synthesizes structured revision notes for a given UPSC topic using the central AI client.
 */
export async function generateUPSCNotes(
  subject: string,
  topic: string
): Promise<{ content: string; keyKeywords: string[] }> {
  const prompt = buildNoteSynthesisPrompt(subject, topic);

  const aiResult = await queryAI<{ content: string; keyKeywords: string[] }>({
    systemPrompt: UPSC_MENTOR_SYSTEM_PROMPT,
    prompt,
    temperature: 0.3,
  });

  const content =
    aiResult.success && aiResult.data.text
      ? aiResult.data.text
      : `# ${subject}: ${topic}\n\n## 1. Core Dimensions & Definitions\n- Key structural components under the UPSC syllabus.\n\n## 2. Constitutional / Statutory Basis\n- Relevant Articles, Schedules, and Acts.\n\n## 3. Prelims Pointers\n- Nodal agencies, international treaties, and chronological developments.\n\n## 4. Mains Way Forward\n- Committee recommendations (2nd ARC, Law Commission) and actionable reforms.`;

  return {
    content,
    keyKeywords: [subject, topic, "UPSC Notes", "Revision"],
  };
}

/**
 * Saves or updates a note in Supabase with local fallback.
 */
export async function saveUserNote(
  userId: string,
  subject: string,
  topic: string,
  title: string,
  content: string,
  isAiGenerated = false,
  tags: string[] = []
): Promise<NoteItem> {
  const note: NoteItem = {
    id: `note-${Date.now()}`,
    userId,
    subject,
    topic,
    title,
    content,
    isAiGenerated,
    keyKeywords: tags,
    tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const supabase = createAdminClient();
    await supabase.from("notes").insert({
      user_id: userId,
      subject,
      topic,
      title,
      content,
      is_ai_generated: isAiGenerated,
      tags,
    });
  } catch (err) {
    console.warn("[NotesEngine] Note write failed to Supabase:", err);
  }

  return note;
}

// ============================================================================
// TOPIC LINKING & NOTE CREATION UTILITIES
// ============================================================================

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "this", "that", "from", "which", "about", "into",
  "under", "over", "what", "when", "where", "how", "all", "any", "both", "each",
  "more", "most", "other", "some", "such", "than", "too", "very", "can", "will",
  "just", "should", "now", "only", "also", "have", "has", "had", "are", "were",
  "been", "being", "give", "given", "following", "statements", "consider", "correct",
]);

export function normalizeTokens(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));
}

export function calculateMatchScore(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setB = new Set(tokensB);
  let overlap = 0;
  for (const token of tokensA) {
    if (setB.has(token)) overlap += 2;
    else {
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

export function extractPrelimsTokens(pyq: PYQQuestion): string[] {
  const subjectTokens = normalizeTokens(pyq.subject);
  const topicTokens = normalizeTokens(pyq.topic);
  const subtopicTokens = normalizeTokens(pyq.subtopic || "");
  const conceptTagsTokens = safeArray(pyq.conceptTags).flatMap(normalizeTokens);
  const questionTokens = normalizeTokens(pyq.question);
  const explanationTokens = normalizeTokens(pyq.explanation?.substring(0, 500) || "");

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

export function findRelatedPrelimsForNote(
  note: NoteItem,
  limit = 6,
  dataset: PYQQuestion[] = []
): { question: PYQQuestion; score: number }[] {
  if (!Array.isArray(dataset) || dataset.length === 0) return [];
  const noteTokens = extractNoteTokens(note);
  const noteSubjectNorm = note.subject.toLowerCase();

  const scored = dataset.map((q) => {
    let score = 0;
    const qSubjectNorm = q.subject.toLowerCase();

    if (
      noteSubjectNorm.includes(qSubjectNorm) ||
      qSubjectNorm.includes(noteSubjectNorm) ||
      (noteSubjectNorm === "polity" && qSubjectNorm === "polity") ||
      (noteSubjectNorm === "history" && qSubjectNorm.includes("history"))
    ) {
      score += 5;
    }

    const qTokens = extractPrelimsTokens(q);
    score += calculateMatchScore(noteTokens, qTokens);
    return { question: q, score };
  });

  return scored
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function findRelatedMainsForNote(
  note: NoteItem,
  limit = 4,
  dataset: MainsPYQQuestion[] = []
): { question: MainsPYQQuestion; score: number }[] {
  if (!Array.isArray(dataset) || dataset.length === 0) return [];
  const noteTokens = extractNoteTokens(note);
  const noteSubjectNorm = note.subject.toLowerCase();

  const scored = dataset.map((q) => {
    let score = 0;
    const qSubjectNorm = q.subject.toLowerCase();

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
    score += calculateMatchScore(noteTokens, qTokens);
    return { question: q, score };
  });

  return scored
    .filter((item) => item.score >= 3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function findRelatedNotesForPrelims(
  pyq: PYQQuestion,
  userNotes: NoteItem[],
  limit = 4
): { note: NoteItem; score: number }[] {
  if (!Array.isArray(userNotes) || userNotes.length === 0) return [];
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

export function findRelatedNotesForMains(
  mains: MainsPYQQuestion,
  userNotes: NoteItem[],
  limit = 4
): { note: NoteItem; score: number }[] {
  if (!Array.isArray(userNotes) || userNotes.length === 0) return [];
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

  const diagram = framework?.diagramOrFlowchart
    ? `## 4. Architectural Stencil / Diagram Blueprint\n\`\`\`\n${framework.diagramOrFlowchart}\n\`\`\``
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

## 5. Candidate Answer Workspace
*(Draft your answer here and evaluate against UPSC directive criteria.)*

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
