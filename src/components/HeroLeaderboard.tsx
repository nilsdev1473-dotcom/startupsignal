"use client";

import { useEffect, useState } from "react";
import ExecutionBrief from "@/components/ExecutionBrief";
import type { StartupIdea } from "@/types";

const FAILURE_MODE_COLORS: Record<string, string> = {
  PMF: "#EF4444",
  Competition: "#F59E0B",
  Timing: "#3B82F6",
  UnitEconomics: "#8B5CF6",
  Market: "#EC4899",
  Regulatory: "#06B6D4",
  Team: "#10B981",
};

const SCORE_DIMS = [
  { key: "marketTiming", label: "Market Timing" },
  { key: "marketSize", label: "Market Size" },
  { key: "competition", label: "Competition" },
  { key: "techReadiness", label: "Tech Readiness" },
  { key: "regulatoryRisk", label: "Regulatory Risk" },
  { key: "executionDifficulty", label: "Execution" },
] as const;

function ScoreBars({ scores }: { scores: StartupIdea["scores"] }) {
  return (
    <div className="space-y-2 mt-3">
      {SCORE_DIMS.map(({ key, label }) => {
        const val = scores[key] ?? 70;
        return (
          <div key={key} className="flex items-center gap-2">
            <span
              className="text-[10px] w-28 shrink-0"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {label}
            </span>
            <div
              className="flex-1 h-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${val}%`, background: "#10B981" }}
              />
            </div>
            <span
              className="text-[10px] w-6 text-right"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              {val}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function IdeaCard({
  idea,
  rank,
  isExpanded,
  onToggle,
}: {
  idea: StartupIdea;
  rank: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{
        background: "#111113",
        border: `1px solid ${isExpanded ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-5 py-4 flex items-start gap-3"
        style={{ cursor: "pointer" }}
      >
        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
          style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}
        >
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3
              className="text-sm font-semibold truncate"
              style={{ color: "rgba(255,255,255,0.95)" }}
            >
              {idea.title}
            </h3>
            <span
              className="text-sm font-bold shrink-0"
              style={{ color: "#10B981" }}
            >
              {idea.launchabilityScore}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.5)",
              }}
            >
              {idea.category}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {idea.source === "yc_rfs" ? "YC RFS" : idea.source}
            </span>
          </div>
        </div>
        <span
          className="shrink-0 mt-1 text-sm"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          {isExpanded ? "▲" : "▼"}
        </span>
      </button>

      <p
        className="px-5 pb-4 text-xs leading-relaxed"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {idea.description.slice(0, 140)}
        {idea.description.length > 140 ? "…" : ""}
      </p>

      {/* Expanded panel */}
      {isExpanded && (
        <div
          className="border-t px-5 py-4 space-y-5"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {/* Score breakdown */}
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-1"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Score Breakdown
            </p>
            <ScoreBars scores={idea.scores} />
          </div>

          {/* Failure Graveyard */}
          {idea.failureGraveyard.length > 0 && (
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Failure Graveyard
              </p>
              <div className="space-y-2">
                {idea.failureGraveyard.slice(0, 3).map((entry, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-3 px-3 py-2 rounded-lg"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className="text-xs font-medium"
                          style={{ color: "rgba(255,255,255,0.8)" }}
                        >
                          {entry.name}
                        </span>
                        <span
                          className="text-[10px]"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                        >
                          {entry.year}
                        </span>
                      </div>
                      <p
                        className="text-[11px] leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                      >
                        {entry.cause}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[10px] px-2 py-0.5 rounded font-medium"
                      style={{
                        background: `${FAILURE_MODE_COLORS[entry.failureMode] ?? "#6B7280"}20`,
                        color:
                          FAILURE_MODE_COLORS[entry.failureMode] ?? "#9CA3AF",
                      }}
                    >
                      {entry.failureMode}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Execution Brief */}
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-2"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Execution Brief
            </p>
            <ExecutionBrief
              ideaId={idea.id}
              title={idea.title}
              description={idea.description}
              category={idea.category}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl p-5 animate-pulse"
      style={{
        background: "#111113",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex gap-3 mb-3">
        <div
          className="w-7 h-7 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div className="flex-1 space-y-2">
          <div
            className="h-4 rounded w-3/4"
            style={{ background: "rgba(255,255,255,0.06)" }}
          />
          <div
            className="h-3 rounded w-1/3"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <div
          className="h-3 rounded"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="h-3 rounded w-5/6"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
        <div
          className="h-3 rounded w-4/6"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />
      </div>
    </div>
  );
}

export function HeroLeaderboard() {
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data: { ideas?: StartupIdea[] }) => {
        const top3 = (data.ideas ?? [])
          .sort((a, b) => b.launchabilityScore - a.launchabilityScore)
          .slice(0, 3);
        setIdeas(top3);
      })
      .catch(() => setIdeas([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full">
      <div className="mb-6">
        <h2
          className="text-xl font-semibold tracking-tight mb-1"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          Top Signals This Week
        </h2>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
          Highest-conviction YC-validated ideas ranked by LaunchabilityScore.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {loading
          ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          : ideas.map((idea, idx) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                rank={idx + 1}
                isExpanded={expandedId === idea.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === idea.id ? null : idea.id))
                }
              />
            ))}
      </div>
    </section>
  );
}

export default HeroLeaderboard;
