# StartupSignal — Intelligence Dashboard Features PRD
_Version: 2026-04-17 | Status: APPROVED | Owner: Nils Rousselet_

## Creative Vision
"CIA tactical ops center meets startup intelligence — dark, alive, purposeful"

## Design System
- Background: `#050507` (deeper than current — true ops terminal black)
- Surface: `#0D0F14`
- Cards: `#111318`
- Accent Cold: `#0D1B3E` (deep navy — low signal)
- Accent Warm: `#10B981` (emerald — opportunity signal)
- Accent Hot: `#F59E0B` (amber — high competition warning)
- Accent Danger: `#EF4444` (red — saturated/dead zone)
- Map Cyan: `#00D4FF` (electric cyan — borders, glow)
- Timeline Purple: `#7C3AED` (deep violet — historical)
- Timeline Orange: `#F97316` (recent failures)
- Scanlines: `rgba(0, 255, 136, 0.025)` (subtle CRT effect overlay)
- Grid: `rgba(255, 255, 255, 0.035)`
- Font: Space Grotesk (headings) + Geist Mono (numbers/data)

## Layout Structure (new /intelligence page)
```
┌─────────────────────────────────────────────┐
│  OPPORTUNITY TERRAIN  │  GLOBAL INTEL MAP   │
│  (Canvas 2D, 50%)     │  (SVG World, 50%)   │
│  h-[420px]            │  h-[420px]          │
├─────────────────────────────────────────────┤
│         FAILURE TIMELINE (100% width)        │
│         h-[220px]                            │
└─────────────────────────────────────────────┘
```

## Stories

### Story 0: Route + Shell (foundation)
- New page: `/intelligence`
- Add "Intelligence" nav link to sidebar and BottomNav
- Shell component with scanline overlay, grid background, section headers
- No data yet — just layout

### Story 1: Opportunity Terrain (left panel)
Tech: Raw Canvas 2D API, `requestAnimationFrame`, NO recharts, NO framer-motion
- Animated terrain: 11 categories across X axis (AI, Fintech, DevTools, Healthtech, Biotech, ClimaTech, Defense, Robotics, Space, Marketplace, Other)
- Each category has 3 sub-columns: HN signal, YC funding, GitHub stars
- Height = normalized score (0-100 → 0-200px)
- Color gradient: `#0D1B3E` (0) → `#10B981` (50) → `#F59E0B` (80) → `#EF4444` (100)
- Terrain connects with smooth bezier curves between peaks (like the vector heatmap image)
- Slow animation: terrain pulses/breathes (sinusoidal height modulation ±3px, 4s cycle)
- Radar sweep: thin scanline moves left→right continuously
- Hover: nearest category highlights, tooltip shows: category, score, HN count, YC count
- Click: emits `categorySelected` event, filters timeline + map

Data source: `/api/intelligence/signals` (new API route, computes from DB)

### Story 2: Global Intelligence Map (right panel)
Tech: `react-simple-maps` + `d3-geo`, SVG, NO Mapbox, NO Google Maps
- World map, dark projection (Robinson or NaturalEarth1)
- Country fills: near-black `#0A0B0F` default
- Hot zones: colored by VC density for selected category (hardcoded per category, realistic)
- Country borders: `rgba(0, 212, 255, 0.25)` electric cyan, thin
- Hot countries pulse with glow: `box-shadow` equivalent via SVG filter `feGlow`
- City dots: top 5 hub cities for selected category, pulsing circle animation
- City labels: monospace, small, positioned carefully
- Filters (toggle pills above map):
  - VC Density (default)
  - Market Size
  - Talent Pool  
  - Regulatory Friendliness
- When idea is pinned from cards below: map auto-switches to that idea's category
- Tooltip on hover: country name, score for current filter, top VC firms there

Category → top cities mapping (hardcoded, researched):
```
AI: SF(100), London(85), Beijing(80), Tel Aviv(75), Berlin(70), Singapore(65)
Fintech: NYC(100), London(90), Singapore(85), Dubai(70), São Paulo(65), Berlin(60)
Defense: DC/VA(100), Tel Aviv(90), London(80), Stockholm(70), Sydney(60)
Biotech: Boston(100), SF(95), Basel(85), Singapore(75), London(70)
ClimaTech: SF(90), Berlin(85), London(80), Amsterdam(75), Copenhagen(70)
Space: FL/TX(100), Luxembourg(80), UAE(70), London(65), NZ(60)
DevTools: SF(95), Berlin(80), Amsterdam(75), remote(global)
Healthtech: Boston(90), SF(85), London(80), Stockholm(75), Singapore(70)
Robotics: Boston(95), SF(90), Tokyo(85), Munich(80), Shenzhen(75)
Marketplace: NYC(90), London(85), Berlin(80), Singapore(75), Sydney(65)
```

### Story 3: Failure Timeline (full width)
Tech: Raw SVG in React, no recharts
- Horizontal timeline: 2010 → 2026
- Each failure = a dot placed at (year, random Y jitter within band)
- Color by failure_mode: PMF=#EF4444, Competition=#F97316, Timing=#3B82F6, UnitEconomics=#8B5CF6, Regulatory=#06B6D4, Market=#EC4899, Team=#10B981
- Size by funding_raised proxy: Unknown=3px, small(<$10M)=5px, medium=7px, large=10px
- Background: deep purple-black with scattered star-points (static SVG circles, random positions)
- Category filter: clicking a category in terrain → dims all other category dots to 10% opacity
- Hover dot → card appears: company name, year, category, failure mode, cause (first 100 chars)
- Year labels along bottom axis: monospace font
- "Wave" effect: on filter change, dots fade/unfade with 300ms CSS transition

### Story 4: Pin System
- "Pin idea" button on each idea card (📍 icon)
- Pinned idea stored in localStorage
- When pinned: map switches to that idea's category, shows "Analyzing: [Idea Title]" header
- Intelligence page shows pinned idea context at top: title, score, category
- Clear pin button

### Story 5: Intelligence API Route
New: `/api/intelligence/signals`
Returns computed signals by category:
```typescript
{
  categories: [{
    name: string,
    hnSignal: number,      // HN mentions/30d normalized 0-100
    ycFunding: number,     // YC company count normalized 0-100
    githubStars: number,   // GitHub stars normalized 0-100
    launchabilityScore: number,
    failureCount: number,
    topFailureMode: string,
  }]
}
```
Reads from Supabase yc_ideas + startup_failures, computes fresh.

## Tech Stack
- Canvas terrain: `useRef` + raw Canvas 2D, `requestAnimationFrame`
- World map: `react-simple-maps`, `d3-geo` — install via npm
- Timeline: Raw SVG JSX
- Pin state: `localStorage` + React context
- All charts: `"use client"` + `dynamic({ ssr: false })` per protocol

## Non-Goals
- Real-time data (refreshes on page load only)
- User accounts / saved preferences on server
- Mobile layout for intelligence page (desktop-only, noted in UI)

## Acceptance Criteria
- [ ] `/intelligence` page loads without errors
- [ ] Terrain animates — categories visible as peaks
- [ ] Hover terrain → tooltip appears with correct data
- [ ] World map renders — countries colored
- [ ] Top 5 cities visible as pulsing dots for selected category
- [ ] Timeline shows all 925 failures as dots
- [ ] Hover a dot → company card appears
- [ ] Category filter on terrain → dims other dots on timeline
- [ ] Pin button on idea cards works → map updates
- [ ] `npm run build` exits 0
- [ ] `npx tsc --noEmit` exits 0
