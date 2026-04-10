"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { IdeaCard } from "@/components/IdeaCard";
import { IDEAS } from "@/lib/data";

// Top 3 ideas sorted by launchabilityScore descending
const TOP_IDEAS = [...IDEAS]
  .sort((a, b) => b.launchabilityScore - a.launchabilityScore)
  .slice(0, 3);

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {TOP_IDEAS.map((idea, index) => (
          <motion.div key={idea.id} variants={cardVariants}>
            <IdeaCard
              idea={idea}
              rank={index + 1}
              isExpanded={expandedId === idea.id}
              onToggle={() => handleToggle(idea.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default HeroLeaderboard;
