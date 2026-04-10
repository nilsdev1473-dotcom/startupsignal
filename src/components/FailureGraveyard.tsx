"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";

type FailureMode =
  | "PMF"
  | "Timing"
  | "Team"
  | "Market"
  | "Competition"
  | "UnitEconomics"
  | "Regulatory";

interface Failure {
  name: string;
  year: number;
  fundingRaised: string;
  failureMode: string;
  cause: string;
}

interface FailureGraveyardProps {
  failures: Failure[];
}

const failureModeStyles: Record<
  FailureMode,
  { bg: string; text: string; label: string }
> = {
  PMF: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    label: "PMF",
  },
  Timing: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    label: "Timing",
  },
  Team: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    label: "Team",
  },
  Market: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    label: "Market",
  },
  Competition: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    label: "Competition",
  },
  UnitEconomics: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    label: "Unit Economics",
  },
  Regulatory: {
    bg: "bg-gray-500/10",
    text: "text-gray-400",
    label: "Regulatory",
  },
};

function FailureModeBadge({ mode }: { mode: string }) {
  const styles = failureModeStyles[mode as FailureMode] ?? {
    bg: "bg-white/10",
    text: "text-white/60",
    label: mode,
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles.bg} ${styles.text}`}
    >
      {styles.label}
    </span>
  );
}

function FundingBadge({ amount }: { amount: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-white/50">
      {amount}
    </span>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export function FailureGraveyard({ failures }: FailureGraveyardProps) {
  return (
    <motion.ul
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="list-none m-0 p-0"
    >
      {failures.map((failure, index) => (
        <motion.li
          key={`${failure.name}-${index}`}
          variants={itemVariants}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-[#1A1A1D] rounded-lg p-4 border border-white/[0.08] mb-2"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Left: name + cause */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-white/95 text-sm leading-tight">
                  {failure.name}
                </span>
                <span className="text-xs text-white/40 tabular-nums">
                  {failure.year}
                </span>
              </div>
              <p className="text-sm text-white/60 leading-snug line-clamp-1">
                {failure.cause}
              </p>
            </div>

            {/* Right: badges */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <FailureModeBadge mode={failure.failureMode} />
              <FundingBadge amount={failure.fundingRaised} />
            </div>
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default FailureGraveyard;
