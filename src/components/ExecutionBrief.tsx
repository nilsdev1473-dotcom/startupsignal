"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface ExecutionBriefData {
  founding_team: string;
  realistic_funding: string;
  time_to_revenue: string;
  core_components: string[];
  key_risks: string[];
  why_now: string;
  path_to_profitability: string;
  tip: string;
}

interface BriefResponse {
  brief: ExecutionBriefData | null;
  cached?: boolean;
  error?: string;
  pending?: boolean;
}

interface Props {
  ideaId: string;
  title: string;
  description: string;
  category: string;
}

function sectionStyle(i: number) {
  return {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: {
      type: "spring" as const,
      damping: 26,
      stiffness: 360,
      delay: i * 0.04,
    },
  };
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 mb-1">
      {children}
    </p>
  );
}

function SectionText({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-white/80 leading-relaxed">{children}</p>;
}

export default function ExecutionBrief({
  ideaId,
  title,
  description,
  category,
}: Props) {
  const [brief, setBrief] = useState<ExecutionBriefData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(false);

  async function generateBrief() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea_id: ideaId, title, description, category }),
      });
      const data: BriefResponse = (await res.json()) as BriefResponse;

      if (data.brief) {
        setBrief(data.brief);
        setCached(data.cached ?? false);
      } else {
        setError(data.error ?? "Unknown error");
      }
    } catch {
      setError("Failed to reach server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-4">
      <AnimatePresence mode="wait">
        {!brief && !loading && (
          <motion.button
            key="btn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onClick={generateBrief}
            className="
              w-full py-2.5 px-4 rounded-lg text-sm font-medium
              bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20
              text-white/70 hover:text-white
              transition-all duration-200 cursor-pointer
            "
          >
            ⚡ Generate Execution Brief
          </motion.button>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-3 py-3 px-4 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="w-4 h-4 border-2 border-white/20 border-t-white/70 rounded-full animate-spin shrink-0" />
            <span className="text-sm text-white/50">
              Analyzing with Qwen2.5…
            </span>
          </motion.div>
        )}

        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-2.5 px-4 rounded-lg bg-white/5 border border-white/10 text-sm text-white/40 italic"
          >
            {error}
          </motion.div>
        )}

        {brief && (
          <motion.div
            key="brief"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl border border-white/10 bg-[#111113] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Execution Brief
              </span>
              {cached && (
                <span className="text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                  cached
                </span>
              )}
            </div>

            <div className="p-4 space-y-5">
              {/* Founding Team */}
              <motion.div {...sectionStyle(0)}>
                <SectionLabel>Founding Team</SectionLabel>
                <SectionText>{brief.founding_team}</SectionText>
              </motion.div>

              {/* Funding + Time row */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div {...sectionStyle(1)}>
                  <SectionLabel>Realistic Funding</SectionLabel>
                  <SectionText>{brief.realistic_funding}</SectionText>
                </motion.div>
                <motion.div {...sectionStyle(2)}>
                  <SectionLabel>Time to Revenue</SectionLabel>
                  <SectionText>{brief.time_to_revenue}</SectionText>
                </motion.div>
              </div>

              {/* Core Components */}
              <motion.div {...sectionStyle(3)}>
                <SectionLabel>Core Components</SectionLabel>
                <ol className="space-y-1 mt-1">
                  {brief.core_components.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-white/80"
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-white/8 flex items-center justify-center text-[10px] text-white/50 font-mono mt-0.5">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              </motion.div>

              {/* Key Risks */}
              <motion.div {...sectionStyle(4)}>
                <SectionLabel>Key Risks</SectionLabel>
                <ul className="space-y-1 mt-1">
                  {brief.key_risks.map((risk, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-white/80"
                    >
                      <span className="shrink-0 text-amber-400/70 mt-0.5">
                        ▲
                      </span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Why Now */}
              <motion.div {...sectionStyle(5)}>
                <SectionLabel>Why Now</SectionLabel>
                <SectionText>{brief.why_now}</SectionText>
              </motion.div>

              {/* Path to Profitability */}
              <motion.div {...sectionStyle(6)}>
                <SectionLabel>Path to Profitability</SectionLabel>
                <SectionText>{brief.path_to_profitability}</SectionText>
              </motion.div>

              {/* TIP */}
              <motion.div {...sectionStyle(7)}>
                <div className="rounded-lg bg-black/40 border border-white/8 px-4 py-3">
                  <SectionLabel>💡 Solo Founder Tip</SectionLabel>
                  <p className="text-sm text-white/60 italic leading-relaxed">
                    {brief.tip}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
