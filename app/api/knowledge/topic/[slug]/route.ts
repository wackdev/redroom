import { NextRequest, NextResponse } from "next/server";
import { getTopicUnifiedView } from "@/lib/knowledge/knowledge-engine";
import { ApiResponse } from "@/lib/core/types";
import { TopicUnifiedView } from "@/lib/knowledge/types";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
): Promise<NextResponse<ApiResponse<TopicUnifiedView>>> {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "guest-cadet";

    const unifiedView = getTopicUnifiedView(slug, userId);

    if (!unifiedView) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "TOPIC_NOT_FOUND",
            message: `Topic with slug '${slug}' was not found in the Knowledge Vault.`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: unifiedView,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load unified topic view";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "TOPIC_VIEW_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
