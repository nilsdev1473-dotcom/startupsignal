"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  type Category,
  FAILURES,
  type FailedStartup,
  type FailureMode,
} from "@/lib/data";

const FAILURE_MODES: Array<FailureMode | "All"> = [
  "All",
  "PMF",
  "Timing",
  "Team",
  "Market",
  "Competition",
  "UnitEconomics",
  "Regulatory",
];

const CATEGORIES_FILTER: Array<Category | "All"> = [
  "All",
  "AI Devtools",
  "Fintech",
  "Healthtech",
  "Marketplace",
  "Climate",
  "Edtech",
];

const FAILURE_COLORS: Record<
  FailureMode,
  { bg: string; text: string; label: string }
> = {
  PMF: { bg: "rgba(239,68,68,0.12)", text: "#EF4444", label: "PMF" },
  Timing: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B", label: "Timing" },
  Team: { bg: "rgba(59,130,246,0.12)", text: "#3B82F6", label: "Team" },
  Market: { bg: "rgba(139,92,246,0.12)", text: "#8B5CF6", label: "Market" },
  Competition: {
    bg: "rgba(249,115,22,0.12)",
    text: "#F97316",
    label: "Competition",
  },
  UnitEconomics: {
    bg: "rgba(234,179,8,0.12)",
    text: "#EAB308",
    label: "Unit Economics",
  },
  Regulatory: {
    bg: "rgba(20,184,166,0.12)",
    text: "#14B8A6",
    label: "Regulatory",
  },
};

const CATEGORY_COLORS: Record<Category, string> = {
  "AI Devtools": "#8B5CF6",
  Fintech: "#3B82F6",
  Healthtech: "#10B981",
  Marketplace: "#F59E0B",
  Climate: "#34D399",
  Edtech: "#F472B6",
};

