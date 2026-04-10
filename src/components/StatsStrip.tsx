"use client";

import { animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { STATS } from "@/lib/data";

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
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const controls = animate(motionVal, target, {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, delay, motionVal]);

  useEffect(() => {
    return rounded.on("change", (v) => setDisplay(v));
  }, [rounded]);

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
