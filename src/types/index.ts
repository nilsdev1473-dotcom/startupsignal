// StartupSignal — single source of truth for all types
// No mock data. All data comes from Supabase via API routes.

export type FailureMode =
  | "PMF"
  | "Timing"
  | "Team"
  | "Market"
  | "Competition"
  | "UnitEconomics"
  | "Regulatory";

export type Category =
  | "AI"
  | "Fintech"
  | "Healthtech"
  | "Marketplace"
  | "ClimaTech"
  | "DevTools"
  | "Biotech"
  | "Other";

export interface ScoreDimensions {
  marketTiming: number;
  marketSize: number;
  competition: number;
  techReadiness: number;
  regulatoryRisk: number;
  executionDifficulty: number;
}

export interface GraveyardEntry {
  name: string;
  year: number;
  fundingRaised: string;
  failureMode: FailureMode;
  cause: string;
}

export interface StartupIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  launchabilityScore: number;
  scores: ScoreDimensions;
  source: string;
  failureGraveyard: GraveyardEntry[];
}

export interface FailedStartup {
  id: string;
  name: string;
  year: number;
  fundingRaised: string;
  timeToFailureMonths: number;
  failureMode: FailureMode;
  cause: string;
  postMortem: string;
  category: Category;
}
