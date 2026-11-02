export type Signing = {
  id: string;
  problem: string;
  position: "GK" | "DEF" | "MID" | "ATT" | "VAR";
  player: string;
  stat: { value: string; label: string };
  evidence: string;
  /** Picks the Fintech résumé, which puts this work up front. */
  fintech?: boolean;
};

export const MAX_SIGNINGS = 3;

export const transferCopy = {
  eyebrow: "03 · Transfer window",
  title: "Now you pick.",
  intro: "What's going wrong at your club? Pick up to three problems and I'll send out whoever has handled it before. Every number comes from real work.",
  problemsLabel: "Problems at your club",
  sheetLabel: "Team sheet",
  openSlot: "Open slot",
  // Indexed by how many players have been signed.
  verdicts: [
    "Nobody signed yet. The window's open.",
    "One signing. Bold, but there's room for two more.",
    "Two in. One slot left, so choose carefully.",
    "Squad's full. All that's left is the contract.",
  ],
  windowClosed: "Budget's gone. Drop someone to sign someone else.",
  contactCta: "Book the fixture →",
  cutNote: { fintech: "Fintech cut", general: "General cut" },
};

// Same rule as the rest of the site: every number and claim has to match the résumé or a public repo.
export const signings: Signing[] = [
  {
    id: "deploys",
    problem: "Deploys take forever",
    position: "DEF",
    player: "GitHub Actions",
    stat: { value: "82%", label: "less deployment time" },
    evidence: "At ExxonMobil I automated our deployments through GitHub, and the waiting mostly went away.",
  },
  {
    id: "disagree",
    problem: "Everyone's numbers disagree",
    position: "MID",
    player: "Databricks",
    stat: { value: "15%", label: "fewer evaluation errors" },
    evidence: "At ExxonMobil I led the project that turned drilling data from many sources into one set of KPIs. Yes, it was called Hole Section Grading.",
  },
  {
    id: "reports",
    problem: "Nobody opens our reports",
    position: "ATT",
    player: "Power BI",
    stat: { value: "$5M", label: "saved every year" },
    evidence: "My Spotfire and Power BI reports at ExxonMobil got adopted by 200+ engineers, which is 200 more than usually read a report.",
  },
  {
    id: "explain",
    problem: "No one can explain a number",
    position: "VAR",
    player: "The Watchdog",
    stat: { value: "0", label: "bytes of drift, or the build fails" },
    evidence: "My VALORANT Copilot traces every stat to its raw rows, and a Watchdog re-checks each one before it's allowed to speak.",
  },
  {
    id: "access",
    problem: "Customers could see each other's data",
    position: "DEF",
    player: "Supabase",
    stat: { value: "RLS", label: "every brand in its own lane" },
    evidence: "At Return on Creators I set up Row-Level Security, plus a staging environment so schema changes stopped rehearsing in production.",
  },
  {
    id: "ai",
    problem: "We're letting AI near the money",
    position: "GK",
    player: "Python",
    stat: { value: "6", label: "agents, zero say on risk limits" },
    evidence: "In my Wayne Industries project, Python sets the risk limits before the LLM gets a vote, because I've met LLMs.",
    fintech: true,
  },
  {
    id: "guesswork",
    problem: "Operations run on guesswork",
    position: "GK",
    player: "SQL",
    stat: { value: "12%", label: "off vessel turnaround time" },
    evidence: "My SQL dashboards at Regal Shipping tracked fuel, voyages and maintenance. Ships behave better when someone's watching.",
  },
];
