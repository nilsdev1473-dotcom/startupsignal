# StartupSignal — Data Strategy & Implementation Plan
_Version: 2026-04-17 | Research basis: Kimi + Perplexity reports_

---

## Reality Check: What's Actually Free

Based on research, the paid/free line is clear:

| Source | Reality |
|--------|---------|
| Crunchbase API | $12K+/yr minimum. **NOT viable.** |
| Dealroom API | €37.5K+/yr. **NOT viable.** |
| Harmonic.ai | $25K+/yr. **NOT viable.** |
| PitchBook | $70K+/yr. **NOT viable.** |
| CB Insights | $40K+/yr for bulk. **NOT viable.** |
| **YC OSS API** | **Free, no auth, 5,690 companies, 45 batches** |
| **HN Algolia API** | **Free, 10k req/hr, real-time** |
| **SEC EDGAR** | **Free, real-time, Form D filings** |
| **GitHub Search API** | **Free with token (we have it)** |
| **YC official API** | **Free, no auth, all companies** |

---

## Architecture: Three-Layer Data Model

### Layer 1 — Ideas (What to Consider Building)
Sources that tell us what spaces are worth entering.

| Source | What it gives | Cadence | Tables |
|--------|--------------|---------|--------|
| YC RFS (scraped quarterly) | Top-down thesis: what YC WANTS to fund | Quarterly | `signal_sources` |
| YC W/S batch companies (YC OSS API) | What's actually being funded now | Each batch | `market_ideas` |
| HN Algolia "Ask HN" + Show HN | Bottom-up: what builders are working on | Weekly | `signal_sources` |
| GitHub trending topics | Tech momentum by category | Weekly | `market_signals` |

### Layer 2 — Failures (What to Learn From)
Sources that give us real failure data with causes.

| Source | Volume | Access | Tables |
|--------|--------|--------|--------|
| YC Inactive companies (YC OSS API) | ~800+ dead YC cos | Free API | `startup_failures` |
| HN post-mortems (Algolia search) | 200-500 posts | Free API | `startup_failures` |
| Failory HTML scrape | 400+ | ScrapingBee | `startup_failures` |

### Layer 3 — Signals (How Hot Is This Category Now)
Sources that give momentum scores we can compute.

| Source | Signal | Cadence |
|--------|--------|---------|
| HN mentions per category per week | Developer mindshare | Weekly |
| YC batch company count by category | VC conviction proxy | Per batch |
| GitHub stars/week by topic | Tech adoption | Weekly |

---

## Supabase Schema (Extended)

### New tables needed:

```sql
-- Extended ideas table (rename/extend yc_ideas → market_ideas)
CREATE TABLE market_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,                    -- our normalized category
  source TEXT NOT NULL,             -- 'yc_rfs', 'yc_batch', 'hn_trending', 'github_trending'
  source_url TEXT,
  launchability_score INTEGER,      -- 0-100, null until calculated
  score_dimensions JSONB,           -- {marketTiming, marketSize, competition, techReadiness...}
  failure_graveyard JSONB,          -- array of related failures
  hn_mention_count INTEGER DEFAULT 0,  -- HN mentions last 30 days
  yc_company_count INTEGER DEFAULT 0,  -- YC companies in this space
  github_star_velocity INTEGER DEFAULT 0, -- avg weekly stars in this space
  momentum_score NUMERIC(5,2),      -- computed: (hn + yc + github) normalized
  raw_data JSONB,                   -- original source payload
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extended failures table
ALTER TABLE startup_failures
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS source_url TEXT,
  ADD COLUMN IF NOT EXISTS yc_batch TEXT,
  ADD COLUMN IF NOT EXISTS yc_slug TEXT,
  ADD COLUMN IF NOT EXISTS raw_data JSONB,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- Market signals (raw momentum data before aggregation)
CREATE TABLE market_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  signal_type TEXT NOT NULL,        -- 'hn_mention', 'yc_funding', 'github_trending'
  signal_value NUMERIC,
  signal_date DATE NOT NULL,
  source TEXT,
  raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Source tracking (what we've ingested)
CREATE TABLE ingestion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  run_at TIMESTAMPTZ DEFAULT NOW(),
  records_added INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ok',         -- 'ok', 'error', 'partial'
  error_msg TEXT
);
```

