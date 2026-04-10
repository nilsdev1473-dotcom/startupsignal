# DESIGN_SYSTEM.md — StartupSignal

**Vision:** Bloomberg Terminal meets startup graveyard — dark, data-dense, premium intelligence

## Colors
- Background: `#0A0A0B`
- Surface: `#111113`
- Surface raised: `#1A1A1D`
- Border: `rgba(255,255,255,0.08)`
- Text primary: `rgba(255,255,255,0.95)`
- Text secondary: `rgba(255,255,255,0.6)`
- Text tertiary: `rgba(255,255,255,0.4)`
- Accent green (success/high score): `#10B981`
- Accent amber (warning/medium): `#F59E0B`
- Accent red (danger/failure): `#EF4444`
- Accent blue (info/neutral): `#3B82F6`
- Accent purple (premium/highlight): `#8B5CF6`

## Typography
- Font: `Geist` (built-in with Next.js)
- Mono: `Geist Mono` for numbers and scores
- Headings: font-semibold, tracking-tight
- Numbers in dashboards: tabular-nums, Geist Mono

## Spacing
- Base: 4px grid
- Card padding: 24px
- Section gap: 32px
- Sidebar width: 240px (collapsed: 64px)

## Components
- Cards: `bg-[#111113] border border-white/8 rounded-xl p-6`
- Glass: `backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl`
- Score badge: radial gradient background, large mono number
- Category badges: pill shape, colored border matching failure type
- Hover: `transition-all duration-200 hover:border-white/15 hover:shadow-lg`

## Motion
- Enter: `y: 12px → 0, opacity: 0 → 1`
- Stagger: `40ms` between siblings
- Spring: `damping: 25, stiffness: 350`
- Expand: `layout` animation with `AnimatePresence`
- Score count-up: `useSpring` from framer-motion

## Charts (MANDATORY — Recharts Protocol)
1. Every chart component in its own file with `"use client"`
2. Import via `next/dynamic({ ssr: false })`
3. Parent must have explicit pixel height (`h-[250px]` or `h-[300px]`)
4. Never percentage-only heights on ResponsiveContainer parents
5. Always set explicit `interval` on XAxis
