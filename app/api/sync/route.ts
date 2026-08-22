import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/db/supabase";
import { ApiResponse, DayPlan, NoteItem, TestResultRecord, RevisionItem } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";

interface FullUserDataPayload {
  userId?: string;
  plans?: Record<string, DayPlan>;
  notes?: NoteItem[];
  testResults?: TestResultRecord[];
  syllabusProgress?: string[];
  revisionItems?: RevisionItem[];
  pyqProgress?: string[];
}

/**
 * GET /api/sync
 * Retrieves the complete synchronized cloud state for the current user.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<FullUserDataPayload>>> {
  try {
    let userId: string | undefined;

    // 1. Check Supabase Auth
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {}

    // 2. Check Custom Headers / Query Params
    if (!userId) {
      userId =
        request.headers.get("x-cadet-id") ||
        request.nextUrl.searchParams.get("userId") ||
        undefined;
    }

    if (!userId || userId === "local-user") {
      return NextResponse.json({
        success: true,
        data: {
          plans: {},
          notes: [],
          testResults: [],
          syllabusProgress: [],
          revisionItems: [],
          pyqProgress: [],
        },
      });
    }

    const admin = createAdminClient();


    // 1. Fetch Study Plans & Tasks
    const { data: dbPlans } = await admin
      .from("study_plans")
      .select("plan_date, target_hours, notes")
      .eq("user_id", userId);

    const { data: dbTasks } = await admin
      .from("study_tasks")
      .select("id, plan_date, subject, title, description, hours, completed, task_type, priority")
      .eq("user_id", userId);

    const plans: Record<string, DayPlan> = {};
    safeArray(dbPlans).forEach((p) => {
      const dateStr = p.plan_date;
      plans[dateStr] = {
        date: dateStr,
        targetHours: Number(p.target_hours) || 6.0,
        notes: p.notes || undefined,
        tasks: [],
        dailyNotes: [],
      };
    });

    safeArray(dbTasks).forEach((t) => {
      const dateStr = t.plan_date;
      if (!plans[dateStr]) {
        plans[dateStr] = {
          date: dateStr,
          targetHours: 6.0,
          tasks: [],
          dailyNotes: [],
        };
      }
      plans[dateStr].tasks.push({
        id: t.id,
        subject: t.subject,
        title: t.title,
        description: t.description || "",
        hours: Number(t.hours) || 1.0,
        completed: Boolean(t.completed),
        taskType: t.task_type as any,
        priority: t.priority as any,
      });
    });

    // 2. Fetch Notes
    const { data: dbNotes } = await admin
      .from("notes")
      .select("id, user_id, subject, topic, title, content, is_ai_generated, tags, created_at, updated_at")
      .eq("user_id", userId);

    const notes: NoteItem[] = safeArray(dbNotes).map((n) => ({
      id: n.id,
      userId: n.user_id,
      subject: n.subject,
      topic: n.topic,
      title: n.title,
      content: n.content,
      isAiGenerated: Boolean(n.is_ai_generated),
      keyKeywords: safeArray(n.tags),
      tags: safeArray(n.tags),
      createdAt: n.created_at,
      updatedAt: n.updated_at,
    }));

    // 3. Fetch Test Results
    const { data: dbTests } = await admin
      .from("test_results")
      .select("id, title, score, correct, wrong, skipped, attempted, total, date")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    const testResults: TestResultRecord[] = safeArray(dbTests).map((t) => ({
      id: Number(t.id),
      title: t.title,
      score: Number(t.score),
      correct: Number(t.correct),
      wrong: Number(t.wrong),
      skipped: Number(t.skipped),
      attempted: Number(t.attempted),
      total: Number(t.total),
      date: t.date,
    }));

    // 4. Fetch Syllabus Progress
    const { data: dbSyllabus } = await admin
      .from("syllabus_progress")
      .select("topic_id, completed")
      .eq("user_id", userId)
      .eq("completed", true);

    const syllabusProgress = safeArray(dbSyllabus).map((s) => s.topic_id);

    // 5. Fetch Revision Items
    const { data: dbRevision } = await admin
      .from("revision_items")
      .select("*")
      .eq("user_id", userId)
      .order("next_review_date", { ascending: true });

    const revisionItems: RevisionItem[] = safeArray(dbRevision).map((r) => ({
      id: r.id,
      userId: r.user_id,
      topicId: r.topic_id,
      topicName: r.topic_name,
      subject: r.subject,
      upscImportance: r.upsc_importance || "High",
      repetitionCount: Number(r.repetition_count) || 0,
      easeFactor: Number(r.ease_factor) || 2.5,
      intervalDays: Number(r.interval_days) || 1,
      lastReviewedAt: r.last_reviewed_at,
      nextReviewDate: r.next_review_date,
      urgencyScore: 80,
      isOverdue: false,
    }));

    // 6. Fetch PYQ Progress
    const { data: dbPyq } = await admin
      .from("user_pyq_progress")
      .select("pyq_id, completed")
      .eq("user_id", userId)
      .eq("completed", true);

    const pyqProgress = safeArray(dbPyq).map((p) => String(p.pyq_id));

    return NextResponse.json({
      success: true,
      data: {
        plans,
        notes,
        testResults,
        syllabusProgress,
        revisionItems,
        pyqProgress,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Sync fetch failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYNC_FETCH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sync
 * Writes/Synchronizes the complete state to Supabase.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ syncedAt: string; status: string }>>> {
  try {
    const body: FullUserDataPayload = await request.json();
    let userId: string | undefined;

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) userId = user.id;
    } catch {}

    if (!userId) {
      userId =
        request.headers.get("x-cadet-id") ||
        body.userId ||
        "local-user";
    }

    const admin = createAdminClient();


    // 1. Sync Study Plans & Tasks
    if (body.plans && typeof body.plans === "object") {
      for (const [dateStr, plan] of Object.entries(body.plans)) {
        if (userId !== "local-user") {
          await admin.from("study_plans").upsert({
            user_id: userId,
            plan_date: dateStr,
            target_hours: plan.targetHours || 6.0,
            notes: plan.notes || null,
            updated_at: new Date().toISOString(),
          });

          // Sync tasks for date
          if (Array.isArray(plan.tasks)) {
            for (const t of plan.tasks) {
              await admin.from("study_tasks").upsert({
                user_id: userId,
                plan_date: dateStr,
                subject: t.subject || "General",
                title: t.title,
                description: t.description || "",
                hours: t.hours || 1.0,
                completed: t.completed,
                task_type: t.taskType || "Study",
                priority: t.priority || "Medium",
              });
            }
          }
        }
      }
    }

    // 2. Sync Notes
    if (Array.isArray(body.notes) && userId !== "local-user") {
      for (const n of body.notes) {
        await admin.from("notes").upsert({
          user_id: userId,
          subject: n.subject,
          topic: n.topic || n.title,
          title: n.title,
          content: n.content,
          is_ai_generated: Boolean(n.isAiGenerated),
          tags: safeArray(n.tags),
          updated_at: new Date().toISOString(),
        });
      }
    }

    // 3. Sync Test Results
    if (Array.isArray(body.testResults) && userId !== "local-user") {
      for (const t of body.testResults) {
        await admin.from("test_results").upsert({
          user_id: userId,
          title: t.title,
          score: t.score,
          correct: t.correct,
          wrong: t.wrong,
          skipped: t.skipped,
          attempted: t.attempted,
          total: t.total,
          date: t.date,
        });
      }
    }

    // 4. Sync Syllabus Progress
    if (Array.isArray(body.syllabusProgress) && userId !== "local-user") {
      for (const topicId of body.syllabusProgress) {
        await admin.from("syllabus_progress").upsert({
          user_id: userId,
          topic_id: topicId,
          completed: true,
          updated_at: new Date().toISOString(),
        });
      }
    }

    // 5. Sync Revision Items
    if (Array.isArray(body.revisionItems) && userId !== "local-user") {
      for (const rev of body.revisionItems) {
        await admin.from("revision_items").upsert(
          {
            user_id: userId,
            topic_id: rev.topicId,
            topic_name: rev.topicName,
            subject: rev.subject,
            upsc_importance: rev.upscImportance,
            repetition_count: rev.repetitionCount,
            ease_factor: rev.easeFactor,
            interval_days: rev.intervalDays,
            last_reviewed_at: rev.lastReviewedAt || new Date().toISOString(),
            next_review_date: rev.nextReviewDate,
          },
          { onConflict: "user_id,topic_id" }
        );
      }
    }

    // 6. Sync PYQ Progress
    if (Array.isArray(body.pyqProgress) && userId !== "local-user") {
      for (const pyqId of body.pyqProgress) {
        await admin.from("user_pyq_progress").upsert(
          {
            user_id: userId,
            pyq_id: typeof pyqId === "number" ? pyqId : parseInt(String(pyqId), 10) || 1,
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,pyq_id" }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        syncedAt: new Date().toISOString(),
        status: "OK",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Sync push failed";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SYNC_PUSH_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}
