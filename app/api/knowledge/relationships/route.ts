import { NextRequest, NextResponse } from "next/server";
import { getAllRelationships, saveRelationship } from "@/lib/knowledge/knowledge-engine";
import { ApiResponse } from "@/lib/core/types";
import { TopicRelationship } from "@/lib/knowledge/types";

export async function GET(): Promise<NextResponse<ApiResponse<TopicRelationship[]>>> {
  try {
    const relationships = getAllRelationships();
    return NextResponse.json({
      success: true,
      data: relationships,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch relationships";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RELATIONSHIPS_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<TopicRelationship>>> {
  try {
    const body = await request.json();
    const { fromTopicId, toTopicId, relationshipType, relevanceScore = 0.8, description, verificationStatus = "Admin Approved" } = body;

    if (!fromTopicId || !toTopicId || !relationshipType) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields: fromTopicId, toTopicId, relationshipType",
          },
        },
        { status: 400 }
      );
    }

    const relationship: TopicRelationship = {
      fromTopicId,
      toTopicId,
      relationshipType,
      relevanceScore,
      description,
      verificationStatus,
      createdAt: new Date().toISOString(),
    };

    saveRelationship(relationship);

    return NextResponse.json({
      success: true,
      data: relationship,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save relationship";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "RELATIONSHIP_SAVE_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
