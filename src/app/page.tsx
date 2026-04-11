"use client";

import HeroLeaderboard from "@/components/HeroLeaderboard";
import StatsStrip from "@/components/StatsStrip";

export default function Home() {
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
    </div>
  );
}
