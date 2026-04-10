"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import MarketHeatingChartDynamic from "@/components/charts/MarketHeatingChartDynamic";
import FailureGraveyard from "@/components/FailureGraveyard";
import type { StartupIdea } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IdeaCardProps {
  idea: StartupIdea;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}

// ─── Rank badge colors ────────────────────────────────────────────────────────

const rankConfig: Record<number, { bg: string; text: string; border: string }> =
  {
    1: {
      bg: "bg-amber-500/15",
      text: "text-amber-400",
      border: "border-amber-500/30",
    },
    2: {
      bg: "bg-slate-400/15",
      text: "text-slate-300",
      border: "border-slate-400/30",
    },
    3: {
      bg: "bg-amber-700/15",
      text: "text-amber-600",
      border: "border-amber-700/30",
    },
  };

const defaultRank = {
  bg: "bg-white/10",
  text: "text-white/60",
  border: "border-white/20",
};

// ─── Source badge colors ──────────────────────────────────────────────────────

const sourceColors: Record<string, string> = {
  YC: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Techstars: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "500": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Antler: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

// ─── Category badge ───────────────────────────────────────────────────────────

const categoryColors: Record<string, string> = {
  "AI Devtools": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Fintech: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Healthtech: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  Marketplace: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Climate: "bg-green-500/10 text-green-400 border-green-500/20",
  Edtech: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

// ─── Score bar color ──────────────────────────────────────────────────────────

function scoreBarColor(score: number): string {
  if (score > 70) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-500";
  return "bg-red-500";
}

// ─── Score dimension labels ───────────────────────────────────────────────────

const scoreDimensions: Array<{
  key: keyof StartupIdea["scores"];
  label: string;
}> = [
  { key: "marketTiming", label: "Market Timing" },
  { key: "marketSize", label: "Market Size" },
  { key: "competition", label: "Competition" },
  { key: "techReadiness", label: "Tech Readiness" },
  { key: "executionComplexity", label: "Execution" },
  { key: "failureRisk", label: "Failure Risk" },
];

// ─── Business plan summary (first 2 sentences) ───────────────────────────────

function twoSentenceSummary(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, 2).join(" ").trim();
}

// ─── Trend badge ──────────────────────────────────────────────────────────────

function TrendBadge({ trend }: { trend: StartupIdea["trend"] }) {
  const config = {
    up: { icon: "↑", color: "text-emerald-400 bg-emerald-500/10" },
    down: { icon: "↓", color: "text-red-400 bg-red-500/10" },
    stable: { icon: "→", color: "text-white/40 bg-white/[0.06]" },
  }[trend];

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${config.color}`}
    >
      {config.icon}
      <span className="sr-only">{trend}</span>
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function IdeaCard({ idea, rank, isExpanded, onToggle }: IdeaCardProps) {
  const rc = rankConfig[rank] ?? defaultRank;
  const srcClass =
    sourceColors[idea.source] ?? "bg-white/10 text-white/60 border-white/20";
  const catClass =
    categoryColors[idea.category] ??
    "bg-white/10 text-white/40 border-white/20";
  const summary = twoSentenceSummary(idea.description);

  return (
    <motion.div
      layout
      className={[
        "bg-[#111113] border border-white/[0.08] rounded-2xl p-6",
        "hover:border-white/20 transition-all duration-200",
        "flex flex-col gap-4",
        isExpanded ? "border-white/15" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ── Card header ── */}
      <div className="flex flex-col gap-4">
        {/* Top row: rank + score */}
        <div className="flex items-start justify-between gap-3">
          {/* Rank badge */}
          <span
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full border text-sm font-bold tabular-nums shrink-0 ${rc.bg} ${rc.text} ${rc.border}`}
          >
            #{rank}
          </span>

          {/* Score */}
          <div className="flex items-baseline gap-1 shrink-0">
            <span
              className="font-mono text-5xl font-semibold tabular-nums leading-none"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              {idea.launchabilityScore}
            </span>
            <span className="text-base text-white/40 font-mono">/100</span>
          </div>
        </div>

        {/* Title + description */}
        <div>
          <h3 className="text-xl font-semibold text-white leading-tight mb-1">
            {idea.title}
          </h3>
          <p className="text-sm text-white/60 leading-snug line-clamp-2">
            {idea.description}
          </p>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <TrendBadge trend={idea.trend} />
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${srcClass}`}
          >
            {idea.source}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${catClass}`}
          >
            {idea.category}
          </span>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center justify-center gap-1.5 w-full rounded-xl py-2 text-sm font-medium text-white/60 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white/90 transition-all duration-150"
        >
          {isExpanded ? (
            <>
              Hide Details <ChevronUp size={14} />
            </>
          ) : (
            <>
              View Details <ChevronDown size={14} />
            </>
          )}
        </button>
      </div>

      {/* ── Expanded panel ── */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-6 pt-2">
              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* ── Score bars ── */}
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                  Score Breakdown
                </h4>
                <div className="flex flex-col gap-2.5">
                  {scoreDimensions.map(({ key, label }) => {
                    const val = idea.scores[key];
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="w-32 shrink-0 text-xs text-white/60 leading-tight">
                          {label}
                        </span>
                        <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${scoreBarColor(val)}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{
                              duration: 0.5,
                              ease: "easeOut",
                              delay: 0.1,
                            }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs font-mono tabular-nums text-white/60">
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Business plan summary ── */}
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
                  Business Case
                </h4>
                <p className="text-sm text-white/70 leading-relaxed">
                  {summary}
                </p>
              </div>

              {/* ── Market heating chart ── */}
              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                  Signal Momentum (12 Weeks)
                </h4>
                <MarketHeatingChartDynamic weeklyScores={idea.weeklyScores} />
              </div>

              {/* ── Failure graveyard ── */}
              {idea.failureGraveyard.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">
                    Failure Graveyard
                  </h4>
                  <FailureGraveyard failures={idea.failureGraveyard} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default IdeaCard;
