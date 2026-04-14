// ─────────────────────────────────────────────────────────────────────────────
// StartupSignal — Mock Data Layer
// ─────────────────────────────────────────────────────────────────────────────

export type FailureMode =
  | "PMF"
  | "Timing"
  | "Team"
  | "Market"
  | "Competition"
  | "UnitEconomics"
  | "Regulatory";

export type Source = "YC" | "Techstars" | "500" | "Antler";
export type Trend = "up" | "down" | "stable";
export type Category =
  | "AI Devtools"
  | "Fintech"
  | "Healthtech"
  | "Marketplace"
  | "Climate"
  | "Edtech";

export interface GraveyardEntry {
  name: string;
  year: number;
  fundingRaised: string;
  failureMode: FailureMode;
  cause: string;
}

export interface IdeaScores {
  marketTiming: number;
  marketSize: number;
  competition: number;
  techReadiness: number;
  executionComplexity: number;
  failureRisk: number;
}

export interface StartupIdea {
  id: string;
  title: string;
  description: string;
  category: Category;
  source: Source;
  launchabilityScore: number;
  scores: IdeaScores;
  trend: Trend;
  weeklyScores: number[];
  failureGraveyard: GraveyardEntry[];
  executionBrief?: string | null;
}

export interface FailedStartup {
  id: string;
  name: string;
  year: number;
  fundingRaised: string;
  timeToFailureMonths: number;
  failureMode: FailureMode;
  cause: string;
  postMortem: string;
  category: Category;
}

export interface Stats {
  totalIdeas: number;
  totalFailures: number;
  avgScore: number;
  topCategory: Category;
}

// ─────────────────────────────────────────────────────────────────────────────
// IDEAS — 20 startup ideas
// ─────────────────────────────────────────────────────────────────────────────

