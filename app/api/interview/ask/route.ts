import { NextRequest, NextResponse } from "next/server";
import { queryAI } from "@/lib/ai/client";
import { ApiResponse } from "@/lib/core/types";

interface InterviewAskRequest {
  candidateName?: string;
  homeState?: string;
  homeDistrict?: string;
  graduation?: string;
  optionalSubject?: string;
  hobbies?: string;
  previousAnswer?: string;
  speaker?: string;
  promptAngle?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ question: string; speaker: string; avatar: string }>>> {
  try {
    const body: InterviewAskRequest = await request.json();

    const name = body.candidateName || "Aspirant";
    const state = body.homeState || "India";
    const district = body.homeDistrict || "Home District";
    const graduation = body.graduation || "General Studies";
    const optional = body.optionalSubject || "General Studies";
    const hobbies = body.hobbies || "Reading, Policy Analysis";
    const speaker = body.speaker || "Chairman";
    const promptAngle = body.promptAngle || "Constitutional ethics, administrative crisis management, and national governance";
    const previousAnswer = body.previousAnswer?.trim() || "";

    const systemPrompt = `You are a distinguished UPSC Personality Test (Interview) Board Member presiding in the Dholpur House boardroom.
Role/Persona: ${speaker}.
Focus Domain: ${promptAngle}.

Candidate Detailed Application Form (DAF) Profile:
- Name: ${name}
- State & District: ${state}, ${district}
- Educational Background: ${graduation}
- Optional Subject: ${optional}
- Hobbies & Extracurriculars: ${hobbies}

Instructions:
1. Evaluate the candidate's last response critically with the high intellectual rigor expected by the Union Public Service Commission.
2. Formulate a sharp, thoughtful, situational, or conceptual follow-up cross-question.
3. Keep your response concise (2-3 sentences max). Ask only the question directly as the board member. Do not add metadata, pleasantries, or preamble.`;

    const userPrompt = previousAnswer
      ? `Candidate's previous response to the board:\n"${previousAnswer}"\n\nAsk your follow-up cross-examination question as ${speaker}:`
      : `The candidate has entered the board room and greeted the panel. Welcome ${name} briefly and ask your opening question connecting their background (${graduation}, ${state}) to public administration.`;

    const aiRes = await queryAI({
      systemPrompt,
      prompt: userPrompt,
      temperature: 0.35,
    });

    let question = aiRes.success && aiRes.data.text ? aiRes.data.text.trim() : "";

    if (!question) {
      question = `Thank you, ${name}. Looking at your background in ${graduation} from ${state}, how would you apply those analytical competencies to resolve grassroots administrative delays and resource misallocation?`;
    }

    const avatarMap: Record<string, string> = {
      Chairman: "🏛️",
      "Member 1 (Polity & Governance)": "⚖️",
      "Member 2 (Economy & Infrastructure)": "📈",
      "Member 3 (Internal Security & IR)": "🌐",
      "Psychologist & Ethics Expert": "🧠",
    };

    return NextResponse.json({
      success: true,
      data: {
        question,
        speaker,
        avatar: avatarMap[speaker] || "🏛️",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Interview AI query failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERVIEW_AI_ERROR",
          message: msg,
        },
      },
      { status: 500 }
    );
  }
}
