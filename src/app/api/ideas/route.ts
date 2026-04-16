export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import type { FailureMode, GraveyardEntry, StartupIdea } from "@/types";

const VALID_MODES = new Set<FailureMode>([
  "PMF",
  "Timing",
  "Team",
  "Market",
  "Competition",
  "UnitEconomics",
  "Regulatory",
]);

export async function GET() {
  const sb = createServerSupabase();
  if (!sb) {
    return NextResponse.json({ ideas: [], error: "No database connection" });
  }

  const { data, error } = await sb
    .from("yc_ideas")
    .select("*")
    .order("launchability_score", { ascending: false });

  if (error) {
    return NextResponse.json({ ideas: [], error: error.message });
  }

  const ideas: StartupIdea[] = (data || []).map((row) => {
    const dims = (row.score_dimensions as Record<string, number>) ?? {};
    const scores = {
      marketTiming: dims.marketTiming ?? dims.market_timing ?? 70,
      marketSize: dims.marketSize ?? dims.market_size ?? 70,
      competition: dims.competition ?? 70,
      techReadiness: dims.techReadiness ?? dims.tech_readiness ?? 70,
      regulatoryRisk: dims.regulatoryRisk ?? dims.regulatory_risk ?? 70,
      executionDifficulty:
        dims.executionDifficulty ?? dims.execution_difficulty ?? 70,
    };

    // Build failure graveyard from linked failures if present
    const graveyard: GraveyardEntry[] = [];
    const rawGraveyard = row.failure_graveyard as unknown;
    if (Array.isArray(rawGraveyard)) {
      for (const g of rawGraveyard as Record<string, unknown>[]) {
        const mode = String(
          g.failureMode ?? g.failure_mode ?? "PMF",
        ) as FailureMode;
        graveyard.push({
          name: String(g.name ?? g.company_name ?? "Unknown"),
          year: Number(g.year ?? g.year_failed ?? 2020),
          fundingRaised: String(
            g.fundingRaised ?? g.funding_raised ?? "Unknown",
          ),
          failureMode: VALID_MODES.has(mode) ? mode : "PMF",
          cause: String(g.cause ?? g.post_mortem ?? "").slice(0, 120),
        });
      }
    }

    return {
      id: String(row.id),
      title: String(row.title ?? ""),
      description: String(row.description ?? ""),
      category: String(row.category ?? "AI"),
      launchabilityScore: Number(
        row.launchability_score ?? row.launchabilityScore ?? 70,
      ),
      scores,
      source: String(row.source ?? "yc_rfs"),
      failureGraveyard: graveyard,
    };
  });

  return NextResponse.json({ ideas });
}