function FailureCard({ failure }: { failure: FailedStartup }) {
  const [open, setOpen] = useState(false);
  const fm = FAILURE_COLORS[failure.failureMode];
  const catColor = CATEGORY_COLORS[failure.category];
  const years = Math.floor(failure.timeToFailureMonths / 12);
  const months = failure.timeToFailureMonths % 12;

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
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span
                className="font-semibold text-sm"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                {failure.name}
              </span>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: fm.bg,
                  color: fm.text,
                  border: `1px solid ${fm.text}30`,
                }}
              >
                {fm.label}
              </span>
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: `${catColor}18`,
                  border: `1px solid ${catColor}40`,
                  color: catColor,
                }}
              >
                {failure.category}
              </span>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              {failure.cause}
            </p>
          </div>

          {/* Year + time-to-fail */}
          <div
            className="flex flex-col items-center justify-center rounded-xl shrink-0 px-3 py-2"
            style={{
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            <span
              className="text-base font-bold tabular-nums"
              style={{ fontFamily: "var(--font-geist-mono)", color: "#EF4444" }}
            >
              {failure.year}
            </span>
            <span
              className="text-[9px] mt-0.5 text-center"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              {years > 0 ? `${years}y ` : ""}
              {months > 0 ? `${months}m` : ""}
            </span>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold tabular-nums"
              style={{ fontFamily: "var(--font-geist-mono)", color: "#EF4444" }}
            >
              {failure.fundingRaised}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              raised before failure
            </span>
          </div>
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

      {/* Post-mortem */}
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
                Post-Mortem
              </p>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {failure.postMortem}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Failure mode distribution bar
function FailureStats() {
  const modeCounts = FAILURES.reduce<Record<string, number>>((acc, f) => {
    acc[f.failureMode] = (acc[f.failureMode] ?? 0) + 1;
    return acc;
  }, {});

  const total = FAILURES.length;

  return (
    <div
      className="rounded-xl p-4 mb-5"
      style={{
        backgroundColor: "#111113",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="text-[10px] uppercase tracking-widest mb-3"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        Failure Mode Distribution
      </p>
      <div className="flex flex-col gap-2">
        {(Object.entries(modeCounts) as [FailureMode, number][])
          .sort(([, a], [, b]) => b - a)
          .map(([mode, count]) => {
            const fm = FAILURE_COLORS[mode];
            const pct = Math.round((count / total) * 100);
            return (
              <div key={mode} className="flex items-center gap-3">
                <span
                  className="text-[10px] w-24 shrink-0"
                  style={{ color: fm.text }}
                >
                  {fm.label}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    style={{ backgroundColor: fm.text }}
                  />
                </div>
                <span
                  className="text-[10px] tabular-nums w-8 text-right shrink-0"
                  style={{
                    fontFamily: "var(--font-geist-mono)",
                    color: "rgba(255,255,255,0.4)",
                  }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default function FailureLibrary() {
  const [search, setSearch] = useState("");
  const [failureMode, setFailureMode] = useState<FailureMode | "All">("All");
  const [category, setCategory] = useState<Category | "All">("All");
  const [sort, setSort] = useState<"funding" | "year" | "ttf">("funding");

  const filtered = useMemo(() => {
    let list = [...FAILURES];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.cause.toLowerCase().includes(q) ||
          f.postMortem.toLowerCase().includes(q),
      );
    }
    if (failureMode !== "All")
      list = list.filter((f) => f.failureMode === failureMode);
    if (category !== "All") list = list.filter((f) => f.category === category);
    if (sort === "funding") {
      list.sort((a, b) => {
        const parseM = (s: string) =>
          parseFloat(s.replace(/[^0-9.]/g, "")) * (s.includes("B") ? 1000 : 1);
        return parseM(b.fundingRaised) - parseM(a.fundingRaised);
      });
    } else if (sort === "year") {
      list.sort((a, b) => b.year - a.year);
    } else {
      list.sort((a, b) => b.timeToFailureMonths - a.timeToFailureMonths);
    }
    return list;
  }, [search, failureMode, category, sort]);

  return (
    <div>
      <FailureStats />

      {/* Filters */}
      <div
        className="rounded-xl p-4 mb-5 flex flex-col gap-3"
        style={{
          backgroundColor: "#111113",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <input
          type="text"
          placeholder="Search failures…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm outline-none"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.9)",
          }}
        />

        <div className="flex flex-wrap gap-2">
          {/* Failure Mode */}
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-widest mr-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Mode:
            </span>
            {FAILURE_MODES.map((m) => {
              const fm = m !== "All" ? FAILURE_COLORS[m] : null;
              return (
                <button
                  type="button"
                  key={m}
                  onClick={() => setFailureMode(m)}
                  className="text-[10px] px-2 py-1 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      failureMode === m
                        ? fm
                          ? fm.bg
                          : "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.05)",
                    border: `1px solid ${failureMode === m ? (fm ? `${fm.text}50` : "rgba(255,255,255,0.3)") : "rgba(255,255,255,0.08)"}`,
                    color:
                      failureMode === m
                        ? fm
                          ? fm.text
                          : "rgba(255,255,255,0.8)"
                        : "rgba(255,255,255,0.45)",
                  }}
                >
                  {m === "All" ? "All" : (fm?.label ?? m)}
                </button>
              );
            })}
          </div>

          {/* Category */}
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className="text-[10px] uppercase tracking-widest mr-1"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Cat:
            </span>
            {CATEGORIES_FILTER.map((c) => {
              const cc = c !== "All" ? CATEGORY_COLORS[c] : null;
              return (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className="text-[10px] px-2 py-1 rounded-full transition-all"
                  style={{
                    backgroundColor:
                      category === c
                        ? cc
                          ? `${cc}22`
                          : "rgba(255,255,255,0.12)"
                        : "rgba(255,255,255,0.05)",
                    border: `1px solid ${category === c ? (cc ? `${cc}50` : "rgba(255,255,255,0.3)") : "rgba(255,255,255,0.08)"}`,
                    color:
                      category === c
                        ? (cc ?? "rgba(255,255,255,0.8)")
                        : "rgba(255,255,255,0.45)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1 ml-auto">
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Sort:
            </span>
            {(["funding", "year", "ttf"] as const).map((s) => (
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
                {s === "funding"
                  ? "$ Raised"
                  : s === "year"
                    ? "Year"
                    : "Time-to-fail"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          {filtered.length} failure{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {filtered.map((failure, i) => (
            <motion.div
              key={failure.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{
                duration: 0.25,
                delay: i * 0.025,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <FailureCard failure={failure} />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 text-center py-12 text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              No failures match your filters.
            </motion.p>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}
