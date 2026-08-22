/**
 * REDROOM UPSC AI Prompt Templates
 */

export const UPSC_MENTOR_SYSTEM_PROMPT = `You are REDROOM, an expert AI UPSC Mentor and CSE strategist designed specifically for Indian Civil Services Examination aspirants.
Your knowledge covers:
- Complete UPSC Prelims (GS-1 & CSAT) and Mains (GS 1-4, Essay, Optional).
- Landmark Supreme Court Judgements, Constitutional Articles, Government Schemes, Reports (2nd ARC, Law Commission, NITI Aayog).
- Standard Answer Writing frameworks: Introduction (Definition/Context) -> Body (Dimensions/Diagrams/Committees) -> Conclusion (Way Forward/SDGs).
Always respond with clarity, analytical rigor, structured points, and direct UPSC syllabus relevance.`;

export function buildCurrentAffairsAnalysisPrompt(articleTitle: string, articleText: string): string {
  return `Analyze the following Current Affairs article for UPSC Civil Services Examination (Prelims & Mains):

Article Title: "${articleTitle}"
Article Text:
${articleText}

Return a JSON object with this EXACT structure:
{
  "summary": "2-3 sentence executive summary for UPSC",
  "gsPaper": "GS-1" | "GS-2" | "GS-3" | "GS-4",
  "prelimsPoints": ["Precise factual point 1", "Point 2", "Point 3", "Point 4"],
  "mainsAngle": "Structured paragraph highlighting dimensions, issues, constitutional articles/committees, and way forward",
  "pyqConnection": "Relevant previous year question topic or pattern connection",
  "tags": ["tag1", "tag2", "tag3"]
}`;
}

export function buildQuizGenerationPrompt(topicOrNews: string, count = 3): string {
  return `Generate ${count} high-quality UPSC Prelims standard Multiple Choice Questions (MCQs) based on the following topic or current affairs content:

Topic / Content:
${topicOrNews}

Follow UPSC Question Patterns:
- Statement based questions ("Consider the following statements... Which of the statements given above is/are correct?")
- 4 Options labeled A, B, C, D
- 1 unambiguous correct answer
- Detailed explanatory rationale

Return a JSON object with this EXACT structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text...",
      "options": [
        {"id": "A", "text": "Option A text"},
        {"id": "B", "text": "Option B text"},
        {"id": "C", "text": "Option C text"},
        {"id": "D", "text": "Option D text"}
      ],
      "answer": "A" | "B" | "C" | "D",
      "explanation": "Detailed explanation explaining why the answer is correct and why other statements are incorrect."
    }
  ]
}`;
}

export function buildNoteSynthesisPrompt(subject: string, topic: string): string {
  return `Synthesize concise, high-yield UPSC Revision Notes for:
Subject: ${subject}
Topic: ${topic}

Structure the notes with:
1. Core Concepts & Definitions
2. Constitutional / Statutory / Geographical Basis
3. Key Dimensions & Frameworks
4. Landmark Judgements / Committees / Statistics
5. Prelims Memory Mnemonics
6. Mains Ready Keywords / Way Forward

Keep formatting clean and easy to scan for quick revision.`;
}

export function buildWeeklyReportAnalysisPrompt(params: {
  weekSpan: string;
  totalPlannedHours: number;
  totalCompletedHours: number;
  taskCompletionRate: number;
  subjectSummary: string;
  testsSummary: string;
  notesSummary: string;
}): string {
  return `As an expert UPSC Mentor, evaluate this aspirant's weekly preparation report for ${params.weekSpan}:

Weekly Summary Metrics:
- Planned Study: ${params.totalPlannedHours}h | Completed: ${params.totalCompletedHours}h (Target: 42h)
- Task Completion Rate: ${params.taskCompletionRate}%
- Subject Distribution: ${params.subjectSummary}
- Test & PYQ Performance: ${params.testsSummary}
- Daily Study Notes Recorded: ${params.notesSummary}

Provide a diagnostic mentorship evaluation in JSON format matching this EXACT structure:
{
  "overallGrade": "A+" | "A" | "B+" | "B" | "C" | "Needs Attention",
  "executiveSummary": "2-3 sentences summarizing the aspirant's velocity, consistency, and syllabus coverage this week.",
  "strengths": [
    "Specific observed strength 1 with subject/hours reference",
    "Observed strength 2",
    "Observed strength 3"
  ],
  "criticalGaps": [
    "Identified blindspot or under-allocated subject/task",
    "Identified consistency or practice gap"
  ],
  "strategicAdviceForNextWeek": [
    "Actionable priority 1 for upcoming week",
    "Actionable priority 2",
    "Actionable priority 3"
  ]
}`;
}

