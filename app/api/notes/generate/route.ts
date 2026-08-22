import { NextRequest, NextResponse } from "next/server";
import { generateUPSCNotes } from "@/lib/notes/notes-engine";
import { ApiResponse } from "@/lib/core/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ content: string; keyKeywords: string[] }>>> {
  try {
    const body = await request.json();
    const { subject = "Polity", topic } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Missing required 'topic' string",
          },
        },
        { status: 400 }
      );
    }

    const noteData = await generateUPSCNotes(subject, topic);

    return NextResponse.json({
      success: true,
      data: noteData,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Note generation failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOTE_GENERATE_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
