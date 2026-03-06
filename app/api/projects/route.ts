import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await supabase
    .from("projects")
    .select("id, challenge_id, kid_name, title, url, votes, created_at")
    .order("votes", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json({ error: "Failed to fetch projects." }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Body must be a JSON object." }, { status: 400 });
  }

  const { kid_name, title, url } = body as Record<string, unknown>;

  const errors: Record<string, string> = {};

  if (typeof kid_name !== "string" || !kid_name.trim()) {
    errors.kid_name = "kid_name is required.";
  } else if (/\s/.test(kid_name.trim())) {
    errors.kid_name = "kid_name must be a single word (first name only).";
  } else if (!/^[a-zA-Z'-]{1,30}$/.test(kid_name.trim())) {
    errors.kid_name = "kid_name must be 1–30 letters, hyphens, or apostrophes.";
  }

  if (typeof title !== "string" || !title.trim()) {
    errors.title = "title is required.";
  } else if (title.trim().length > 120) {
    errors.title = "title must be 120 characters or fewer.";
  }

  if (typeof url !== "string" || !url.trim()) {
    errors.url = "url is required.";
  } else {
    try {
      const parsed = new URL(url.trim());
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.url = "url must use http or https.";
      }
    } catch {
      errors.url = "url must be a valid URL.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Validation failed.", fields: errors }, { status: 422 });
  }

  const { data: challenge, error: chalError } = await supabase
    .from("challenges")
    .select("id")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (chalError || !challenge) {
    return NextResponse.json({ error: "No active challenge found." }, { status: 400 });
  }

  const { data: project, error: insertError } = await supabase
    .from("projects")
    .insert({
      challenge_id: challenge.id,
      kid_name: (kid_name as string).trim(),
      title: (title as string).trim(),
      url: (url as string).trim(),
      votes: 0,
    })
    .select()
    .single();

  if (insertError) {
    console.error("[POST /api/projects]", insertError);
    return NextResponse.json({ error: "Failed to save project." }, { status: 500 });
  }

  return NextResponse.json(project, { status: 201 });
}
