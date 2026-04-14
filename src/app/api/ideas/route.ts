import { NextResponse } from "next/server";
import { IDEAS } from "@/lib/data";
import { createServerSupabase } from "@/lib/supabase";

export async function GET() {
  const sb = createServerSupabase();
  const { data, error } = await sb
    .from("startup_ideas")
    .select("*")
    .order("launchability_score", { ascending: false, nullsFirst: false })
    .limit(100);

  if (error || !data || data.length === 0) {
    // Fallback to mock data
    return NextResponse.json({ ideas: IDEAS });
  }

  const ideas = data.map((row: Record<string, unknown>) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    source: row.source,
    launchabilityScore: (row.launchability_score as number) || 50,
    scores: (row.scores as object) || {
      marketTiming: 50,
      marketSize: 50,
      competition: 50,
      techReadiness: 50,
      executionComplexity: 50,
      failureRisk: 50,
    },
    trend: (row.trend as string) || "stable",
    weeklyScores: (row.weekly_scores as number[]) || [],
    failureGraveyard: (row.failure_graveyard as unknown[]) || [],
  }));

  return NextResponse.json({ ideas });
}
