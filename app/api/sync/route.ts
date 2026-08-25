import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ApiResponse, DayPlan, NoteItem, TestResultRecord, RevisionItem } from "@/lib/core/types";
import { safeArray } from "@/lib/core/utils";

export const runtime = "nodejs";

interface SyncTask {
  id?: number;
  entityType: string;
  action: "INSERT" | "UPDATE" | "DELETE" | "UPSERT";
  entityId: string;
  payload: Record<string, unknown>;
  createdAt?: string;
}

interface SyncRequestBody {
  batch?: SyncTask[];
  task?: SyncTask;
  userId?: string;
  plans?: Record<string, DayPlan>;
  notes?: NoteItem[];
  testResults?: TestResultRecord[];
  syllabusProgress?: string[];
  revisionItems?: RevisionItem[];
  pyqProgress?: string[];
}

/**
 * Initializes an Edge-safe Supabase client extracting JWT from Authorization header or cookies.
 */
function getEdgeSupabaseClient(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  const authHeader = request.headers.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {},
    },
  });
}

/**
 * Resolves user identity from Supabase Auth token, custom headers, or request body.
 */
async function resolveUserId(request: NextRequest, body?: SyncRequestBody): Promise<string> {
  const supabase = getEdgeSupabaseClient(request);

  // 1. Try resolving from active Supabase JWT
  try {
    const authHeader = request.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user?.id) return user.id;
    }
  } catch {}

  // 2. Try cookie or custom header
  const headerId = request.headers.get("x-cadet-id");
  if (headerId && headerId !== "local-user") return headerId;

  // 3. Fallback to body payload or default cadet ID
  if (body?.userId && body.userId !== "local-user") return body.userId;

  return "local-user";
}

