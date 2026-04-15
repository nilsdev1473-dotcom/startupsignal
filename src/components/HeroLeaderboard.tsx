"use client";

import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { IDEAS } from "@/lib/data";

// Top 3 ideas sorted by launchabilityScore descending
const TOP_IDEAS = [...IDEAS]
  .sort((a, b) => b.launchabilityScore - a.launchabilityScore)
  .slice(0, 3);

const delayClasses = ["fade-in-up-1", "fade-in-up-2", "fade-in-up-3"];

export function HeroLeaderboard() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function handleToggle(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <section className="w-full">
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-white/95 mb-1.5">
          This Week&apos;s Top Signals
        </h2>
        <p className="text-sm text-white/50">
          The highest-conviction startup ideas ranked by LaunchabilityScore —
          timing, market, tech, and execution risk distilled into one number.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {TOP_IDEAS.map((idea, index) => (
          <div key={idea.id} className={delayClasses[index] ?? "fade-in-up"}>
            <IdeaCard
              idea={idea}
              rank={index + 1}
              isExpanded={expandedId === idea.id}
              onToggle={() => handleToggle(idea.id)}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeroLeaderboard;
