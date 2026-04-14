# DESIGN_SYSTEM_V2 — StartupSignal Mobile-First

**Vision:** The intelligence layer between "good idea" and "buildable startup"
**Priority:** Mobile-first. Everything must work on iPhone before desktop.

## Mobile-First Rules
- Base styles: mobile (<640px)
- sm: 640px+
- lg: 1024px+ (current desktop layout)
- All tap targets: min 44px height
- Bottom nav on mobile (4 icons: Dashboard, Ideas, Failures, Search)
- No horizontal scroll anywhere
- Cards stack: 1 col mobile → 2 col tablet → 3 col desktop

## Existing palette (keep, no rotation — nav fix was already requested)
- Background: #0A0A0B
- Surface: #111113
- Surface raised: #1A1A1D
- Accent purple (existing): keep for now
- **NEW: Validated/YC accent:** #059669 (emerald) — used only for YC-sourced ideas
- **Failure red:** #EF4444
- **Warning amber:** #F59E0B

## New Components Needed
- `BottomNav` — mobile only, fixed bottom, 4 items
- `IdeaCard` — mobile-friendly card (replaces table row on small screens)
- `ExecutionBrief` — collapsible panel with structured sections
- `LaunchabilityBadge` — compact score pill for mobile list views
- `TipBox` — special callout for the "accessible to you" tip at bottom of each brief

## Typography (unchanged)
- Headings: Space Grotesk
- Data/numbers: JetBrains Mono
- Body: Inter

## Execution Brief Structure
```
WHAT IT TAKES
├── Founding team
├── Realistic funding  
├── Time to first revenue
├── Core components (MVP)
├── Key risks
├── Why now
└── Path to profitability

TIP: [personalized note for solo founder with Next.js/Supabase/VPS stack]
```
