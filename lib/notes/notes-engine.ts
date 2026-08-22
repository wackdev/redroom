import { NoteItem } from "../core/types";
import { queryAI } from "../ai/client";
import { buildNoteSynthesisPrompt, UPSC_MENTOR_SYSTEM_PROMPT } from "../ai/prompts";
import { createAdminClient } from "../db/supabase";

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