---

## Implementation Phases

### Phase 1 — Data flood from free APIs (TODAY, 2-3 hours)
No scraping. Pure API calls. Immediate high-volume results.

**1A: YC OSS — Pull all inactive companies as failures**
- Endpoint: `https://yc-oss.github.io/api/companies/all.json`
- Filter: `status === 'Inactive'`
- Expected: ~800+ failed YC companies
- Fields: name, description, batch → infer year_failed, category

**1B: YC Batch companies W24/S24/F24/W25/S25/F25/W26 as ideas**
- Latest 5-6 batches = current market map
- Group by industry tag → category clusters
- Count by category = YC conviction signal

**1C: HN Algolia — Trending topics by search volume**
- Search for key terms by category, count mentions last 30/90 days
- Categories: "AI agents", "defense tech", "climate infrastructure", "biotech", "stablecoins", "robotics", "space", "developer tools"
- Result: HN momentum score per category

### Phase 2 — Scraping (next session, 2-3 hours)
**2A: Failory** — ScrapingBee scrape of 400+ failure cards
**2B: YC RFS Spring 2026** — ScrapingBee + Groq extraction of new thesis areas
**2C: HN post-mortems** — Algolia search "failed startup" + "post-mortem" → structured extraction via Groq

### Phase 3 — Automated pipelines (n8n, scheduled)
**3A: Weekly YC batch monitor** — New companies added since last run
**3B: Weekly HN momentum** — Category mention counts refreshed weekly
**3C: Monthly YC RFS check** — Detect new batch release
**3D: Failure intake** — Any YC company that goes Inactive → auto-add to failures

---

## Category Taxonomy (Final)

Aligned to both YC industry tags and our app:

| Our Category | YC Industry Tags | HN Keywords |
|-------------|-----------------|-------------|
| AI | artificial-intelligence, generative-ai, ai-assistant | "AI agents", "LLM", "foundation model" |
| Fintech | fintech, banking-and-exchange, payments, defi | "stablecoin", "fintech", "neobank" |
| Healthtech | healthcare, diagnostics, drug-discovery | "healthtech", "biotech", "longevity" |
| Biotech | drug-discovery-and-delivery, therapeutics, genomics | "drug discovery", "CRISPR", "biotech" |
| ClimaTech | climate, energy, renewable-energy | "climate tech", "clean energy", "carbon" |
| DevTools | engineering-product-and-design, infrastructure | "developer tools", "devtools", "SDK" |
| Defense | defense, drones, aerospace | "defense tech", "dual-use", "military AI" |
| Robotics | manufacturing-and-robotics, drones, autonomous | "robotics", "physical AI", "autonomous" |
| Space | aviation-and-space, satellites, rocketry | "space tech", "satellite", "launch" |
| Marketplace | consumer, marketplace, retail | "marketplace", "platform", "two-sided" |
| Other | everything else | — |

---

## LaunchabilityScore Algorithm (Real, Computed)

Instead of manual assignment:

```
LaunchabilityScore = weighted average of:
  marketTiming     (30%) = HN_momentum_score for this category (0-100)
  marketSize       (25%) = manually set per category (TAM proxy)
  competition      (20%) = INVERSE of yc_company_count in space (more = harder)
  techReadiness    (15%) = github_star_velocity for related topics (0-100)
  regulatoryRisk   (5%)  = manually set per category
  executionDiff    (5%)  = manually set per category
```

This makes scores real and defensible, updating weekly as HN/GitHub data refreshes.

---

## Files to Build

1. `/root/agent-factory/scripts/ingest-yc-companies.py` — Pull all YC companies, split into ideas + failures
2. `/root/agent-factory/scripts/ingest-hn-signals.py` — Weekly HN mention counts by category
3. `/root/agent-factory/scripts/compute-scores.py` — Recalculate LaunchabilityScore for all ideas
4. n8n workflow: "Weekly StartupSignal Refresh" (runs all 3 in sequence, Sunday 9am UTC)
