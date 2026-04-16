export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";
import type { Category, FailedStartup, FailureMode } from "@/types";

const VALID_MODES = new Set<FailureMode>([
  "PMF",
  "Timing",
  "Team",
  "Market",
  "Competition",
  "UnitEconomics",
  "Regulatory",
]);
const VALID_CATS = new Set<Category>([
  "AI",
  "Fintech",
  "Healthtech",
  "Marketplace",
  "ClimaTech",
  "DevTools",
  "Biotech",
  "Other",
]);

export async function GET() {
  const sb = createServerSupabase();
  if (!sb) {
    return NextResponse.json({ failures: [], error: "No database connection" });
  }

  const { data, error } = await sb
    .from("startup_failures")
    .select("*")
    .not("failure_mode", "is", null)
    .not("company_name", "is", null)
    .order("year_failed", { ascending: false, nullsFirst: false });

  if (error) {
    return NextResponse.json({ failures: [], error: error.message });
  }

  const failures: FailedStartup[] = (data || [])
    .filter(
      (row) =>
        typeof row.company_name === "string" && row.company_name.length > 2,
    )
    .map((row) => {
      const rawMode = String(row.failure_mode ?? "PMF") as FailureMode;
      const rawCat = String(row.category ?? "Other") as Category;
      return {
        id: String(row.id),
        name: String(row.company_name),
        year: Number(row.year_failed ?? row.year_founded ?? 2020),
        fundingRaised: String(row.funding_raised ?? "Unknown"),
        timeToFailureMonths: Number(row.time_to_failure_months ?? 36),
        failureMode: VALID_MODES.has(rawMode) ? rawMode : "PMF",
        cause: String(row.post_mortem ?? "").slice(0, 120),
        postMortem: String(row.post_mortem ?? ""),
        category: VALID_CATS.has(rawCat) ? rawCat : "Other",
      };
    });

  return NextResponse.json({ failures });
}
