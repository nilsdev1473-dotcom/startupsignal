"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
} from "recharts";

interface RadarScoreChartProps {
  scores: {
    marketTiming: number;
    marketSize: number;
    competition: number;
    techReadiness: number;
    executionComplexity: number;
    failureRisk: number;
  };
}

const LABELS: Record<keyof RadarScoreChartProps["scores"], string> = {
  marketTiming: "Market Timing",
  marketSize: "Market Size",
  competition: "Competition",
  techReadiness: "Tech Readiness",
  executionComplexity: "Execution",
  failureRisk: "Failure Risk",
};

export default function RadarScoreChart({ scores }: RadarScoreChartProps) {
  const data = (
    Object.keys(scores) as Array<keyof RadarScoreChartProps["scores"]>
  ).map((key) => ({
    subject: LABELS[key],
    value: scores[key],
    fullMark: 100,
  }));

  return (
    <RadarChart
      width={300}
      height={300}
      data={data}
      margin={{ top: 10, right: 20, bottom: 10, left: 20 }}
    >
      <PolarGrid stroke="rgba(255,255,255,0.1)" gridType="polygon" />
      <PolarAngleAxis
        dataKey="subject"
        tick={{
          fill: "rgba(255,255,255,0.6)",
          fontSize: 11,
          fontFamily: "var(--font-geist-sans, sans-serif)",
        }}
      />
      <Radar
        name="Score"
        dataKey="value"
        stroke="#8B5CF6"
        fill="#8B5CF6"
        fillOpacity={0.2}
        strokeWidth={1.5}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "#1A1A1D",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          color: "rgba(255,255,255,0.95)",
          fontSize: 12,
        }}
        formatter={(value) => [`${value}`, "Score"]}
      />
    </RadarChart>
  );
}
