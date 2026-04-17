"use client";

import { useEffect, useState, useCallback } from "react";
import OpportunityTerrain from "@/components/intelligence/OpportunityTerrainDynamic";
import GlobalIntelMap from "@/components/intelligence/GlobalIntelMapDynamic";
import FailureTimeline from "@/components/intelligence/FailureTimelineDynamic";
import type { FailedStartup } from "@/types";

interface CategorySignal {
  name: string;
  hnSignal: number;
  ycFunding: number;
  githubStars: number;
  launchabilityScore: number;
  failureCount: number;
  topFailureMode: string;
}

export default function IntelligencePage() {
  const [categories, setCategories] = useState<CategorySignal[]>([]);
  const [failures, setFailures] = useState<FailedStartup[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pinnedIdea, setPinnedIdea] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // Load pinned idea from localStorage
    const pinned = localStorage.getItem("startupsignal_pinned_idea");
    if (pinned) setPinnedIdea(pinned);

    // Fetch signals
    fetch("/api/intelligence/signals")
      .then((r) => r.json())
      .then((d: { categories?: CategorySignal[] }) => {
        if (d.categories) setCategories(d.categories);
      })
      .catch(() => {});

    // Fetch failures
    fetch("/api/failures")
      .then((r) => r.json())
      .then((d: { failures?: FailedStartup[] }) => {
        if (d.failures) setFailures(d.failures);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Animated status ticker
  useEffect(() => {
    const i = setInterval(() => setTick((t) => (t + 1) % 4), 800);
    return () => clearInterval(i);
  }, []);

  const handleCategorySelect = useCallback((cat: string | null) => {
    setSelectedCategory(cat);
  }, []);

  const dots = [".", "..", "...", ""];

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: "#050507",
        backgroundImage: `
          linear-gradient(rgba(0,212,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,212,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      {/* CRT scanline overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.025) 3px, rgba(0,0,0,0.025) 4px)",
        }}
      />

      {/* Top status bar */}
      <div
        className="flex items-center justify-between px-6 py-2 border-b"
        style={{ borderColor: "rgba(0,212,255,0.12)", background: "rgba(5,5,7,0.95)" }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#00FF88" }} />
            <span className="text-[9px] font-bold tracking-widest" style={{ color: "rgba(0,255,136,0.8)", fontFamily: "monospace" }}>
              ARGUS INTEL SYS v2.0
            </span>
          </div>
          <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
            MARKET INTELLIGENCE TERMINAL
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[9px]" style={{ color: "rgba(0,212,255,0.5)", fontFamily: "monospace" }}>
            {categories.length} SECTORS TRACKED
          </span>
          <span className="text-[9px]" style={{ color: "rgba(0,212,255,0.5)", fontFamily: "monospace" }}>
            {failures.length} FAILURES INDEXED
          </span>
          {selectedCategory && (
            <span className="text-[9px] px-2 py-0.5 rounded" style={{
              background: "rgba(245,158,11,0.15)",
              color: "rgba(245,158,11,0.9)",
              border: "1px solid rgba(245,158,11,0.3)",
              fontFamily: "monospace",
            }}>
              FILTER: {selectedCategory.toUpperCase()}
            </span>
          )}
          {loading && (
            <span className="text-[9px]" style={{ color: "rgba(0,212,255,0.4)", fontFamily: "monospace" }}>
              LOADING{dots[tick]}
            </span>
          )}
        </div>
      </div>

      {/* Main two-panel layout */}
      <div className="flex" style={{ height: "430px", borderBottom: "1px solid rgba(0,212,255,0.08)" }}>
        {/* LEFT — Opportunity Terrain */}
        <div
          className="relative border-r"
          style={{
            width: "50%",
            borderColor: "rgba(0,212,255,0.1)",
            background: "rgba(5,5,7,0.8)",
          }}
        >
          {loading && categories.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-[10px]" style={{ color: "rgba(0,212,255,0.4)", fontFamily: "monospace" }}>
                LOADING SIGNAL DATA{dots[tick]}
              </span>
            </div>
          ) : (
            <OpportunityTerrain
              categories={categories}
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          )}
        </div>

        {/* RIGHT — Global Intel Map */}
        <div
          className="relative"
          style={{
            width: "50%",
            background: "rgba(3,4,10,0.9)",
          }}
        >
          <GlobalIntelMap
            selectedCategory={selectedCategory}
            pinnedIdea={pinnedIdea}
          />
        </div>
      </div>

      {/* BOTTOM — Failure Timeline */}
      <div
        style={{
          background: "rgba(5,5,7,0.95)",
          borderTop: "1px solid rgba(0,212,255,0.08)",
        }}
      >
        {failures.length > 0 ? (
          <FailureTimeline
            failures={failures}
            selectedCategory={selectedCategory}
          />
        ) : (
          <div className="flex items-center justify-center" style={{ height: 220 }}>
            <span className="text-[10px]" style={{ color: "rgba(0,212,255,0.3)", fontFamily: "monospace" }}>
              LOADING FAILURE DATABASE{dots[tick]}
            </span>
          </div>
        )}
      </div>

      {/* Bottom status bar */}
      <div
        className="flex items-center justify-between px-6 py-2"
        style={{ borderTop: "1px solid rgba(0,212,255,0.08)", background: "rgba(5,5,7,0.98)" }}
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: "#EF4444" }} />
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>SATURATED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: "#F59E0B" }} />
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>HOT</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: "#10B981" }} />
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>OPPORTUNITY</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-sm" style={{ background: "#3B82F6" }} />
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>COLD</span>
          </div>
        </div>
        <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.15)", fontFamily: "monospace" }}>
          DATA: YC OSS API · HN ALGOLIA · GITHUB · SUPABASE · REFRESHED WEEKLY
        </div>
      </div>
    </div>
  );
}
