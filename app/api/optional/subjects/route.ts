import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/supabase";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("optional_subjects")
      .select("*")
      .order("is_popular", { ascending: false });

    if (error || !data || data.length === 0) {
      // Fallback
      return NextResponse.json({
        success: true,
        data: [
          { id: "opt-psir", name: "Political Science & International Relations", code: "PSIR", is_popular: true, strategy_notes: "Highest overlap with GS-2. Theory and IR focus." },
          { id: "opt-sociology", name: "Sociology", code: "SOC", is_popular: true, strategy_notes: "Concise syllabus, high overlap with GS-1 Society and Essay." },
          { id: "opt-geography", name: "Geography", code: "GEO", is_popular: true, strategy_notes: "Scientific, high map scoring, GS-1 & GS-3 overlap." },
          { id: "opt-history", name: "History", code: "HIST", is_popular: true, strategy_notes: "Most stable syllabus, 100+ marks GS-1 overlap." },
          { id: "opt-pub-admin", name: "Public Administration", code: "PADM", is_popular: true, strategy_notes: "Deep synergy with GS-2 Governance and GS-4 Ethics." },
          { id: "opt-anthropology", name: "Anthropology", code: "ANTH", is_popular: true, strategy_notes: "Scoring biological section and tribal development overlap." },
          { id: "opt-philosophy", name: "Philosophy", code: "PHIL", is_popular: false, strategy_notes: "Concise syllabus, develops deep conceptual clarity for Ethics and Essay." },
          { id: "opt-economics", name: "Economics", code: "ECO", is_popular: false, strategy_notes: "Strong GS-3 overlap, rewarding for candidates with quantitative background." }
        ]
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}
