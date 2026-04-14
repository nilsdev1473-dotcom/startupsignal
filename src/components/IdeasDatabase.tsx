"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  type Category,
  IDEAS,
  type Source,
  type StartupIdea,
  type Trend,
} from "@/lib/data";

const SOURCE_COLORS: Record<Source, string> = {
  YC: "#F59E0B",
  Techstars: "#3B82F6",
  "500": "#8B5CF6",
  Antler: "#10B981",
};

const CATEGORY_COLORS: Record<Category, string> = {
  "AI Devtools": "#8B5CF6",
  Fintech: "#3B82F6",
  Healthtech: "#10B981",
  Marketplace: "#F59E0B",
  Climate: "#34D399",
  Edtech: "#F472B6",
};

const CATEGORIES: Array<Category | "All"> = [
  "All",
  "AI Devtools",
  "Fintech",
  "Healthtech",
  "Marketplace",
  "Climate",
  "Edtech",
];

const SOURCES: Array<Source | "All"> = [
  "All",
  "YC",
  "Techstars",
  "500",
  "Antler",
];
const TRENDS: Array<Trend | "All"> = ["All", "up", "down", "stable"];

const scoreColor = (score: number) => {
  if (score >= 80) return "#10B981";
  if (score >= 70) return "#F59E0B";
  return "#EF4444";
};

const trendLabel = (t: Trend) =>
  ({ up: "↑ Rising", down: "↓ Falling", stable: "→ Stable" })[t];

