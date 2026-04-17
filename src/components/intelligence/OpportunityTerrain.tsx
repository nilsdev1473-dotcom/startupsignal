"use client";

import { useEffect, useRef, useCallback } from "react";

interface CategorySignal {
  name: string;
  hnSignal: number;
  ycFunding: number;
  githubStars: number;
  launchabilityScore: number;
  failureCount: number;
  topFailureMode: string;
}

interface Props {
  categories: CategorySignal[];
  onCategorySelect?: (cat: string | null) => void;
  selectedCategory?: string | null;
}

function scoreToColor(score: number): string {
  if (score >= 80) return `rgba(239, 68, 68, ${0.7 + score / 333})`;   // red — hot/crowded
  if (score >= 60) return `rgba(245, 158, 11, ${0.6 + score / 400})`; // amber — warm
  if (score >= 35) return `rgba(16, 185, 129, ${0.5 + score / 500})`;  // emerald — opportunity
  return `rgba(59, 130, 246, ${0.3 + score / 300})`;                   // blue — cold
}

function scoreToColorRGB(score: number): [number, number, number] {
  if (score >= 80) return [239, 68, 68];
  if (score >= 60) return [245, 158, 11];
  if (score >= 35) return [16, 185, 129];
  return [59, 130, 246];
}

export default function OpportunityTerrain({ categories, onCategorySelect, selectedCategory }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const hoveredRef = useRef<number | null>(null);
  const categoriesRef = useRef(categories);
  categoriesRef.current = categories;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const t = timeRef.current;
    const cats = categoriesRef.current;
    if (cats.length === 0) return;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Background grid
    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Each category gets 3 sub-bars: HN, YC, GitHub
    const signals = ["hnSignal", "ycFunding", "githubStars"] as const;
    const sigLabels = ["HN", "YC", "GH"];
    const sigColors = [
      [0, 212, 255],   // cyan — HN
      [16, 185, 129],  // emerald — YC
      [139, 92, 246],  // purple — GitHub
    ];

    const totalBars = cats.length * 3 + (cats.length - 1); // bars + gaps
    const barW = Math.floor((W - 60) / totalBars);
    const maxH = H - 80;
    const baseY = H - 40;

    let barIdx = 0;
    cats.forEach((cat, catIdx) => {
      const isSelected = selectedCategory === null || selectedCategory === cat.name;
      const isHovered = hoveredRef.current === catIdx;
      const alpha = isSelected ? 1 : 0.25;

      signals.forEach((sig, sigIdx) => {
        const val = cat[sig] as number;
        const breathe = Math.sin(t * 0.8 + catIdx * 0.7 + sigIdx * 0.3) * 3;
        const barH = Math.max(4, ((val / 100) * maxH) + breathe);
        const x = 30 + barIdx * barW;
        const y = baseY - barH;

        const [r, g, b] = sigColors[sigIdx];

        // Glow effect for hot bars
        if (val > 60 && isSelected) {
          const grd = ctx.createLinearGradient(x, y, x, baseY);
          grd.addColorStop(0, `rgba(${r},${g},${b},0)`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0.15)`);
          ctx.fillStyle = grd;
          ctx.fillRect(x - barW * 0.5, y - 20, barW * 2, barH + 20);
        }

        // Main bar gradient
        const grad = ctx.createLinearGradient(x, y, x, baseY);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.9})`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.1})`);
        ctx.fillStyle = grad;

        const bw = Math.max(2, barW - 2);
        // Rounded top
        ctx.beginPath();
        ctx.roundRect(x, y, bw, barH, [2, 2, 0, 0]);
        ctx.fill();

        // Top cap glow
        if (isSelected) {
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha * 0.95})`;
          ctx.fillRect(x, y, bw, 2);
        }

        // Hover highlight
        if (isHovered && isSelected) {
          ctx.strokeStyle = `rgba(${r},${g},${b},0.8)`;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, bw, barH);
        }

        barIdx++;
      });

      // Category label
      const catX = 30 + (catIdx * (3 * barW + barW)) + barW * 1.5;
      ctx.fillStyle = isHovered
        ? "rgba(255,255,255,0.95)"
        : isSelected ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)";
      ctx.font = `${isHovered ? "bold " : ""}9px 'Geist Mono', monospace`;
      ctx.textAlign = "center";
      ctx.fillText(cat.name.toUpperCase().slice(0, 8), catX, H - 12);

      // Score badge on hover
      if (isHovered) {
        const badgeX = catX;
        const peakH = Math.max(...signals.map((s) => cat[s] as number));
        const peakBarH = (peakH / 100) * maxH;
        const badgeY = baseY - peakBarH - 30;

        ctx.fillStyle = "rgba(5,5,7,0.92)";
        ctx.roundRect(badgeX - 42, badgeY, 84, 48, 4);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,212,255,0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(badgeX - 42, badgeY, 84, 48);

        ctx.fillStyle = "rgba(0,212,255,0.9)";
        ctx.font = "bold 11px 'Geist Mono', monospace";
        ctx.textAlign = "center";
        ctx.fillText(cat.name.toUpperCase(), badgeX, badgeY + 14);

        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "9px 'Geist Mono', monospace";
        ctx.fillText(`HN:${cat.hnSignal} YC:${cat.ycFunding} GH:${cat.githubStars}`, badgeX, badgeY + 28);
        ctx.fillText(`SCORE: ${cat.launchabilityScore}`, badgeX, badgeY + 42);
      }

      // Gap between category groups
      barIdx++;
    });

    // Radar scanline
    const scanX = ((t * 40) % (W - 60)) + 30;
    const scanGrad = ctx.createLinearGradient(scanX - 30, 0, scanX + 10, 0);
    scanGrad.addColorStop(0, "rgba(0,255,136,0)");
    scanGrad.addColorStop(0.7, "rgba(0,255,136,0.06)");
    scanGrad.addColorStop(1, "rgba(0,255,136,0.15)");
    ctx.fillStyle = scanGrad;
    ctx.fillRect(scanX - 30, 0, 40, H - 40);

    // Scanline edge
    ctx.strokeStyle = "rgba(0,255,136,0.3)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(scanX, 0);
    ctx.lineTo(scanX, H - 40);
    ctx.stroke();

    // Legend
    const legendItems = [
      { label: "HN SIGNAL", color: "rgb(0,212,255)" },
      { label: "YC FUNDING", color: "rgb(16,185,129)" },
      { label: "GITHUB", color: "rgb(139,92,246)" },
    ];
    legendItems.forEach((item, i) => {
      ctx.fillStyle = item.color;
      ctx.fillRect(W - 120, 12 + i * 16, 8, 8);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "8px 'Geist Mono', monospace";
      ctx.textAlign = "left";
      ctx.fillText(item.label, W - 108, 20 + i * 16);
    });

    timeRef.current += 0.016;
    animFrameRef.current = requestAnimationFrame(draw);
  }, [selectedCategory]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const cats = categoriesRef.current;
    const totalBars = cats.length * 3 + (cats.length - 1);
    const barW = Math.floor((canvas.width - 60) / totalBars);

    let found: number | null = null;
    cats.forEach((_, catIdx) => {
      const catX = 30 + (catIdx * (3 * barW + barW));
      const catEndX = catX + 3 * barW;
      if (x >= catX - barW && x <= catEndX + barW) found = catIdx;
    });

    hoveredRef.current = found;
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = null;
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const cats = categoriesRef.current;
    const totalBars = cats.length * 3 + (cats.length - 1);
    const barW = Math.floor((canvas.width - 60) / totalBars);

    let clicked: string | null = null;
    cats.forEach((cat, catIdx) => {
      const catX = 30 + (catIdx * (3 * barW + barW));
      const catEndX = catX + 3 * barW;
      if (x >= catX - barW && x <= catEndX + barW) clicked = cat.name;
    });

    if (clicked === selectedCategory) {
      onCategorySelect?.(null);
    } else {
      onCategorySelect?.(clicked);
    }
  }, [selectedCategory, onCategorySelect]);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-3 left-4 z-10">
        <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "rgba(0,212,255,0.7)", fontFamily: "monospace" }}>
          OPPORTUNITY TERRAIN
        </span>
        <div className="text-[8px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
          {categories.length} SECTORS · LIVE SIGNAL DATA
        </div>
      </div>
      {selectedCategory && (
        <button
          onClick={() => onCategorySelect?.(null)}
          className="absolute top-3 right-4 z-10 text-[8px] px-2 py-0.5 rounded"
          style={{ background: "rgba(0,212,255,0.1)", color: "rgba(0,212,255,0.8)", border: "1px solid rgba(0,212,255,0.3)", fontFamily: "monospace" }}
        >
          CLEAR FILTER ✕
        </button>
      )}
      <canvas
        ref={canvasRef}
        width={700}
        height={380}
        className="w-full h-full"
        style={{ cursor: "crosshair" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </div>
  );
}