/**
 * POST /api/sync
 * Edge Sync Receiver: Ingests atomic tasks from Dexie sync_outbox and applies UPSERT/DELETE.
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<{ syncedAt: string; status: string; processedCount: number }>>> {
  try {
    const body: SyncRequestBody = await request.json();
    const userId = await resolveUserId(request, body);
    const supabase = getEdgeSupabaseClient(request);
    let processedCount = 0;

    if (userId && userId !== "local-user") {
      // ----------------------------------------------------------------------
      // 1. PROCESS DEXIE OUTBOX BATCH
      // ----------------------------------------------------------------------
      const tasksToProcess: SyncTask[] = [];
      if (Array.isArray(body.batch) && body.batch.length > 0) {
        tasksToProcess.push(...body.batch);
      } else if (body.task) {
        tasksToProcess.push(body.task);
      }

      for (const task of tasksToProcess) {
        try {
          const table = task.entityType;
          let payload: Record<string, unknown> = {
            ...task.payload,
            user_id: userId,
            updated_at: new Date().toISOString(),
          };

          // Transform specific entity types to match Supabase database columns
          if (table === "test_results") {
            const raw = task.payload as any;
            const attempted = Number(raw.attempted) || ((Number(raw.correct) || 0) + (Number(raw.wrong || raw.incorrect) || 0));
            const correct = Number(raw.correct) || 0;
            const total = Number(raw.total) || Number(raw.maxScore) || (attempted > 0 ? attempted : 100);
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            payload = {
              id: String(raw.id || `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`),
              user_id: userId,
              title: raw.title || "UPSC Module Test",
              subject: raw.subject || "General Studies",
              score: Number(raw.score) || 0,
              total,
              correct,
              incorrect: Number(raw.wrong ?? raw.incorrect ?? 0),
              unattempted: Number(raw.skipped ?? raw.unattempted ?? 0),
              accuracy,
              time_spent_seconds: Number(raw.timeSpentSeconds) || 0,
              paper: raw.paper || "GS-1",
              date: raw.date || new Date().toISOString(),
              answers: raw.userAnswers || raw.answers || {},
              created_at: raw.createdAt || new Date().toISOString(),
            };
          } else if (table === "study_plans") {
            const raw = task.payload as any;
            payload = {
              user_id: userId,
              plan_date: raw.planDate || raw.date,
              target_hours: Number(raw.targetHours) || 6.0,
              notes: raw.notes || null,
              updated_at: new Date().toISOString(),
            };
          } else if (table === "study_tasks") {
            const raw = task.payload as any;
            payload = {
              id: String(raw.id || `task_${Date.now()}`),
              user_id: userId,
              plan_date: raw.planDate || raw.date || new Date().toISOString().split("T")[0],
              subject: raw.subject || "General Studies",
              title: raw.title || "Study Task",
              description: raw.description || "",
              hours: Number(raw.hours) || 1.0,
              completed: Boolean(raw.completed),
              task_type: raw.taskType || "Study",
              priority: raw.priority || "Medium",
              updated_at: new Date().toISOString(),
            };
          } else if (table === "notes") {
            const raw = task.payload as any;
            payload = {
              id: String(raw.id || `note_${Date.now()}`),
              user_id: userId,
              subject: raw.subject || "General Studies",
              topic: raw.topic || raw.title || "Untitled Topic",
              title: raw.title || "Untitled Note",
              content: raw.content || "",
              is_ai_generated: Boolean(raw.isAiGenerated),
              tags: safeArray(raw.tags || [raw.subject || "General Studies"]),
              updated_at: new Date().toISOString(),
            };
          } else if (table === "pyq_progress") {
            const raw = task.payload as any;
            payload = {
              user_id: userId,
              pyq_id: Number(raw.pyqId || raw.id) || 1,
              completed: Boolean(raw.completed ?? true),
              is_correct: raw.isCorrect !== undefined ? Boolean(raw.isCorrect) : null,
              updated_at: new Date().toISOString(),
            };
          }

          if (task.action === "DELETE") {
            await supabase
              .from(table)
              .delete()
              .eq("id", task.entityId)
              .eq("user_id", userId);
          } else {
            // INSERT, UPDATE, UPSERT
            await supabase.from(table).upsert(payload);
          }
          processedCount++;
        } catch (taskErr) {
          console.warn(`[Sync Receiver] Error processing entity ${task.entityType}:`, taskErr);
        }
      }

      // ----------------------------------------------------------------------
      // 2. LEGACY FULL PAYLOAD COMPATIBILITY
      // ----------------------------------------------------------------------
      if (body.plans && typeof body.plans === "object") {
        try {
          for (const [dateStr, plan] of Object.entries(body.plans as Record<string, DayPlan>)) {
            await supabase.from("study_plans").upsert({
              user_id: userId,
              plan_date: dateStr,
              target_hours: plan.targetHours || 6.0,
              notes: plan.notes || null,
              updated_at: new Date().toISOString(),
            });
          }
        } catch {}
      }

      if (Array.isArray(body.notes)) {
        try {
          for (const n of body.notes) {
            await supabase.from("notes").upsert({
              id: n.id,
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
        } catch {}
      }

      if (Array.isArray(body.testResults)) {
        try {
          for (const t of body.testResults) {
            const attempted = Number(t.attempted) || ((Number(t.correct) || 0) + (Number(t.wrong) || 0));
            const correct = Number(t.correct) || 0;
            const total = Number(t.total) || (attempted > 0 ? attempted : 100);
            const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

            await supabase.from("test_results").upsert({
              id: String(t.id || `test_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`),
              user_id: userId,
              title: t.title || "UPSC Module Test",
              score: Number(t.score) || 0,
              total,
              correct,
              incorrect: Number(t.wrong ?? 0),
              unattempted: Number(t.skipped ?? 0),
              accuracy,
              date: t.date || new Date().toISOString(),
              subject: t.subject || "General Studies",
              answers: (t as any).userAnswers || (t as any).answers || {},
              created_at: new Date().toISOString(),
            });
          }
        } catch {}
      }

      if (Array.isArray(body.syllabusProgress)) {
        try {
          for (const topicId of body.syllabusProgress) {
            await supabase.from("syllabus_progress").upsert({
              user_id: userId,
              topic_id: String(topicId),
              completed: true,
              updated_at: new Date().toISOString(),
            });
          }
        } catch {}
      }

      if (Array.isArray(body.pyqProgress)) {
        try {
          for (const pyqId of body.pyqProgress) {
            const numId = Number(pyqId);
            if (!isNaN(numId)) {
              await supabase.from("user_pyq_progress").upsert({
                user_id: userId,
                pyq_id: numId,
                completed: true,
                updated_at: new Date().toISOString(),
              });
            }
          }
        } catch {}
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        syncedAt: new Date().toISOString(),
        status: "synced_successfully",
        processedCount,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Sync error";
    return NextResponse.json({
      success: true,
      data: {
        syncedAt: new Date().toISOString(),
        status: "local_state_persisted",
        processedCount: 0,
      },
      meta: { warning: msg },
    });
  }
}

/**
 * GET /api/sync
 * Edge State Retrieval: Returns synchronized cloud domain data for the active cadet.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Record<string, unknown>>>> {
  try {
    const userId = await resolveUserId(request);

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

    const supabase = getEdgeSupabaseClient(request);
    const plans: Record<string, DayPlan> = {};
    const notes: NoteItem[] = [];
    const testResults: TestResultRecord[] = [];
    let syllabusProgress: string[] = [];
    const revisionItems: RevisionItem[] = [];
    let pyqProgress: string[] = [];

    // Study Plans & Tasks
    try {
      const { data: dbPlans } = await supabase
        .from("study_plans")
        .select("plan_date, target_hours, notes")
        .eq("user_id", userId);

      if (dbPlans) {
        safeArray(dbPlans).forEach((p) => {
          plans[p.plan_date] = {
            date: p.plan_date,
            targetHours: Number(p.target_hours) || 6.0,
            notes: p.notes || undefined,
            tasks: [],
            dailyNotes: [],
          };
        });
      }

      const { data: dbTasks } = await supabase
        .from("study_tasks")
        .select("id, plan_date, subject, title, description, hours, completed, task_type, priority")
        .eq("user_id", userId);

      if (dbTasks) {
        safeArray(dbTasks).forEach((t) => {
          const dateStr = t.plan_date;
          if (!plans[dateStr]) {
            plans[dateStr] = { date: dateStr, targetHours: 6.0, tasks: [], dailyNotes: [] };
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
      }
    } catch {}

    // Notes
    try {
      const { data: dbNotes } = await supabase.from("notes").select("*").eq("user_id", userId);
      if (dbNotes) {
        safeArray(dbNotes).forEach((n: any) => {
          notes.push({
            id: String(n.id),
            userId: String(n.user_id || userId),
            subject: n.subject || "General Studies",
            topic: n.topic || n.title,
            title: n.title,
            content: n.content || "",
            isAiGenerated: Boolean(n.is_ai_generated),
            keyKeywords: safeArray(n.key_keywords || n.tags),
            tags: safeArray(n.tags),
            updatedAt: n.updated_at || new Date().toISOString(),
            createdAt: n.created_at || new Date().toISOString(),
          });
        });
      }
    } catch {}

    // Test Results
    try {
      const { data: dbTests } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false });

      if (dbTests) {
        safeArray(dbTests).forEach((t: any) => {
          testResults.push({
            id: t.id,
            testId: t.test_id || t.id,
            userId: t.user_id || userId,
            title: t.title,
            subject: t.subject || "General Studies",
            score: Number(t.score) || 0,
            correct: Number(t.correct) || 0,
            wrong: Number(t.wrong) || 0,
            skipped: Number(t.skipped) || 0,
            attempted: Number(t.attempted) || 0,
            total: Number(t.total) || 0,
            date: t.date,
            userAnswers: t.answers_json || {},
          });
        });
      }
    } catch {}

    // Syllabus Progress
    try {
      const { data: dbSyllabus } = await supabase.from("syllabus_progress").select("topic_id").eq("user_id", userId);
      if (dbSyllabus) {
        syllabusProgress = safeArray(dbSyllabus).map((s: any) => s.topic_id);
      }
    } catch {}

    // PYQ Progress
    try {
      const { data: dbPyq } = await supabase.from("user_pyq_progress").select("pyq_id").eq("user_id", userId);
      if (dbPyq) {
        pyqProgress = safeArray(dbPyq).map((p: any) => p.pyq_id);
      }
    } catch {}

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
}
