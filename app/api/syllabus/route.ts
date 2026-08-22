import { NextRequest, NextResponse } from "next/server";
import { UPSC_FULL_SYLLABUS } from "@/lib/syllabus/upsc-syllabus";
import { ApiResponse, SyllabusSubject } from "@/lib/core/types";

export async function GET(): Promise<NextResponse<ApiResponse<{ subjects: SyllabusSubject[]; totalTopics: number }>>> {
  try {
    const totalTopics = UPSC_FULL_SYLLABUS.reduce(
      (sum, sub) => sum + (sub.topics ? sub.topics.length : 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        subjects: UPSC_FULL_SYLLABUS,
        totalTopics,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load syllabus";
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
