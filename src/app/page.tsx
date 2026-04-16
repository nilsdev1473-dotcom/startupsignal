"use client";

import { useEffect, useState } from "react";
import ExecutionBrief from "@/components/ExecutionBrief";
import HeroLeaderboard from "@/components/HeroLeaderboardDynamic";
import StatsStrip from "@/components/StatsStripDynamic";
import type { StartupIdea } from "@/types";

const SCORE_DIMS = [
  { key: "marketTiming" as const, label: "Market Timing" },
  { key: "marketSize" as const, label: "Market Size" },
  { key: "competition" as const, label: "Competition" },
  { key: "techReadiness" as const, label: "Tech Readiness" },
  { key: "regulatoryRisk" as const, label: "Regulatory Risk" },
  { key: "executionDifficulty" as const, label: "Execution" },
];

function YCIdeaCard({ idea }: { idea: StartupIdea }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: "#111113",
        border: `1px solid ${expanded ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 12,
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      {/* Card header — always visible */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: 20,
          cursor: "pointer",
          background: "transparent",
          border: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.4,
              flex: 1,
              marginRight: 8,
            }}
          >
            {idea.title}
          </span>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 99,
                background: "rgba(16,185,129,0.1)",
                color: "#10B981",
                border: "1px solid rgba(16,185,129,0.25)",
              }}
            >
              {idea.category}
            </span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>
              {expanded ? "▲" : "▼"}
            </span>
          </div>
        </div>
        <p
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
            marginBottom: 12,
            textAlign: "left",
          }}
        >
          {idea.description.slice(0, 140)}
          {idea.description.length > 140 ? "…" : ""}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
            YC Request for Startups
          </span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#10B981",
              fontFamily: "monospace",
            }}
          >
            {idea.launchabilityScore}/100
          </span>
        </div>
      </button>

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: 20 }}
        >
          {/* Full description */}
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.7,
              marginBottom: 20,
            }}
          >
            {idea.description}
          </p>

          {/* Score breakdown */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 10,
            }}
          >
            Score Breakdown
          </p>
          <div style={{ marginBottom: 20 }}>
            {SCORE_DIMS.map(({ key, label }) => {
              const val = idea.scores[key] ?? 70;
              return (
                <div
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      width: 110,
                      flexShrink: 0,
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {label}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: 4,
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 2,
                        width: `${val}%`,
                        background: "#10B981",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      width: 24,
                      textAlign: "right",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    {val}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Execution Brief */}
          <p
            style={{
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: 8,
            }}
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
      )}
    </div>
  );
}

export default function Home() {
  const [ycIdeas, setYcIdeas] = useState<StartupIdea[]>([]);

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data: { ideas?: StartupIdea[] }) => {
        if (data.ideas) {
          setYcIdeas(data.ideas.filter((idea) => idea.source === "yc_rfs"));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0B" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1
            className="text-3xl font-semibold tracking-tight mb-1"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            StartupSignal
          </h1>
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            AI-powered incubator intelligence
          </p>
        </div>

        {/* Stats strip */}
        <div className="mb-8">
          <StatsStrip />
        </div>

        {/* Top 3 hero leaderboard */}
        <div className="mb-12">
          <HeroLeaderboard />
        </div>

        {/* YC Validated Ideas grid */}
        {ycIdeas.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h2
                className="text-lg font-semibold"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                YC Validated Ideas
              </h2>
              <span
                style={{
                  fontSize: 10,
                  padding: "2px 8px",
                  borderRadius: 99,
                  fontWeight: 600,
                  background: "rgba(16,185,129,0.1)",
                  color: "#10B981",
                  border: "1px solid rgba(16,185,129,0.25)",
                }}
              >
                FROM YC RFS
              </span>
            </div>
            <p
              className="text-sm mb-6"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Ideas Y Combinator has publicly stated they want to fund. Click
              any card to see full analysis and execution brief.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 16,
              }}
            >
              {ycIdeas.map((idea) => (
                <YCIdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
