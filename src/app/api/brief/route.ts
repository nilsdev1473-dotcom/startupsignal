export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

const BRIEF_API =
  process.env.BRIEF_API_URL ??
  "https://startupsignal-api.srv1453036.hstgr.cloud";
const BRIEF_API_KEY = process.env.BRIEF_API_KEY ?? "";

interface ExecutionBrief {
  founding_team: string;
  realistic_funding: string;
  time_to_revenue: string;
  core_components: string[];
  key_risks: string[];
  why_now: string;
  path_to_profitability: string;
  tip: string;
}

function isValidBrief(data: unknown): data is ExecutionBrief {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.founding_team === "string" &&
    typeof d.realistic_funding === "string" &&
    typeof d.time_to_revenue === "string" &&
    Array.isArray(d.core_components) &&
    Array.isArray(d.key_risks) &&
    typeof d.why_now === "string" &&
    typeof d.path_to_profitability === "string" &&
    typeof d.tip === "string"
  );
}

function vpsHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...(BRIEF_API_KEY ? { "X-API-Key": BRIEF_API_KEY } : {}),
  };
}

export async function POST(req: Request) {
  const body: unknown = await req.json();
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).idea_id !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { idea_id, title, description, category } = body as {
    idea_id: string;
    title: string;
    description: string;
    category: string;
  };

  // 1. Check Supabase — fast (220ms), has pre-generated briefs for all 15 ideas
  const sb = createServerSupabase();
  if (sb) {
    try {
      const { data: existing } = await sb
        .from("yc_ideas")
        .select("execution_brief")
        .eq("id", idea_id)
        .single();

      if (existing?.execution_brief && isValidBrief(existing.execution_brief)) {
        return NextResponse.json({
          brief: existing.execution_brief,
          cached: true,
          source: "supabase",
        });
      }
    } catch {
      // Supabase unavailable — fall through to VPS
    }
  }

  // 2. Supabase miss or unavailable — call VPS synchronously (Groq is fast, ~2s)
  // This generates AND caches, back-filling Supabase for next time
  try {
    const vpsResp = await fetch(`${BRIEF_API}/brief`, {
      method: "POST",
      headers: vpsHeaders(),
      body: JSON.stringify({ idea_id, title, description, category }),
      signal: AbortSignal.timeout(25000), // Groq takes ~2s, generous budget
    });

    if (vpsResp.ok) {
      const vpsData = (await vpsResp.json()) as {
        brief: unknown;
        cached?: boolean;
        source?: string;
      };
      if (isValidBrief(vpsData.brief)) {
        // Back-fill Supabase
        if (sb) {
          void sb
            .from("yc_ideas")
            .update({ execution_brief: vpsData.brief })
            .eq("id", idea_id);
        }
        return NextResponse.json({
          brief: vpsData.brief,
          cached: vpsData.cached ?? false,
          source: "vps",
        });
      }
    }
  } catch {
    // VPS call failed
  }

  return NextResponse.json({
    brief: null,
    error: "Brief generation failed — try again",
  });
}
