import { NextRequest, NextResponse } from "next/server";
import { ingestSourceIntoEngine } from "@/lib/knowledge/knowledge-engine";
import { extractKnowledgeEntities, classifyChunkType, generateChunkKeywords } from "@/lib/knowledge/semantic-chunker";
import { ApiResponse } from "@/lib/core/types";
import { KnowledgeSource, SourceChunk } from "@/lib/knowledge/types";

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ source: KnowledgeSource; chunksCreated: number }>>> {
  try {
    const body = await request.json();
    const {
      title,
      subtitle,
      author = "UPSC Faculty",
      sourceType = "Standard Book",
      rawText = "",
      topicId,
      totalPages = 1,
      primarySubjectId = "indian_polity",
    } = body;

    if (!title || !rawText) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Title and rawText are required for ingestion",
          },
        },
        { status: 400 }
      );
    }

    const sourceId = `src-${Date.now()}`;
    const entities = extractKnowledgeEntities(rawText);
    const keywords = generateChunkKeywords(rawText);
    const chunkType = classifyChunkType(title, rawText);

    const newSource: KnowledgeSource = {
      id: sourceId,
      title,
      subtitle,
      author,
      sourceType,
      language: "English",
      totalPages,
      nativeTextPages: totalPages,
      ocrRequiredPages: 0,
      isProcessed: true,
      processingStatus: "completed",
      tags: keywords.slice(0, 5),
      primarySubjectId,
      createdAt: new Date().toISOString(),
    };

    const chunk: SourceChunk = {
      id: `chunk-${sourceId}-1`,
      sourceId,
      sourceTitle: title,
      sourceType,
      topicId,
      pageStart: 1,
      pageEnd: totalPages,
      heading: title,
      chunkType,
      rawContent: rawText,
      cleanedContent: rawText.trim(),
      searchableContent: `${title} ${keywords.join(" ")} ${rawText}`,
      keywords,
      entities,
      ocrConfidence: 1.0,
      sourcePosition: 1,
      createdAt: new Date().toISOString(),
    };

    ingestSourceIntoEngine(newSource, [chunk]);

    return NextResponse.json({
      success: true,
      data: {
        source: newSource,
        chunksCreated: 1,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Source ingestion failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INGESTION_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
