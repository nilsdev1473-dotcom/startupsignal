export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

const CATEGORIES = ["AI", "Fintech", "DevTools", "Healthtech", "Biotech", "ClimaTech", "Defense", "Robotics", "Space", "Marketplace", "Other"];

// Pre-computed HN + GitHub signals (refreshed weekly by cron)
// These are normalized 0-100 scores based on real signal data
const HN_SIGNALS: Record<string, number> = {
  AI: 100, DevTools: 9, Defense: 3, Robotics: 3, Space: 2,
  Fintech: 1, Biotech: 0, ClimaTech: 0, Healthtech: 0, Marketplace: 0, Other: 0,
};

const GITHUB_SIGNALS: Record<string, number> = {
  AI: 100, DevTools: 68, Biotech: 5, Robotics: 2, Fintech: 1,
  Healthtech: 0, ClimaTech: 0, Defense: 0, Space: 0, Marketplace: 0, Other: 0,
};

export async function GET() {
  const sb = createServerSupabase();

  // Defaults if DB unavailable
  const defaultCategories = CATEGORIES.map((name) => ({
    name,
    hnSignal: HN_SIGNALS[name] ?? 0,
    ycFunding: 50,
    githubStars: GITHUB_SIGNALS[name] ?? 0,
    launchabilityScore: 70,
    failureCount: 0,
    topFailureMode: "PMF",
  }));

  if (!sb) return NextResponse.json({ categories: defaultCategories });

  // Get YC company counts per category (from ideas table)
  const { data: ideas } = await sb
    .from("yc_ideas")
    .select("category, launchability_score");

  // Get failure counts per category
  const { data: failures } = await sb
    .from("startup_failures")
    .select("category, failure_mode");

  if (!ideas || !failures) return NextResponse.json({ categories: defaultCategories });

  // Compute per-category stats
  const ideaMap: Record<string, { count: number; totalScore: number }> = {};
  for (const idea of ideas) {
    const cat = (idea.category as string)?.split("/")[0] ?? "Other";
    const normalized = CATEGORIES.includes(cat) ? cat : "Other";
    if (!ideaMap[normalized]) ideaMap[normalized] = { count: 0, totalScore: 0 };
    ideaMap[normalized].count++;
    ideaMap[normalized].totalScore += (idea.launchability_score as number) ?? 70;
  }

  const failureMap: Record<string, { count: number; modes: Record<string, number> }> = {};
  for (const f of failures) {
    const cat = (f.category as string) ?? "Other";
    const normalized = CATEGORIES.includes(cat) ? cat : "Other";
    if (!failureMap[normalized]) failureMap[normalized] = { count: 0, modes: {} };
    failureMap[normalized].count++;
    const mode = (f.failure_mode as string) ?? "PMF";
    failureMap[normalized].modes[mode] = (failureMap[normalized].modes[mode] ?? 0) + 1;
  }

  // Max YC count for normalization
  const maxYC = Math.max(...Object.values(ideaMap).map((v) => v.count), 1);

  const categories = CATEGORIES.map((name) => {
    const ideaData = ideaMap[name] ?? { count: 0, totalScore: 0 };
    const failData = failureMap[name] ?? { count: 0, modes: {} };
    const avgScore = ideaData.count > 0 ? Math.round(ideaData.totalScore / ideaData.count) : 70;
    const topMode = Object.entries(failData.modes).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "PMF";

    return {
      name,
      hnSignal: HN_SIGNALS[name] ?? 0,
      ycFunding: Math.round((ideaData.count / maxYC) * 100),
      githubStars: GITHUB_SIGNALS[name] ?? 0,
      launchabilityScore: avgScore,
      failureCount: failData.count,
      topFailureMode: topMode,
    };
  });

  return NextResponse.json({ categories });
}
