"use client";

import { useEffect, useState } from "react";

const STATS = {
  totalIdeas: 105,
  totalFailures: 925,
  avgScore: 74,
  topCategory: "AI",
};

interface KpiCardProps {
  label: string;
  value: number | string;
  isNumeric: boolean;
  suffix?: string;
  delay: number;
}

function AnimatedNumber({
  target,
  delay,
  suffix = "",
}: {
  target: number;
  delay: number;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 1400;
      const start = performance.now();

      function tick(now: number) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
        const eased = 1 - (1 - progress) ** 3;
        setDisplay(Math.round(eased * target));
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timeout);
  }, [target, delay]);

  return (
    <span>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

function KpiCard({
  label,
  value,
  isNumeric,
  suffix = "",
  delay,
}: KpiCardProps) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2 transition-all duration-200"
      style={{
        backgroundColor: "#111113",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        className="text-3xl font-semibold tracking-tight tabular-nums"
        style={{
          fontFamily: "var(--font-geist-mono)",
          color: "rgba(255,255,255,0.95)",
        }}
      >
        {isNumeric ? (
          <AnimatedNumber
            target={value as number}
            delay={delay}
            suffix={suffix}
          />
        ) : (
          <span>{value}</span>
        )}
      </div>
      <p
        className="text-xs font-medium uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {label}
      </p>
    </div>
  );
}

export default function StatsStrip() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        label="Total Ideas Tracked"
        value={STATS.totalIdeas}
        isNumeric
        delay={0}
      />
      <KpiCard
        label="Failures Analyzed"
        value={STATS.totalFailures}
        isNumeric
        delay={100}
      />
      <KpiCard
        label="Avg Score This Week"
        value={STATS.avgScore}
        isNumeric
        suffix="/100"
        delay={200}
      />
      <KpiCard
        label="Top Category"
        value={STATS.topCategory}
        isNumeric={false}
        delay={300}
      />
    </div>
  );
}
