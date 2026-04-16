// data.ts — legacy shim. All real data comes from Supabase via API routes.
// Types re-exported from src/types for backward compatibility with existing imports.

export type {
  Category,
  FailedStartup,
  FailureMode,
  GraveyardEntry,
  ScoreDimensions,
  StartupIdea,
} from "@/types";

// Empty arrays — components must fetch from API, not import these
// These exist only to prevent TypeScript errors on any lingering direct imports
export const IDEAS: import("@/types").StartupIdea[] = [];
export const FAILURES: import("@/types").FailedStartup[] = [];

// Stats interface (used by some components)
export interface Stats {
  totalIdeas: number;
  totalFailures: number;
  avgScore: number;
  topCategory: string;
}