function IdeaCard({ idea }: { idea: StartupIdea }) {
  const [open, setOpen] = useState(false);
  const catColor = CATEGORY_COLORS[idea.category];
  const srcColor = SOURCE_COLORS[idea.source];
  const sc = scoreColor(idea.launchabilityScore);

  return (
    <motion.div
      layout
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{
        backgroundColor: "#111113",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onClick={() => setOpen((v) => !v)}
      whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
      transition={{ duration: 0.15 }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className="font-semibold text-sm"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                {idea.title}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${catColor}18`,
                  border: `1px solid ${catColor}40`,
                  color: catColor,
                }}
              >
                {idea.category}
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: `${srcColor}18`, color: srcColor }}
              >
                {idea.source}
              </span>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {idea.description}
            </p>
          </div>

          {/* Score */}
          <div
            className="flex flex-col items-center justify-center rounded-xl shrink-0 w-14 h-14"
            style={{ backgroundColor: `${sc}12`, border: `1px solid ${sc}35` }}
          >
            <span
              className="text-xl font-bold tabular-nums leading-none"
              style={{ fontFamily: "var(--font-geist-mono)", color: sc }}
            >
              {idea.launchabilityScore}
            </span>
            <span
              className="text-[9px] mt-0.5 uppercase tracking-wider"
              style={{ color: `${sc}99` }}
            >
              score
            </span>
          </div>
        </div>

        {/* Mini score strip */}
        <div className="grid grid-cols-6 gap-1.5 mb-3">
          {Object.entries(idea.scores).map(([key, val]) => (
            <div key={key} className="flex flex-col gap-1">
              <div
                className="h-1 rounded-full overflow-hidden"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: `${val}%`, backgroundColor: scoreColor(val) }}
                />
              </div>
              <span
                className="text-[9px] truncate"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {
                  key
                    .replace(/([A-Z])/g, " $1")
                    .trim()
                    .split(" ")[0]
                }
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{
              color:
                idea.trend === "up"
                  ? "#10B981"
                  : idea.trend === "down"
                    ? "#EF4444"
                    : "#F59E0B",
            }}
          >
            {trendLabel(idea.trend)}
          </span>
          <motion.span
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.25)" }}
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </div>
      </div>

      {/* Expanded: graveyard */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div
              className="px-5 pb-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p
                className="text-[10px] uppercase tracking-widest pt-4 mb-2"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Failure Graveyard
              </p>
              {idea.failureGraveyard.length === 0 ? (
                <p
                  className="text-xs"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  No known failures in this space yet.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {idea.failureGraveyard.map((g) => (
                    <div
                      key={g.name}
                      className="rounded-lg px-3 py-2 text-xs"
                      style={{
                        backgroundColor: "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}
                    >
                      <span
                        className="font-semibold"
                        style={{ color: "#EF4444" }}
                      >
                        {g.name}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>
                        {" "}
                        · {g.year} · {g.fundingRaised} ·{" "}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.55)" }}>
                        {g.cause}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function IdeasDatabase({
  ideas: ideasProp,
}: {
  ideas?: StartupIdea[];
} = {}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "All">("All");
  const [source, setSource] = useState<Source | "All">("All");
  const [trend, setTrend] = useState<Trend | "All">("All");
  const [sort, setSort] = useState<"score" | "alpha">("score");

  const filtered = useMemo(() => {
    let list = [...(ideasProp ?? IDEAS)];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q),
      );
    }
    if (category !== "All") list = list.filter((i) => i.category === category);
    if (source !== "All") list = list.filter((i) => i.source === source);
    if (trend !== "All") list = list.filter((i) => i.trend === trend);
    if (sort === "score")
      list.sort((a, b) => b.launchabilityScore - a.launchabilityScore);
    else list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [search, category, source, trend, sort, ideasProp]);

  return (
    <div>
      {/* Filters */}
      <div
        className="rounded-xl p-4 mb-5 flex flex-col gap-3"
        style={{
          backgroundColor: "#111113",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder="Search ideas…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.9)",
          }}
        />

        {/* Filter pills row */}
        <div className="flex flex-wrap gap-2">
          {/* Category */}
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-widest mr-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Cat:
            </span>
            {CATEGORIES.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setCategory(c)}
                className="text-[10px] px-2 py-1 rounded-full transition-all"
                style={{
                  backgroundColor:
                    category === c
                      ? "rgba(139,92,246,0.25)"
                      : "rgba(255,255,255,0.05)",
                  border: `1px solid ${category === c ? "rgba(139,92,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                  color: category === c ? "#8B5CF6" : "rgba(255,255,255,0.5)",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Source */}
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-widest mr-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Src:
            </span>
            {SOURCES.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSource(s)}
                className="text-[10px] px-2 py-1 rounded-full transition-all"
                style={{
                  backgroundColor:
                    source === s
                      ? "rgba(59,130,246,0.25)"
                      : "rgba(255,255,255,0.05)",
                  border: `1px solid ${source === s ? "rgba(59,130,246,0.5)" : "rgba(255,255,255,0.08)"}`,
                  color: source === s ? "#3B82F6" : "rgba(255,255,255,0.5)",
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Trend */}
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-widest mr-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Trend:
            </span>
            {TRENDS.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTrend(t)}
                className="text-[10px] px-2 py-1 rounded-full transition-all"
                style={{
                  backgroundColor:
                    trend === t
                      ? "rgba(16,185,129,0.25)"
                      : "rgba(255,255,255,0.05)",
                  border: `1px solid ${trend === t ? "rgba(16,185,129,0.5)" : "rgba(255,255,255,0.08)"}`,
                  color: trend === t ? "#10B981" : "rgba(255,255,255,0.5)",
                }}
              >
                {t === "All" ? "All" : trendLabel(t as Trend)}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 ml-auto">
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Sort:
            </span>
            {(["score", "alpha"] as const).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setSort(s)}
                className="text-[10px] px-2 py-1 rounded transition-all"
                style={{
                  backgroundColor:
                    sort === s ? "rgba(255,255,255,0.1)" : "transparent",
                  color:
                    sort === s
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.35)",
                }}
              >
                {s === "score" ? "Score" : "A–Z"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {filtered.length} idea{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Cards */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((idea, i) => (
            <motion.div
              key={idea.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                duration: 0.25,
                delay: i * 0.03,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <IdeaCard idea={idea} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 text-center py-12 text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              No ideas match your filters.
            </motion.p>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
