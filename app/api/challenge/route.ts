import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, difficulty, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json(null, { status: 200 });
    }
    console.error("[GET /api/challenge]", error);
    return NextResponse.json({ error: "Failed to fetch challenge." }, { status: 500 });
  }

  return NextResponse.json(data);
}
