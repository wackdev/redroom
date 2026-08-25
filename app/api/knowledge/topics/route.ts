import { NextRequest, NextResponse } from "next/server";
import { getAllTopics, getKnowledgeSubjects } from "@/lib/knowledge/knowledge-engine";
import { ApiResponse } from "@/lib/core/types";
import { UniversalTopic, KnowledgeSubject } from "@/lib/knowledge/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ topics: UniversalTopic[]; subjects: KnowledgeSubject[] }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subject") || undefined;

    const topics = getAllTopics(subjectId);
    const subjects = getKnowledgeSubjects();

    return NextResponse.json({
      success: true,
      data: {
        topics,
        subjects,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch topics";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TOPICS_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