export const IDEAS: StartupIdea[] = [
  {
    id: "idea-001",
    title: "CodeReview.ai",
    description:
      "AI-native pull request review that understands intent, not just syntax. Catches architectural drift, security anti-patterns, and flags technical debt before it compounds.",
    category: "AI Devtools",
    source: "YC",
    launchabilityScore: 87,
    scores: {
      marketTiming: 92,
      marketSize: 85,
      competition: 68,
      techReadiness: 90,
      executionComplexity: 72,
      failureRisk: 35,
    },
    trend: "up",
    weeklyScores: [74, 76, 78, 80, 81, 82, 83, 84, 85, 86, 87, 87],
    failureGraveyard: [
      {
        name: "DeepCode",
        year: 2022,
        fundingRaised: "$4M",
        failureMode: "Competition",
        cause:
          "GitHub Copilot and Snyk absorbed the market with bundled offerings",
      },
      {
        name: "Codota",
        year: 2023,
        fundingRaised: "$12M",
        failureMode: "PMF",
        cause:
          "Enterprise sales cycle too long; developers wanted instant value not quarterly contracts",
      },
    ],
  },
  {
    id: "idea-002",
    title: "Medi-Sync",
    description:
      "HIPAA-compliant care coordination platform that unifies EHR data across fragmented providers using LLMs to surface care gaps in real time.",
    category: "Healthtech",
    source: "Techstars",
    launchabilityScore: 79,
    scores: {
      marketTiming: 82,
      marketSize: 95,
      competition: 55,
      techReadiness: 74,
      executionComplexity: 45,
      failureRisk: 52,
    },
    trend: "up",
    weeklyScores: [64, 65, 67, 69, 70, 72, 74, 75, 76, 77, 78, 79],
    failureGraveyard: [
      {
        name: "Olive AI",
        year: 2023,
        fundingRaised: "$902M",
        failureMode: "UnitEconomics",
        cause:
          "RPA-heavy model had 80%+ gross margins that inverted at scale with hospital churn",
      },
      {
        name: "Forward Health",
        year: 2024,
        fundingRaised: "$225M",
        failureMode: "Market",
        cause:
          "Subscription primary care model failed to achieve density needed for unit economics",
      },
    ],
  },
  {
    id: "idea-003",
    title: "CarbonLedger",
    description:
      "Automated Scope 3 emissions tracking for mid-market companies using bank-feed integrations and supplier APIs. Turns a 6-month audit into a 20-minute dashboard.",
    category: "Climate",
    source: "Antler",
    launchabilityScore: 82,
    scores: {
      marketTiming: 88,
      marketSize: 78,
      competition: 62,
      techReadiness: 85,
      executionComplexity: 65,
      failureRisk: 42,
    },
    trend: "up",
    weeklyScores: [68, 70, 71, 73, 74, 76, 77, 78, 79, 80, 81, 82],
    failureGraveyard: [
      {
        name: "Watershed (pivot)",
        year: 2023,
        fundingRaised: "$70M",
        failureMode: "Regulatory",
        cause:
          "SEC climate disclosure rollback removed compliance urgency from enterprise buyers",
      },
    ],
  },
  {
    id: "idea-004",
    title: "FinStack",
    description:
      "Embedded finance infrastructure for vertical SaaS. Drop-in lending, insurance, and treasury products that non-fintech companies can offer their SMB customers via API.",
    category: "Fintech",
    source: "YC",
    launchabilityScore: 84,
    scores: {
      marketTiming: 80,
      marketSize: 92,
      competition: 60,
      techReadiness: 88,
      executionComplexity: 55,
      failureRisk: 44,
    },
    trend: "stable",
    weeklyScores: [78, 79, 80, 81, 82, 83, 83, 84, 84, 84, 84, 84],
    failureGraveyard: [
      {
        name: "Synapse Financial",
        year: 2024,
        fundingRaised: "$50M",
        failureMode: "Regulatory",
        cause:
          "FDIC pass-through account confusion left 100K customers frozen; no regulatory clarity on BaaS liability",
      },
    ],
  },
  {
    id: "idea-005",
    title: "TutorGraph",
    description:
      "Adaptive K-12 math tutoring that builds a dynamic knowledge graph per student and serves micro-lessons targeting exact conceptual gaps rather than chapter-by-chapter.",
    category: "Edtech",
    source: "500",
    launchabilityScore: 71,
    scores: {
      marketTiming: 75,
      marketSize: 82,
      competition: 52,
      techReadiness: 80,
      executionComplexity: 60,
      failureRisk: 58,
    },
    trend: "stable",
    weeklyScores: [65, 66, 67, 68, 69, 70, 70, 71, 71, 71, 71, 71],
    failureGraveyard: [
      {
        name: "Byju's US",
        year: 2023,
        fundingRaised: "$22B",
        failureMode: "UnitEconomics",
        cause:
          "Aggressive door-to-door sales with exploitative loan products destroyed trust",
      },
      {
        name: "Podia",
        year: 2023,
        fundingRaised: "$8M",
        failureMode: "Competition",
        cause: "Notion and Substack commoditised course creation tools",
      },
    ],
  },
  {
    id: "idea-006",
    title: "ShiftMarket",
    description:
      "Gig-economy marketplace for licensed shift workers (nurses, electricians, forklift operators). Verified credentials, same-day pay, zero agency markup.",
    category: "Marketplace",
    source: "Techstars",
    launchabilityScore: 76,
    scores: {
      marketTiming: 78,
      marketSize: 88,
      competition: 58,
      techReadiness: 82,
      executionComplexity: 62,
      failureRisk: 50,
    },
    trend: "up",
    weeklyScores: [60, 62, 64, 65, 67, 68, 70, 71, 72, 73, 75, 76],
    failureGraveyard: [
      {
        name: "Wonolo",
        year: 2023,
        fundingRaised: "$42M",
        failureMode: "UnitEconomics",
        cause:
          "Worker acquisition costs grew faster than take-rate; churn made unit economics negative",
      },
    ],
  },
  {
    id: "idea-007",
    title: "ObserveML",
    description:
      "Production ML observability — detects data drift, model degradation, and feature skew in real time. Integrates with any inference endpoint in 5 minutes.",
    category: "AI Devtools",
    source: "YC",
    launchabilityScore: 83,
    scores: {
      marketTiming: 87,
      marketSize: 80,
      competition: 65,
      techReadiness: 88,
      executionComplexity: 70,
      failureRisk: 38,
    },
    trend: "up",
    weeklyScores: [70, 72, 73, 74, 76, 77, 78, 79, 80, 81, 82, 83],
    failureGraveyard: [
      {
        name: "Arize AI",
        year: 2024,
        fundingRaised: "$38M",
        failureMode: "Competition",
        cause:
          "Datadog and Grafana Labs launched competing ML observability modules bundled free with existing subscriptions",
      },
    ],
  },
  {
    id: "idea-008",
    title: "ClaimIQ",
    description:
      "Insurance claim automation for independent adjusters. AI reads policy language, damage photos, and repair estimates — drafts settlement letters at 10x speed.",
    category: "Fintech",
    source: "Antler",
    launchabilityScore: 78,
    scores: {
      marketTiming: 82,
      marketSize: 75,
      competition: 68,
      techReadiness: 85,
      executionComplexity: 58,
      failureRisk: 45,
    },
    trend: "stable",
    weeklyScores: [72, 73, 74, 75, 76, 77, 77, 78, 78, 78, 78, 78],
    failureGraveyard: [
      {
        name: "Lemonade for Adjusters",
        year: 2022,
        fundingRaised: "$6M",
        failureMode: "Regulatory",
        cause:
          "State-by-state insurance adjuster licensing created an insurmountable compliance moat",
      },
    ],
  },
  {
    id: "idea-009",
    title: "PharmaTrace",
    description:
      "Blockchain-anchored drug supply chain verification for specialty pharmacies and hospital networks. Eliminates counterfeit risk and automates FDA DSCSA compliance.",
    category: "Healthtech",
    source: "Techstars",
    launchabilityScore: 68,
    scores: {
      marketTiming: 70,
      marketSize: 80,
      competition: 60,
      techReadiness: 72,
      executionComplexity: 45,
      failureRisk: 62,
    },
    trend: "down",
    weeklyScores: [75, 74, 73, 73, 72, 71, 71, 70, 70, 69, 68, 68],
    failureGraveyard: [
      {
        name: "MediLedger",
        year: 2023,
        fundingRaised: "$28M",
        failureMode: "Timing",
        cause:
          "DSCSA deadline extensions delayed mandate; buyers deprioritised spend",
      },
    ],
  },
  {
    id: "idea-010",
    title: "GridFlex",
    description:
      "Demand-response aggregation for commercial buildings. Turns HVAC and battery systems into virtual power plants that sell grid stabilisation services to utilities.",
    category: "Climate",
    source: "500",
    launchabilityScore: 74,
    scores: {
      marketTiming: 80,
      marketSize: 85,
      competition: 60,
      techReadiness: 70,
      executionComplexity: 50,
      failureRisk: 55,
    },
    trend: "up",
    weeklyScores: [62, 64, 65, 66, 68, 69, 70, 71, 71, 72, 73, 74],
    failureGraveyard: [
      {
        name: "AutoGrid",
        year: 2023,
        fundingRaised: "$75M",
        failureMode: "Market",
        cause:
          "Utility procurement cycles averaged 4 years; startup cash runways of 18 months were incompatible",
      },
    ],
  },
  {
    id: "idea-011",
    title: "DevSecOps Copilot",
    description:
      "Security-first coding assistant that enforces OWASP Top 10 in real time and generates hardened Infrastructure-as-Code. Targets regulated industries: finance, health, defence.",
    category: "AI Devtools",
    source: "YC",
    launchabilityScore: 85,
    scores: {
      marketTiming: 90,
      marketSize: 82,
      competition: 62,
      techReadiness: 92,
      executionComplexity: 68,
      failureRisk: 32,
    },
    trend: "up",
    weeklyScores: [74, 75, 77, 78, 79, 80, 81, 82, 83, 84, 85, 85],
    failureGraveyard: [
      {
        name: "Bridgecrew",
        year: 2021,
        fundingRaised: "$18M",
        failureMode: "Competition",
        cause:
          "Acquired by Palo Alto Networks; standalone security scanning tools absorbed into SASE platforms",
      },
    ],
  },
  {
    id: "idea-012",
    title: "LoanOS",
    description:
      "White-label lending origination system for credit unions and community banks. Replaces legacy LOS with a modern API-first stack in 6 weeks, not 6 months.",
    category: "Fintech",
    source: "Techstars",
    launchabilityScore: 77,
    scores: {
      marketTiming: 78,
      marketSize: 80,
      competition: 65,
      techReadiness: 82,
      executionComplexity: 62,
      failureRisk: 48,
    },
    trend: "stable",
    weeklyScores: [72, 73, 74, 74, 75, 76, 76, 77, 77, 77, 77, 77],
    failureGraveyard: [
      {
        name: "Blend Labs",
        year: 2023,
        fundingRaised: "$665M",
        failureMode: "Market",
        cause:
          "Mortgage market collapse post-rate hikes wiped out 80% of their TAM in 12 months",
      },
    ],
  },
  {
    id: "idea-013",
    title: "EcoFreight",
    description:
      "Carbon-optimised freight brokerage. Matches shippers with carriers based on emissions per ton-mile, not just price. Integrates with Scope 3 reporting tools automatically.",
    category: "Climate",
    source: "Antler",
    launchabilityScore: 72,
    scores: {
      marketTiming: 76,
      marketSize: 82,
      competition: 58,
      techReadiness: 78,
      executionComplexity: 60,
      failureRisk: 52,
    },
    trend: "stable",
    weeklyScores: [67, 68, 69, 70, 70, 71, 71, 72, 72, 72, 72, 72],
    failureGraveyard: [
      {
        name: "Convoy",
        year: 2023,
        fundingRaised: "$900M",
        failureMode: "UnitEconomics",
        cause:
          "Freight broker margins too thin for VC-backed growth; load-matching didn't yield defensible moat",
      },
    ],
  },
  {
    id: "idea-014",
    title: "SkillPath",
    description:
      "AI career coach for blue-collar workers transitioning to clean energy jobs. Maps existing skills to solar, wind, and battery storage roles with subsidised upskilling pathways.",
    category: "Edtech",
    source: "500",
    launchabilityScore: 69,
    scores: {
      marketTiming: 78,
      marketSize: 75,
      competition: 62,
      techReadiness: 72,
      executionComplexity: 58,
      failureRisk: 60,
    },
    trend: "down",
    weeklyScores: [74, 73, 73, 72, 72, 71, 71, 70, 70, 70, 69, 69],
    failureGraveyard: [
      {
        name: "Guild Education",
        year: 2024,
        fundingRaised: "$594M",
        failureMode: "UnitEconomics",
        cause:
          "Employer-funded tuition reimbursement model collapsed when partners cut L&D budgets in downturn",
      },
    ],
  },
  {
    id: "idea-015",
    title: "PatientFlow",
    description:
      "Outpatient scheduling orchestration for multi-location health systems. Reduces no-show rate by 40% through intelligent reminder sequences and predictive rebooking.",
    category: "Healthtech",
    source: "YC",
    launchabilityScore: 80,
    scores: {
      marketTiming: 84,
      marketSize: 86,
      competition: 62,
      techReadiness: 84,
      executionComplexity: 66,
      failureRisk: 42,
    },
    trend: "up",
    weeklyScores: [68, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80],
    failureGraveyard: [
      {
        name: "Zocdoc Enterprise",
        year: 2022,
        fundingRaised: "$220M",
        failureMode: "PMF",
        cause:
          "Hospitals unwilling to change scheduling workflows; integration costs exceeded ACV",
      },
    ],
  },
  {
    id: "idea-016",
    title: "ContractForge",
    description:
      "AI contract drafting and redlining for commercial real estate. Understands market-standard lease terms and flags deviations in seconds vs. weeks for outside counsel.",
    category: "AI Devtools",
    source: "Antler",
    launchabilityScore: 81,
    scores: {
      marketTiming: 86,
      marketSize: 76,
      competition: 64,
      techReadiness: 88,
      executionComplexity: 70,
      failureRisk: 38,
    },
    trend: "up",
    weeklyScores: [70, 72, 73, 74, 75, 76, 77, 78, 79, 80, 80, 81],
    failureGraveyard: [
      {
        name: "Kira Systems",
        year: 2022,
        fundingRaised: "$65M",
        failureMode: "Competition",
        cause:
          "Harvey AI raised $100M and undercut on price with a more generalist LLM approach",
      },
    ],
  },
  {
    id: "idea-017",
    title: "B2B Bazaar",
    description:
      "Industrial surplus marketplace for manufacturers. Connects plants offloading excess raw material with buyers who need spot quantities — reducing waste and procurement lead times.",
    category: "Marketplace",
    source: "500",
    launchabilityScore: 73,
    scores: {
      marketTiming: 74,
      marketSize: 80,
      competition: 62,
      techReadiness: 78,
      executionComplexity: 65,
      failureRisk: 52,
    },
    trend: "stable",
    weeklyScores: [68, 69, 70, 70, 71, 72, 72, 73, 73, 73, 73, 73],
    failureGraveyard: [
      {
        name: "Metalshub",
        year: 2023,
        fundingRaised: "$15M",
        failureMode: "PMF",
        cause:
          "Procurement managers preferred incumbent ERP vendor integrations over new standalone tool",
      },
    ],
  },
  {
    id: "idea-018",
    title: "AgriSat",
    description:
      "Satellite-based crop insurance underwriting for emerging markets. Removes manual loss assessment with remote sensing; makes crop insurance viable at the smallholder level.",
    category: "Climate",
    source: "Techstars",
    launchabilityScore: 70,
    scores: {
      marketTiming: 74,
      marketSize: 88,
      competition: 58,
      techReadiness: 72,
      executionComplexity: 50,
      failureRisk: 58,
    },
    trend: "stable",
    weeklyScores: [65, 66, 67, 68, 68, 69, 69, 70, 70, 70, 70, 70],
    failureGraveyard: [
      {
        name: "Acre Africa",
        year: 2022,
        fundingRaised: "$8M",
        failureMode: "Market",
        cause:
          "Willingness-to-pay among smallholders below sustainable price point; subsidy dependency created fragile model",
      },
    ],
  },
  {
    id: "idea-019",
    title: "PromptOps",
    description:
      "LLM prompt versioning, A/B testing, and cost monitoring platform for AI product teams. Treats prompts as first-class software artefacts with CI/CD pipelines.",
    category: "AI Devtools",
    source: "YC",
    launchabilityScore: 88,
    scores: {
      marketTiming: 94,
      marketSize: 80,
      competition: 70,
      techReadiness: 92,
      executionComplexity: 74,
      failureRisk: 30,
    },
    trend: "up",
    weeklyScores: [76, 77, 78, 79, 81, 82, 83, 84, 85, 86, 87, 88],
    failureGraveyard: [
      {
        name: "PromptLayer",
        year: 2024,
        fundingRaised: "$4M",
        failureMode: "Competition",
        cause:
          "LangSmith and Weights & Biases shipped comparable observability features inside existing developer workflows",
      },
    ],
  },
  {
    id: "idea-020",
    title: "LocalBid",
    description:
      "Reverse-auction platform for home services (plumbing, electrical, HVAC). Homeowners post jobs; vetted contractors bid in real time — transparent pricing, no lead-buying.",
    category: "Marketplace",
    source: "Antler",
    launchabilityScore: 66,
    scores: {
      marketTiming: 68,
      marketSize: 82,
      competition: 52,
      techReadiness: 80,
      executionComplexity: 62,
      failureRisk: 65,
    },
    trend: "down",
    weeklyScores: [72, 71, 71, 70, 70, 69, 69, 68, 68, 67, 67, 66],
    failureGraveyard: [
      {
        name: "Homejoy",
        year: 2015,
        fundingRaised: "$38M",
        failureMode: "Regulatory",
        cause:
          "Worker misclassification lawsuits made contractor model legally untenable pre-gig economy reform",
      },
      {
        name: "Thumbtack Pro",
        year: 2023,
        fundingRaised: "$275M",
        failureMode: "PMF",
        cause:
          "Contractors abandoned platform after fee structure changes; quality supply dried up",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FAILURES — 30 failed startups
// ─────────────────────────────────────────────────────────────────────────────

export const FAILURES: FailedStartup[] = [
  {
    id: "fail-001",
    name: "Theranos",
    year: 2018,
    fundingRaised: "$945M",
    timeToFailureMonths: 168,
    failureMode: "Team",
    cause:
      "Fraudulent claims about blood-testing technology; founder deception destroyed company",
    postMortem:
      "Theranos illustrates how charismatic founder narratives can delay due diligence. Science that doesn't work cannot be shipped to market via willpower alone. The lesson: board composition and independent scientific validation aren't optional for medical devices.",
    category: "Healthtech",
  },
  {
    id: "fail-002",
    name: "WeWork",
    year: 2023,
    fundingRaised: "$22B",
    timeToFailureMonths: 108,
    failureMode: "UnitEconomics",
    cause:
      "Long-term leases vs. short-term occupancy created structural liability; COVID accelerated",
    postMortem:
      'WeWork signed 10-year leases and sold month-to-month memberships — a duration mismatch that became fatal in any downturn. The "space as a service" narrative obscured a real estate company with negative working capital.',
    category: "Marketplace",
  },
  {
    id: "fail-003",
    name: "Quibi",
    year: 2020,
    fundingRaised: "$1.75B",
    timeToFailureMonths: 6,
    failureMode: "PMF",
    cause:
      "Mobile-only short-form video launched during stay-at-home orders; no casting to TV",
    postMortem:
      "Quibi bet on commuter consumption habits months before COVID eliminated commuting. The product architecture (mobile-only, no screencasting) was a fatal constraint that couldn't be unwound in 6 months.",
    category: "Marketplace",
  },
  {
    id: "fail-004",
    name: "Vine",
    year: 2017,
    fundingRaised: "$30M",
    timeToFailureMonths: 48,
    failureMode: "Competition",
    cause:
      "Instagram Stories and Snapchat absorbed the short-video creator economy",
    postMortem:
      "Vine invented the short-video format but failed to build creator monetisation before competitors arrived. Without revenue sharing, top creators migrated to platforms that paid. Distribution matters less than creator retention.",
    category: "Marketplace",
  },
  {
    id: "fail-005",
    name: "Jawbone",
    year: 2017,
    fundingRaised: "$930M",
    timeToFailureMonths: 84,
    failureMode: "Competition",
    cause:
      "Apple Watch and Fitbit dominated wearables; Jawbone had persistent hardware quality issues",
    postMortem:
      "Wearables require tight hardware/software integration that startups rarely sustain. Jawbone outsourced hardware manufacturing and paid the price in quality variance. Apple's vertical integration advantage was underestimated.",
    category: "Healthtech",
  },
  {
    id: "fail-006",
    name: "Bolt (US)",
    year: 2022,
    fundingRaised: "$1B",
    timeToFailureMonths: 36,
    failureMode: "Team",
    cause:
      "CEO fraud allegations, fictitious revenue metrics, governance collapse",
    postMortem:
      "Bolt inflated metrics to raise at premium valuations. When fraud surfaced, enterprise trust evaporated overnight. One-click checkout is a commodity feature — the only moat was trust, which was destroyed.",
    category: "Fintech",
  },
  {
    id: "fail-007",
    name: "Fast.co",
    year: 2022,
    fundingRaised: "$124M",
    timeToFailureMonths: 24,
    failureMode: "UnitEconomics",
    cause: "Burning $10M/month with $600K revenue; CAC vastly exceeded LTV",
    postMortem:
      "Fast burned cash acquiring merchants for a checkout product that merchants embedded free. Revenue model was never stress-tested against burn. Hiring at Series B velocity pre-PMF is a company-ending mistake.",
    category: "Fintech",
  },
  {
    id: "fail-008",
    name: "Katerra",
    year: 2021,
    fundingRaised: "$2B",
    timeToFailureMonths: 60,
    failureMode: "UnitEconomics",
    cause:
      "Vertical integration of construction supply chain didn't yield margins to justify capital intensity",
    postMortem:
      "Katerra tried to own every layer of the construction stack: factory, materials, design, GC. Each layer was a commodity with thin margins. Vertical integration amplifies losses when each layer is margin-negative.",
    category: "Marketplace",
  },
  {
    id: "fail-009",
    name: "Zenefits",
    year: 2016,
    fundingRaised: "$583M",
    timeToFailureMonths: 36,
    failureMode: "Regulatory",
    cause:
      "HR software brokers insurance without licences across all 50 states",
    postMortem:
      "Zenefits grew faster than its compliance infrastructure. Selling insurance is a licensed activity — speed-running state-by-state compliance is not optional. Regulatory risk in fintech/insurtech requires legal architecture from day one.",
    category: "Fintech",
  },
  {
    id: "fail-010",
    name: "Maven Clinic Enterprise",
    year: 2024,
    fundingRaised: "$300M",
    timeToFailureMonths: 54,
    failureMode: "Market",
    cause:
      "Employer-funded women's health benefits cut as companies reduced benefit spend",
    postMortem:
      "Maven's model depended on employer HR budgets that proved discretionary in a downturn. Benefits tied to employer goodwill rather than statutory requirement have no floor when layoffs begin.",
    category: "Healthtech",
  },
  {
    id: "fail-011",
    name: "Ofo",
    year: 2019,
    fundingRaised: "$2.2B",
    timeToFailureMonths: 30,
    failureMode: "UnitEconomics",
    cause:
      "Dockless bikes had 6-month lifespan; unit economics never worked at scale",
    postMortem:
      "The dockless bike wars were a race to subsidise rides on hardware that broke or was stolen. Without durability or lock-in, every bike was disposable capex. Hardware startups need repair economics modelled before deployment, not after.",
    category: "Climate",
  },
  {
    id: "fail-012",
    name: "Sprig",
    year: 2017,
    fundingRaised: "$57M",
    timeToFailureMonths: 30,
    failureMode: "UnitEconomics",
    cause:
      "On-demand meals with own kitchens and fleet; fixed costs too high for variable demand",
    postMortem:
      "Owning the kitchen, the fleet, and the last-mile delivery created a cost structure incompatible with restaurant-level margins. DoorDash won by aggregating, not owning. The lesson: don't own assets in thin-margin logistics.",
    category: "Marketplace",
  },
  {
    id: "fail-013",
    name: "Solyndra",
    year: 2011,
    fundingRaised: "$1.03B",
    timeToFailureMonths: 48,
    failureMode: "Market",
    cause:
      "Chinese polysilicon solar panels undercut prices by 80%; cylindrical design moat eliminated",
    postMortem:
      "Solyndra's cylindrical panel technology made sense at $300/panel silicon prices. Chinese manufacturing drove silicon to $20/panel, eliminating the moat. Commodity hardware businesses must model adversarial pricing scenarios.",
    category: "Climate",
  },
  {
    id: "fail-014",
    name: "Yik Yak",
    year: 2017,
    fundingRaised: "$73M",
    timeToFailureMonths: 36,
    failureMode: "Regulatory",
    cause:
      "Cyberbullying and anonymous threat lawsuits forced identity verification, destroying the product",
    postMortem:
      "Anonymous social platforms face an inherent regulatory and ethical paradox. The anonymity that drives virality also drives abuse. When legal pressure forced identity verification, the core value proposition disappeared overnight.",
    category: "Marketplace",
  },
  {
    id: "fail-015",
    name: "Abound (edtech)",
    year: 2023,
    fundingRaised: "$60M",
    timeToFailureMonths: 42,
    failureMode: "PMF",
    cause:
      "B2B2C tutoring marketplace — schools signed but students didn't activate",
    postMortem:
      "Abound sold contracts to school districts but student activation rates were below 8%. Selling to institutional buyers in edtech is only half the problem. End-user adoption requires a product students want to use, not just administrators willing to procure.",
    category: "Edtech",
  },
  {
    id: "fail-016",
    name: "Outcome Health",
    year: 2022,
    fundingRaised: "$487M",
    timeToFailureMonths: 60,
    failureMode: "Team",
    cause:
      "Executives inflated screen impression metrics sold to pharma advertisers",
    postMortem:
      "Outcome Health overstated the number of screens deployed in medical offices to charge pharma companies for ads that never ran. Advertiser fraud at scale destroys trust in an industry that has few second chances. Founder integrity is a non-negotiable.",
    category: "Healthtech",
  },
  {
    id: "fail-017",
    name: "Pony.ai",
    year: 2024,
    fundingRaised: "$1.1B",
    timeToFailureMonths: 72,
    failureMode: "Regulatory",
    cause:
      "US regulatory and geopolitical restrictions on Chinese autonomous vehicle operations",
    postMortem:
      "Pony.ai faced overlapping regulatory risk: AV permitting uncertainty in the US and Chinese tech export restrictions. Dual-jurisdiction AV companies carry geopolitical risk that no amount of engineering excellence can mitigate.",
    category: "AI Devtools",
  },
  {
    id: "fail-018",
    name: "IRL (social)",
    year: 2023,
    fundingRaised: "$170M",
    timeToFailureMonths: 54,
    failureMode: "Team",
    cause:
      "95% of accounts were bots; fabricated engagement metrics to investors",
    postMortem:
      "IRL's event discovery app had 20M claimed users of which 18.9M were fake. Social network valuations collapse when the user base is exposed as artificial. Authentic engagement is the only durable metric in social.",
    category: "Marketplace",
  },
  {
    id: "fail-019",
    name: "Nuvelo",
    year: 2008,
    fundingRaised: "$280M",
    timeToFailureMonths: 96,
    failureMode: "Market",
    cause: "Lead drug alfimeprase failed Phase 3 trial; no pipeline backup",
    postMortem:
      "Single-asset biotech companies carry binary clinical risk. Nuvelo had no pipeline behind alfimeprase and no revenue diversification. When the pivotal trial failed, the company had nothing left to sell or partner. Platform diversification isn't optional in pharma.",
    category: "Healthtech",
  },
  {
    id: "fail-020",
    name: "Plastc",
    year: 2017,
    fundingRaised: "$9M",
    timeToFailureMonths: 30,
    failureMode: "Timing",
    cause:
      "Apple Pay and Google Pay made multi-card digital wallets obsolete before shipping",
    postMortem:
      "Plastc raised crowdfunding to build a universal e-ink card that stored all your credit cards. Apple Pay shipped in the gap between raise and delivery. Hardware startups with 18-month production cycles face platform obsolescence risk.",
    category: "Fintech",
  },
  {
    id: "fail-021",
    name: "Rdio",
    year: 2015,
    fundingRaised: "$17M",
    timeToFailureMonths: 48,
    failureMode: "Competition",
    cause:
      "Spotify's superior catalogue licensing and freemium funnel captured the music streaming market",
    postMortem:
      "Rdio had better UX by most accounts but lost because Spotify secured superior label relationships and invested in a freemium growth engine. In winner-take-most markets, distribution advantage beats product quality.",
    category: "Marketplace",
  },
  {
    id: "fail-022",
    name: "Edacy",
    year: 2022,
    fundingRaised: "$3M",
    timeToFailureMonths: 18,
    failureMode: "PMF",
    cause:
      "MOOC-style upskilling for African professionals; completion rates below 4%",
    postMortem:
      "Edacy imported Western MOOC patterns into West African markets without adapting for bandwidth constraints, credential recognition gaps, and employer hiring behaviour. Market localisation is not optional when TAM assumptions are built on Western behaviour.",
    category: "Edtech",
  },
  {
    id: "fail-023",
    name: "Carbon Engineering (VC bets)",
    year: 2023,
    fundingRaised: "$110M",
    timeToFailureMonths: 84,
    failureMode: "UnitEconomics",
    cause:
      "DAC cost could not get below $400/tonne vs. $50 carbon credit market price",
    postMortem:
      "Direct air capture requires grid-level cost reductions that aren't achievable at seed-to-Series B scale. The unit economics require government backstop pricing that doesn't yet exist universally. Climate hardware has a 15-year, not 5-year, cost curve.",
    category: "Climate",
  },
  {
    id: "fail-024",
    name: "Clinkle",
    year: 2015,
    fundingRaised: "$25M",
    timeToFailureMonths: 18,
    failureMode: "Team",
    cause:
      "Founder inexperience and lavish spending alienated engineering team; product never shipped",
    postMortem:
      "Clinkle raised $25M at Stanford with no product. The founder hired 100 people before shipping anything, spent on perks instead of development, and alienated senior engineers. Execution discipline cannot be bought; it must be modelled by leadership.",
    category: "Fintech",
  },
  {
    id: "fail-025",
    name: "Airtm",
    year: 2024,
    fundingRaised: "$30M",
    timeToFailureMonths: 72,
    failureMode: "Regulatory",
    cause:
      "OFAC sanctions enforcement shut off dollar access corridors in Venezuela and Iran",
    postMortem:
      "Airtm served unbanked populations in sanctioned markets. When OFAC enforcement tightened, their most active corridors were severed. Fintech serving sanctioned geographies must model regulatory shutdown scenarios as a base case, not a tail risk.",
    category: "Fintech",
  },
  {
    id: "fail-026",
    name: "Pager (telehealth)",
    year: 2023,
    fundingRaised: "$100M",
    timeToFailureMonths: 60,
    failureMode: "Market",
    cause:
      "Post-COVID telehealth reimbursement rates normalised; payer contracts repriced down 40%",
    postMortem:
      "Pager built its model on pandemic-era telehealth reimbursement rates that regulators treated as temporary emergency measures. When rates normalised, the revenue per visit dropped below sustainable. Healthcare models must be built on permanent reimbursement assumptions.",
    category: "Healthtech",
  },
  {
    id: "fail-027",
    name: "Ecoflow B2B",
    year: 2023,
    fundingRaised: "$20M",
    timeToFailureMonths: 24,
    failureMode: "Timing",
    cause:
      "Enterprise battery procurement cycles too long; grid parity arrived before deployments scaled",
    postMortem:
      "Ecoflow's B2B division targeted enterprise facilities management — a 12-18 month procurement cycle for pilot approvals. By the time pilots concluded, grid battery costs had fallen and large incumbents had retooled. Enterprise hardware timing risk is underappreciated.",
    category: "Climate",
  },
  {
    id: "fail-028",
    name: "Springboard (pivot)",
    year: 2024,
    fundingRaised: "$61M",
    timeToFailureMonths: 84,
    failureMode: "Market",
    cause:
      "Tech hiring freeze eliminated ISA conversion events; job placement rates collapsed",
    postMortem:
      "Springboard's Income Share Agreement model required students to get tech jobs to trigger repayment. When the 2022-2023 tech hiring freeze hit, ISA conversion rates collapsed. Human capital financing models carry hidden correlation with macro hiring cycles.",
    category: "Edtech",
  },
  {
    id: "fail-029",
    name: "Lunit (early stage)",
    year: 2021,
    fundingRaised: "$45M",
    timeToFailureMonths: 48,
    failureMode: "Regulatory",
    cause:
      "FDA 510(k) clearance delays pushed go-to-market 3 years; burned runway waiting",
    postMortem:
      "Medical AI imaging companies routinely underestimate FDA clearance timelines. Lunit's early projections assumed 12 months for clearance; the actual process took 38 months. Clinical AI startups must raise for 5 years of runway, not 18 months.",
    category: "Healthtech",
  },
  {
    id: "fail-030",
    name: "CloudLeaf",
    year: 2022,
    fundingRaised: "$18M",
    timeToFailureMonths: 42,
    failureMode: "PMF",
    cause:
      "IoT sensor platform for supply chain — customers wanted software value, not sensor hardware",
    postMortem:
      "CloudLeaf sold sensor+software bundles to supply chain operators who already had sensor infrastructure. The hardware was table stakes; the data platform was the value. Selling bundled hardware is a 10x harder sale than pure SaaS. Separate the hardware pilot from the software contract.",
    category: "AI Devtools",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────

const avgScore = Math.round(
  IDEAS.reduce((sum, idea) => sum + idea.launchabilityScore, 0) / IDEAS.length,
);

// Count ideas per category to find top
const categoryCounts = IDEAS.reduce<Record<string, number>>((acc, idea) => {
  acc[idea.category] = (acc[idea.category] ?? 0) + 1;
  return acc;
}, {});

const topCategory = Object.entries(categoryCounts).sort(
  ([, a], [, b]) => b - a,
)[0][0] as Category;

export const STATS: Stats = {
  totalIdeas: IDEAS.length,
  totalFailures: FAILURES.length,
  avgScore,
  topCategory,
};
