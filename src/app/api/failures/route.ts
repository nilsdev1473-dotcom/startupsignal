export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

export async function GET() {
  const sb = createServerSupabase();
  if (!sb) {
    return NextResponse.json({ ideas: [], error: "No database connection" });
  }
  const { data, error } = await sb
    .from("startup_failures")
    .select("*")
    .order("year_failed", { ascending: false, nullsFirst: false })
    .limit(50);

  if (error) return NextResponse.json({ failures: [], error: error.message });

  const VALID_FAILURE_MODES = new Set(["PMF", "Timing", "Team", "Market", "Competition", "UnitEconomics", "Regulatory"]);
  const VALID_CATEGORIES = new Set(["AI Devtools", "Fintech", "Healthtech", "Marketplace", "Climate", "Edtech"]);

  const failures = (data || [])
    .filter((row: Record<string, unknown>) =>
      // Skip garbage rows without essential data
      typeof row.company_name === "string" &&
      row.company_name.length > 2 &&
      row.failure_mode !== null &&
      row.failure_mode !== undefined
    )
    .map((row: Record<string, unknown>) => {
      const rawMode = (row.failure_mode as string) || "PMF";
      const rawCat = (row.category as string) || "AI Devtools";
      return {
        id: row.id,
        name: row.company_name,
        year: (row.year_failed as number) || (row.year_founded as number) || 2020,
        fundingRaised: (row.funding_raised as string) || "Unknown",
        timeToFailureMonths: 36,
        failureMode: VALID_FAILURE_MODES.has(rawMode) ? rawMode : "PMF",
        cause: (row.post_mortem as string)?.slice(0, 120) || "No data available",
        postMortem: (row.post_mortem as string) || "",
        category: VALID_CATEGORIES.has(rawCat) ? rawCat : "AI Devtools",
      };
    });

  return NextResponse.json({ failures });
}
