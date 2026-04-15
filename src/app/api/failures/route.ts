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

  const failures = (data || []).map((row: Record<string, unknown>) => ({
    id: row.id,
    name: row.company_name,
    year: (row.year_failed as number) || 2020,
    fundingRaised: (row.funding_raised as string) || "Unknown",
    timeToFailureMonths: 36,
    failureMode: (row.failure_mode as string) || "PMF",
    cause: (row.post_mortem as string)?.slice(0, 100) || "No data available",
    postMortem: (row.post_mortem as string) || "",
    category: (row.category as string) || "Tech",
  }));

  return NextResponse.json({ failures });
}
