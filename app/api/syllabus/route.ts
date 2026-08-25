import { NextRequest, NextResponse } from "next/server";
import { UPSC_FULL_SYLLABUS } from "@/lib/syllabus/upsc-syllabus";
import {
  getFullHierarchicalSyllabus,
  getFlatSyllabusTopics,
} from "@/lib/syllabus/hierarchy-engine";
import { ApiResponse } from "@/lib/core/types";

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const { searchParams } = new URL(request.url);
    const paper = searchParams.get("paper");
    const stage = searchParams.get("stage");

    let hierarchy = getFullHierarchicalSyllabus();
    let flatTopics = getFlatSyllabusTopics();

    if (paper) {
      hierarchy = hierarchy.filter(
        (s) => s.paper.toLowerCase() === paper.toLowerCase()
      );
      flatTopics = flatTopics.filter(
        (t) => t.paper.toLowerCase() === paper.toLowerCase()
      );
    }

    if (stage) {
      hierarchy = hierarchy.filter(
        (s) =>
          s.exam_stage.toLowerCase() === stage.toLowerCase() ||
          s.exam_stage === "BOTH"
      );
      flatTopics = flatTopics.filter(
        (t) =>
          t.examStage.toLowerCase() === stage.toLowerCase() ||
          t.examStage === "BOTH"
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        hierarchy,
        flatTopics,
        subjects: UPSC_FULL_SYLLABUS,
        totalTopics: flatTopics.length,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load syllabus";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYLLABUS_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
