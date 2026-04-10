"use client";

import { useState } from "react";
import FailureLibrary from "@/components/FailureLibrary";
import HeroLeaderboard from "@/components/HeroLeaderboard";
import IdeasDatabase from "@/components/IdeasDatabase";
import StatsStrip from "@/components/StatsStrip";

type Tab = "dashboard" | "ideas" | "failures";

const TABS: { id: Tab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "ideas", label: "Ideas Database" },
  { id: "failures", label: "Failure Library" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

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

        {/* Tab navigation */}
        <div
          className="flex items-center gap-1 mb-6 px-1 py-1 rounded-xl"
          style={{
            backgroundColor: "#111113",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative"
              style={{
                color:
                  activeTab === tab.id
                    ? "rgba(255,255,255,0.95)"
                    : "rgba(255,255,255,0.45)",
                backgroundColor:
                  activeTab === tab.id
                    ? "rgba(139,92,246,0.15)"
                    : "transparent",
                borderBottom:
                  activeTab === tab.id
                    ? "2px solid #8B5CF6"
                    : "2px solid transparent",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "dashboard" && <HeroLeaderboard />}
          {activeTab === "ideas" && <IdeasDatabase />}
          {activeTab === "failures" && <FailureLibrary />}
        </div>
      </div>
    </div>
  );
}
