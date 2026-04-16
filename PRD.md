# StartupSignal v3 — PRD
_Version: 2026-04-16 | Status: APPROVED (verbal) | Owner: Nils Rousselet_

## Creative Vision
"Bloomberg Terminal for startup founders — dark, data-dense, every number earns its place"

## Problem
The current app has a split personality: hardcoded mock data living alongside real Supabase data, producing broken UI, fake momentum graphs, wrong schemas, and silent failures. The rebuild eliminates mock data entirely and builds a coherent real-data product.

## Target User
Solo technical founders evaluating which YC-validated idea to build next.

## Core Features (7 MVP stories)

### Story 0: Data Model (foundation — build first)
- Supabase schema reconciled: single source of truth
- `yc_ideas`: id, title, description, category, launchability_score, score_dimensions (jsonb), source, created_at
- `startup_failures`: id, company_name, year_failed, funding_raised, failure_mode (enum), category (enum), post_mortem
- Valid failure_mode enum: PMF | Timing | Team | Market | Competition | UnitEconomics | Regulatory
- Valid category enum: AI | Fintech | Healthtech | Marketplace | ClimaTech | DevTools | Biotech | Other
- Seed: 15 YC ideas (already in DB, fix categories) + 20 real failures (fix modes/categories)
- Delete data.ts mock file entirely — no fallback mock data

### Story 1: Ideas API + Type System
- `/api/ideas` returns all ideas with correct schema
- `/api/failures` returns all failures with correct schema
- Shared TypeScript types in `src/types/index.ts` — single source of truth
- No hardcoded fallback arrays anywhere in codebase
- Error states: show empty state UI, never silently fall back to stale mock data

### Story 2: Dashboard — Live Top 3
- HeroLeaderboard fetches from `/api/ideas` (top 3 by launchability_score)
- Each card: title, category badge, score, 3-sentence description, failure graveyard entries, ExecutionBrief
- Expand/collapse works — single expanded at a time
- Remove fake momentum graph entirely (replace with score breakdown radar: 6 dimensions as bars)
- Brief button uses real idea ID → Supabase cache → Groq fallback

### Story 3: Dashboard — YC Cards Clickable
- YC Validated Ideas grid: each card is clickable
- Click → expand inline panel with: full description, score breakdown, 2-3 relevant failures, ExecutionBrief
- No separate page needed — inline expand like the top 3 cards
- Shows LaunchabilityScore with 6 dimension breakdown (market timing, market size, competition, tech readiness, regulatory risk, execution difficulty)

### Story 4: Ideas Database Page (/ideas)
- Table/card view of all 15 ideas
- Sort by: score (default), category, alphabetical
- Search/filter by category
- Each row expandable: full detail + failures + brief
- Pagination if >20 ideas

### Story 5: Failure Library Page (/failures)
- Grid of all 20 failures
- Filter by: failure_mode, category
- Sort by: funding raised, year
- Each card expandable: full post-mortem text
- Failure Mode Distribution bar chart (real data from DB)
- Stats: most common failure mode, average funding burned, most dangerous category

### Story 6: Search Page (/search)
- Full-text search across ideas + failures
- Shows unified results with type badge (idea/failure)
- Minimum viable — just works

## Non-Goals
- User auth / accounts
- Real-time signal tracking (momentum stays removed)
- Scrapers / live data ingestion
- Mobile app

## Tech Stack
- Next.js 16, TypeScript strict, Tailwind CSS
- Supabase (existing project: vquzyxeovdniwayajpmo)
- Groq/Qwen3-32b for briefs (existing VPS service)
- Recharts for score breakdown only (dynamic import, per protocol)
- No Framer Motion

## Acceptance Criteria
- [ ] Zero references to `data.ts` mock arrays in any page/component
- [ ] All 15 ideas load from Supabase with correct types
- [ ] All 20 failures load from Supabase with correct types
- [ ] Expand/collapse works on all idea cards (dashboard + /ideas)
- [ ] Brief button works on all 15 ideas
- [ ] Failure Library shows 20 failures with correct failure modes
- [ ] No "Unknown error" on brief buttons
- [ ] Build passes: `npm run build` exits 0
- [ ] No TypeScript errors: `npx tsc --noEmit` exits 0

## Design System
- Background: #0A0A0B
- Surface: #111113
- Surface raised: #1A1A1D
- Accent: #10B981 (emerald — "signal green" for positive scores)
- Danger: #EF4444
- Warning: #F59E0B
- Text: rgba(255,255,255,0.95) primary, 0.60 secondary, 0.40 tertiary
- Border: rgba(255,255,255,0.08) default, 0.15 hover
- Font: Geist (already loaded)

## Estimated Build Time
4-6 hours (most logic exists, this is reconciliation + clean rebuild)
