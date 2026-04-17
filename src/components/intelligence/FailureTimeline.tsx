"use client";

import { useState, useMemo, useRef } from "react";
import type { FailedStartup } from "@/types";

interface Props {
  failures: FailedStartup[];
  selectedCategory: string | null;
}

const MODE_COLORS: Record<string, string> = {
  PMF: "#EF4444",
  Competition: "#F97316",
  Timing: "#3B82F6",
  UnitEconomics: "#8B5CF6",
  Regulatory: "#06B6D4",
  Market: "#EC4899",
  Team: "#10B981",
};

const YEAR_START = 2010;
const YEAR_END = 2026;

function fundingToSize(funding: string): number {
  if (!funding || funding === "Unknown") return 3;
  const n = parseFloat(funding.replace(/[^0-9.]/g, ""));
  if (isNaN(n)) return 3;
  if (funding.includes("B")) return 10;
  if (n > 500) return 9;
  if (n > 100) return 7;
  if (n > 10) return 5;
  return 4;
}

// Deterministic pseudo-random Y position based on company name
function nameToY(name: string, rangeMin: number, rangeMax: number): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  const norm = Math.abs(hash) / 2147483647;
  return rangeMin + norm * (rangeMax - rangeMin);
}

// Generate static "star" positions
const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: (i * 137.508) % 100,
  y: (i * 97.3) % 100,
  r: i % 3 === 0 ? 1.2 : 0.6,
  opacity: 0.1 + (i % 5) * 0.06,
}));

