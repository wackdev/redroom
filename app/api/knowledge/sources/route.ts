import { NextRequest, NextResponse } from "next/server";
import { getAllSources, getSourceChunks } from "@/lib/knowledge/knowledge-engine";
import { ApiResponse } from "@/lib/core/types";
import { KnowledgeSource, SourceChunk } from "@/lib/knowledge/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ sources: KnowledgeSource[]; chunks?: SourceChunk[] }>>> {
  try {
    const { searchParams } = new URL(request.url);
    const sourceId = searchParams.get("sourceId") || undefined;
    const includeChunks = searchParams.get("includeChunks") === "true";

    const sources = getAllSources();
    let chunks: SourceChunk[] | undefined;

    if (includeChunks) {
      chunks = getSourceChunks({ sourceId });
    }

    return NextResponse.json({
      success: true,
      data: {
        sources,
        chunks,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch sources";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SOURCES_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
