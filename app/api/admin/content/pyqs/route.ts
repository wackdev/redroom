import { NextRequest, NextResponse } from "next/server";
import { AdminService } from "@/lib/admin/admin-service";
import { ApiResponse } from "@/lib/core/types";
import { QuestionDraft } from "@/lib/admin/types";

export async function GET(): Promise<NextResponse<ApiResponse<QuestionDraft[]>>> {
  try {
    const drafts = await AdminService.getQuestionDrafts();
    return NextResponse.json({ success: true, data: drafts });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load question drafts";
    return NextResponse.json(
      { success: false, error: { code: "DRAFTS_FETCH_ERROR", message: msg } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<QuestionDraft>>> {
  try {
    const body = await request.json();
    const { draft, adminEmail = "command@whynotupsc.org" } = body;

    if (!draft || !draft.question || !draft.subject) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Draft content is incomplete" } },
        { status: 400 }
      );
    }

    const saved = await AdminService.saveQuestionDraft(draft, adminEmail);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save question draft";
    return NextResponse.json(
      { success: false, error: { code: "DRAFT_SAVE_ERROR", message: msg } },
      { status: 500 }
    );
  }
}