export default function FailureTimeline({ failures, selectedCategory }: Props) {
  const [hovered, setHovered] = useState<FailedStartup | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const W = 1200;
  const H = 180;
  const PAD_L = 50;
  const PAD_R = 30;
  const PAD_T = 20;
  const PAD_B = 32;
  const PLOT_W = W - PAD_L - PAD_R;
  const PLOT_H = H - PAD_T - PAD_B;

  const yearToX = (year: number) =>
    PAD_L + ((year - YEAR_START) / (YEAR_END - YEAR_START)) * PLOT_W;

  // Group failures by year, compute positions
  const dots = useMemo(() => {
    return failures
      .filter((f) => {
        const yr = f.year;
        return yr >= YEAR_START && yr <= YEAR_END;
      })
      .map((f) => {
        const x = yearToX(f.year) + (nameToY(f.name, -8, 8));
        const y = PAD_T + nameToY(f.name, 8, PLOT_H - 8);
        const size = fundingToSize(f.fundingRaised);
        const color = MODE_COLORS[f.failureMode] ?? "#7C3AED";
        const dimmed = selectedCategory !== null && f.category !== selectedCategory;
        return { ...f, x, y, size, color, dimmed };
      });
  }, [failures, selectedCategory]);

  const years = Array.from(
    { length: YEAR_END - YEAR_START + 1 },
    (_, i) => YEAR_START + i
  );

  return (
    <div className="relative w-full" style={{ height: "220px" }}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 pt-2 pb-1">
        <div>
          <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "rgba(0,212,255,0.7)", fontFamily: "monospace" }}>
            FAILURE TIMELINE
          </span>
          <span className="ml-3 text-[8px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            {failures.length} COMPANIES · {YEAR_START}–{YEAR_END}
          </span>
        </div>
        {/* Legend */}
        <div className="flex gap-3 ml-auto">
          {Object.entries(MODE_COLORS).map(([mode, color]) => (
            <div key={mode} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                {mode.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SVG Timeline */}
      <div className="relative w-full" style={{ height: "186px", overflow: "hidden" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full"
        >
          {/* Star background */}
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              fill={`rgba(255,255,255,${s.opacity})`}
            />
          ))}

          {/* Background gradient */}
          <defs>
            <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0a0814" stopOpacity="1" />
              <stop offset="100%" stopColor="#050507" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <rect width={W} height={H} fill="url(#bgGrad)" />

          {/* Grid lines */}
          {years.map((yr) => {
            const x = yearToX(yr);
            const isMajor = yr % 5 === 0;
            return (
              <line
                key={yr}
                x1={x} y1={PAD_T}
                x2={x} y2={H - PAD_B}
                stroke={isMajor ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)"}
                strokeWidth={isMajor ? 0.8 : 0.4}
                strokeDasharray={isMajor ? "none" : "2,4"}
              />
            );
          })}

          {/* Year labels */}
          {years.filter((yr) => yr % 2 === 0).map((yr) => (
            <text
              key={yr}
              x={yearToX(yr)}
              y={H - PAD_B + 14}
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize={8}
              fontFamily="monospace"
            >
              {yr}
            </text>
          ))}

          {/* Bottom axis line */}
          <line
            x1={PAD_L} y1={H - PAD_B}
            x2={W - PAD_R} y2={H - PAD_B}
            stroke="rgba(0,212,255,0.2)"
            strokeWidth={0.8}
          />

          {/* Failure dots */}
          {dots.map((dot, i) => (
            <g key={i}>
              {!dot.dimmed && dot.size >= 7 && (
                <circle
                  cx={dot.x}
                  cy={dot.y}
                  r={dot.size + 3}
                  fill={`${dot.color}15`}
                  filter="url(#glow)"
                />
              )}
              <circle
                cx={dot.x}
                cy={dot.y}
                r={dot.size}
                fill={dot.color}
                opacity={dot.dimmed ? 0.08 : 0.75}
                stroke={hovered?.name === dot.name ? "rgba(255,255,255,0.9)" : "none"}
                strokeWidth={1}
                style={{ cursor: "pointer", transition: "opacity 0.3s" }}
                onMouseEnter={(e) => {
                  setHovered(dot);
                  const svg = svgRef.current;
                  if (svg) {
                    const rect = svg.getBoundingClientRect();
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }
                }}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          ))}

          {/* "NOW" marker */}
          <line
            x1={yearToX(2026)} y1={PAD_T}
            x2={yearToX(2026)} y2={H - PAD_B}
            stroke="rgba(0,255,136,0.5)"
            strokeWidth={1}
            strokeDasharray="3,3"
          />
          <text
            x={yearToX(2026) - 4}
            y={PAD_T - 5}
            textAnchor="end"
            fill="rgba(0,255,136,0.7)"
            fontSize={7}
            fontFamily="monospace"
          >
            NOW
          </text>
        </svg>

        {/* Tooltip */}
        {hovered && (
          <div
            className="absolute z-50 pointer-events-none px-3 py-2 rounded"
            style={{
              left: Math.min(tooltipPos.x + 12, 900),
              top: Math.max(tooltipPos.y - 60, 4),
              background: "rgba(5,5,7,0.96)",
              border: "1px solid rgba(0,212,255,0.3)",
              maxWidth: 260,
              backdropFilter: "blur(4px)",
            }}
          >
            <div className="text-[10px] font-bold mb-1" style={{ color: "rgba(255,255,255,0.95)", fontFamily: "monospace" }}>
              {hovered.name}
            </div>
            <div className="flex gap-3 mb-1">
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                {hovered.year}
              </span>
              <span className="text-[8px] px-1.5 py-0.5 rounded" style={{
                background: `${MODE_COLORS[hovered.failureMode] ?? "#7C3AED"}20`,
                color: MODE_COLORS[hovered.failureMode] ?? "#7C3AED",
                fontFamily: "monospace",
              }}>
                {hovered.failureMode?.toUpperCase()}
              </span>
              <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
                {hovered.fundingRaised}
              </span>
            </div>
            <div className="text-[8px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>
              {(hovered.cause || hovered.postMortem || "").slice(0, 120)}
              {((hovered.cause || hovered.postMortem || "").length > 120) ? "…" : ""}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
