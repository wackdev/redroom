import { NextRequest, NextResponse } from "next/server";
import { searchKnowledgeEngine } from "@/lib/knowledge/knowledge-engine";
import { ApiResponse } from "@/lib/core/types";
import { KnowledgeSearchResponse } from "@/lib/knowledge/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<KnowledgeSearchResponse>>> {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    const searchResults = searchKnowledgeEngine(q);

    return NextResponse.json({
      success: true,
      data: searchResults,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Knowledge search failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "KNOWLEDGE_SEARCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
