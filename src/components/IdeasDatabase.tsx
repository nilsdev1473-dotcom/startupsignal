"use client";

import { useCallback, useState } from "react";
import type { StartupIdea } from "@/types";

type SortKey = "score" | "title" | "category";

interface Props {
  ideas?: StartupIdea[];
}

const SOURCE_COLORS: Record<string, string> = {
  YC: "#F97316",
  Techstars: "#3B82F6",
  "500": "#8B5CF6",
  Antler: "#10B981",
  yc_rfs: "#F97316",
  default: "#6B7280",
};

const FAIL_MODE_COLORS: Record<string, string> = {
  PMF: "#EF4444",
  Timing: "#F59E0B",
  Team: "#3B82F6",
  Market: "#8B5CF6",
  Competition: "#F97316",
  UnitEconomics: "#EAB308",
  Regulatory: "#6B7280",
};

export default function IdeasDatabase({ ideas: ideasProp }: Props) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [selectedSrc, setSelectedSrc] = useState<string[]>([]);

  // Import default data lazily
  const [defaultIdeas] = useState<StartupIdea[]>(() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("@/lib/data").IDEAS;
    } catch {
      return [];
    }
  });

  const ideas = ideasProp ?? defaultIdeas;

  const sources = Array.from(new Set(ideas.map((i) => i.source)));

  const filtered = ideas
    .filter((idea) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        idea.title.toLowerCase().includes(q) ||
        idea.description.toLowerCase().includes(q) ||
        idea.category.toLowerCase().includes(q);
      const matchSrc =
        selectedSrc.length === 0 || selectedSrc.includes(idea.source);
      return matchSearch && matchSrc;
    })
    .sort((a, b) => {
      if (sortKey === "score")
        return b.launchabilityScore - a.launchabilityScore;
      if (sortKey === "title") return a.title.localeCompare(b.title);
      return a.category.localeCompare(b.category);
    });

  const toggleSrc = useCallback(
    (src: string) =>
      setSelectedSrc((prev) =>
        prev.includes(src) ? prev.filter((s) => s !== src) : [...prev, src],
      ),
    [],
  );

  return (
    <div
      className="min-h-screen px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <div className="max-w-6xl mx-auto">
        <h1
          className="text-2xl font-semibold mb-2"
          style={{ color: "rgba(255,255,255,0.95)" }}
        >
          Ideas Database
        </h1>
        <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
          {ideas.length} ideas scored — click any to expand details
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ideas..."
            className="flex-1 min-w-48 px-4 py-2 rounded-xl text-sm"
            style={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.9)",
            }}
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="px-3 py-2 rounded-xl text-sm"
            style={{
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <option value="score">Sort: Score</option>
            <option value="title">Sort: Title</option>
            <option value="category">Sort: Category</option>
          </select>
        </div>

        {/* Source filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sources.map((src) => (
            <button
              type="button"
              key={src}
              onClick={() => toggleSrc(src)}
              className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
              style={{
                background: selectedSrc.includes(src)
                  ? `${SOURCE_COLORS[src] ?? SOURCE_COLORS.default}20`
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${selectedSrc.includes(src) ? (SOURCE_COLORS[src] ?? SOURCE_COLORS.default) : "rgba(255,255,255,0.1)"}`,
                color: selectedSrc.includes(src)
                  ? (SOURCE_COLORS[src] ?? SOURCE_COLORS.default)
                  : "rgba(255,255,255,0.5)",
              }}
            >
              {src}
            </button>
          ))}
        </div>

        {/* Ideas list */}
        <div className="flex flex-col gap-3">
          {filtered.map((idea, idx) => (
            <IdeaRow key={idea.id} idea={idea} idx={idx} />
          ))}
          {filtered.length === 0 && (
            <p
              className="text-center py-16 text-sm"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              No ideas match your filters
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function IdeaRow({ idea, idx }: { idea: StartupIdea; idx: number }) {
  const [open, setOpen] = useState(false);
  const srcColor = SOURCE_COLORS[idea.source] ?? SOURCE_COLORS.default;
  const score = idea.launchabilityScore;
  const scoreColor =
    score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div
      className="fade-in-up rounded-xl overflow-hidden"
      style={{
        background: "#111113",
        border: open
          ? "1px solid rgba(139,92,246,0.3)"
          : "1px solid rgba(255,255,255,0.08)",
        animationDelay: `${idx * 30}ms`,
        transition: "border-color 0.2s",
      }}
    >
      {/* Header - always visible */}
      <button
        type="button"
        className="w-full text-left p-4 sm:p-5"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.95)",
                }}
              >
                {idea.title}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{
                  background: `${srcColor}18`,
                  color: srcColor,
                  border: `1px solid ${srcColor}40`,
                }}
              >
                {idea.source}
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                {idea.category}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="text-xl font-bold font-mono"
              style={{ color: scoreColor }}
            >
              {score}
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 18,
                transform: open ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              ▾
            </span>
          </div>
        </div>
        <p
          className="text-xs mt-2 line-clamp-2 text-left"
          style={{ color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}
        >
          {idea.description}
        </p>
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          className="px-4 pb-5 sm:px-5 border-t"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          {/* Score bars */}
          <div className="mt-4 mb-4">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              Score Breakdown
            </p>
            {Object.entries(idea.scores).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3 mb-2">
                <span
                  className="w-28 shrink-0 text-xs"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div
                  className="flex-1 h-1.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${val}%`,
                      background:
                        val >= 70
                          ? "#10B981"
                          : val >= 50
                            ? "#F59E0B"
                            : "#EF4444",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <span
                  className="w-6 text-right text-xs font-mono"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>

          {/* Failure graveyard */}
          {idea.failureGraveyard && idea.failureGraveyard.length > 0 && (
            <div className="mb-4">
              <p
                className="text-[10px] font-semibold uppercase tracking-widest mb-3"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Failure Graveyard
              </p>
              {idea.failureGraveyard.map((f) => (
                <div
                  key={f.name}
                  className="flex items-center gap-2 mb-2 text-xs"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                    style={{
                      background: `${FAIL_MODE_COLORS[f.failureMode] ?? "#6B7280"}20`,
                      color: FAIL_MODE_COLORS[f.failureMode] ?? "#6B7280",
                    }}
                  >
                    {f.failureMode}
                  </span>
                  <span>
                    {f.name} — {f.cause}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Execution Brief */}
          <ExecutionBriefInline
            ideaId={idea.id}
            title={idea.title}
            description={idea.description}
            category={idea.category}
          />
        </div>
      )}
    </div>
  );
}

function ExecutionBriefInline({
  ideaId,
  title,
  description,
  category,
}: {
  ideaId: string;
  title: string;
  description: string;
  category: string;
}) {
  const [brief, setBrief] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_id: ideaId, title, description, category }),
      });
      const d = await r.json();
      if (d.brief) {
        setBrief(d.brief);
        setLoaded(true);
      }
    } catch {}
    setLoading(false);
  };

  if (loaded && brief) {
    const b = brief as Record<string, string | string[]>;
    const sections = [
      { label: "Founding Team", key: "founding_team" },
      { label: "Realistic Funding", key: "realistic_funding" },
      { label: "Time to Revenue", key: "time_to_revenue" },
      { label: "Why Now", key: "why_now" },
      { label: "Path to Profitability", key: "path_to_profitability" },
    ];
    return (
      <div
        className="mt-4 p-4 rounded-xl"
        style={{
          background: "rgba(139,92,246,0.05)",
          border: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-3"
          style={{ color: "#8B5CF6" }}
        >
          AI Execution Brief
        </p>
        {sections.map(
          ({ label, key }) =>
            b[key] && (
              <div key={key} className="mb-3">
                <p
                  className="text-[10px] uppercase tracking-wide mb-1"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {label}
                </p>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {b[key] as string}
                </p>
              </div>
            ),
        )}
        {Array.isArray(b.core_components) && (
          <div className="mb-3">
            <p
              className="text-[10px] uppercase tracking-wide mb-1"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              Core Components
            </p>
            {(b.core_components as string[]).map((c, i) => (
              <p
                key={i}
                className="text-xs mb-1"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {i + 1}. {c}
              </p>
            ))}
          </div>
        )}
        {b.tip && (
          <div
            className="mt-3 p-3 rounded-lg"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <p
              className="text-xs italic"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              💡 {b.tip as string}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={generate}
      disabled={loading}
      className="mt-3 w-full py-2.5 rounded-xl text-sm font-medium transition-colors"
      style={{
        background: loading ? "rgba(139,92,246,0.1)" : "rgba(139,92,246,0.15)",
        border: "1px solid rgba(139,92,246,0.3)",
        color: loading ? "rgba(139,92,246,0.5)" : "#8B5CF6",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "⏳ Generating brief (~30s)..." : "✦ Generate Execution Brief"}
    </button>
  );
}
