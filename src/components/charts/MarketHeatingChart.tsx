"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MarketHeatingChartProps {
  weeklyScores: number[];
  className?: string;
}

export default function MarketHeatingChart({
  weeklyScores,
  className,
}: MarketHeatingChartProps) {
  const data = weeklyScores.map((score, i) => ({
    week: `W${i + 1}`,
    score,
  }));

  return (
    <div className={`h-[250px] w-full ${className ?? ""}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <defs>
            <linearGradient
              id="marketHeatingGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            interval={0}
            tick={{
              fill: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontFamily: "var(--font-geist-mono, monospace)",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{
              fill: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontFamily: "var(--font-geist-mono, monospace)",
            }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1A1A1D",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.95)",
              fontSize: 12,
            }}
            formatter={(value) => [`${value}`, "Heat Score"]}
            labelStyle={{ color: "rgba(255,255,255,0.6)" }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#10B981"
            strokeWidth={2}
            fill="url(#marketHeatingGradient)"
            dot={false}
            activeDot={{
              r: 4,
              fill: "#10B981",
              stroke: "#0A0A0B",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
