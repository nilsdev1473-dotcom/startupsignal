export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

// VPS brief service — persistent, no serverless timeout
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

function apiHeaders(): Record<string, string> {
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

  // 1. Check Supabase cache (when service key is valid)
  const sb = createServerSupabase();
  if (sb) {
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
  }

  // 2. Check VPS local cache (fast — always works regardless of Supabase key)
  try {
    const vpsRead = await fetch(
      `${BRIEF_API}/brief/${encodeURIComponent(idea_id)}`,
      {
        headers: apiHeaders(),
        signal: AbortSignal.timeout(8000),
      },
    );
    if (vpsRead.ok) {
      const vpsData = (await vpsRead.json()) as {
        brief: unknown;
        cached: boolean;
      };
      if (vpsData.cached && isValidBrief(vpsData.brief)) {
        // Back-fill Supabase if possible
        if (sb) {
          void sb
            .from("yc_ideas")
            .update({ execution_brief: vpsData.brief })
            .eq("id", idea_id);
        }
        return NextResponse.json({
          brief: vpsData.brief,
          cached: true,
          source: "vps",
        });
      }
    }
  } catch {
    // VPS cache read failed — continue to trigger
  }

  // 3. Cache miss on both — trigger async generation on VPS (returns immediately)
  try {
    const trigger = await fetch(`${BRIEF_API}/brief/trigger`, {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({ idea_id, title, description, category }),
      signal: AbortSignal.timeout(10000),
    });
    if (!trigger.ok) {
      throw new Error(`VPS trigger returned ${trigger.status}`);
    }
  } catch {
    return NextResponse.json({
      brief: null,
      error: "Brief service unavailable — try again shortly",
      pending: true,
    });
  }

  // 4. Triggered successfully — tell frontend to poll in ~2 minutes
  return NextResponse.json({
    brief: null,
    pending: true,
    message: "Brief generating — ready in ~2 minutes. Check back soon.",
  });
}
