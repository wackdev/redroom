import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/supabase";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("newspaper_clips")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ success: true, data: [] });
  }
}
