"use client";

import { useEffect, useState } from "react";
import HeroLeaderboard from "@/components/HeroLeaderboard";
import StatsStrip from "@/components/StatsStrip";
import type { StartupIdea } from "@/lib/data";

export default function Home() {
  const [ycIdeas, setYcIdeas] = useState<StartupIdea[]>([]);

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((data) => {
        if (data.ideas) {
          const filtered = (data.ideas as StartupIdea[]).filter(
            (idea) => (idea.source as string) === "yc_rfs",
          );
          setYcIdeas(filtered);
        }
      })
      .catch(() => {
        // leave empty — section hidden if no yc_rfs ideas available
      });
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0A0B" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
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

        {/* Dashboard content */}
        <HeroLeaderboard />
      </div>

      {/* YC Validated Ideas section */}
      {ycIdeas.length > 0 && (
        <div
          style={{ padding: "0 24px 32px", maxWidth: 1152, margin: "0 auto" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "rgba(255,255,255,0.9)",
              }}
            >
              YC Validated Ideas
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 99,
                background: "rgba(5,150,105,0.15)",
                border: "1px solid rgba(5,150,105,0.4)",
                color: "#059669",
                letterSpacing: "0.08em",
              }}
            >
              FROM YC RFS
            </span>
          </div>
          <p
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.45)",
              marginBottom: 20,
            }}
          >
            Ideas Y Combinator has publicly stated they want to fund. Real
            validated demand, waiting for the right team.
          </p>
          {/* Card grid - 1 col mobile, 2 col tablet, 3 col desktop */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {ycIdeas.map((idea) => (
              <div
                key={idea.id}
                style={{
                  background: "#111113",
                  border: "1px solid rgba(5,150,105,0.2)",
                  borderRadius: 12,
                  padding: 20,
                  transition: "border-color 0.2s",
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
                    }}
                  >
                    {idea.title}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: "rgba(5,150,105,0.1)",
                      color: "#059669",
                      border: "1px solid rgba(5,150,105,0.3)",
                      marginLeft: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {idea.category}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.5)",
                    lineHeight: 1.6,
                    marginBottom: 12,
                  }}
                >
                  {idea.description?.slice(0, 140)}...
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}
                  >
                    YC Request for Startups
                  </span>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#059669",
                      fontFamily: "monospace",
                    }}
                  >
                    {idea.launchabilityScore}/100
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
