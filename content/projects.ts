export type Project = {
  slot: string;
  title: string;
  year: string;
  pitch: string;
  stat: { value: string; label: string };
  stack: string[];
  links: { repo?: string; live?: string };
};

export const loadoutCopy = {
  eyebrow: "05 · Loadout",
  title: "The loadout.",
  intro: "Three projects, no screenshots. Each one gets a single number to make its case.",
};

export const projects: Project[] = [
  {
    slot: "01",
    title: "VALORANT Coaching Copilot",
    year: "2026",
    pitch: "I hit Immortal 1 and still wanted a second opinion, so I built a coach that has to show its work. Every stat traces back to its raw rows, and a Watchdog re-checks each one before it's allowed to speak.",
    stat: { value: "0", label: "bytes of drift, or CI fails the build" },
    stack: ["Python", "SQLite", "React", "GitHub Actions", "Vercel"],
    links: {
      repo: "https://github.com/nakuljadeja08/valorant-copilot",
      live: "https://valorant-copilot.vercel.app",
    },
  },
  {
    slot: "02",
    title: "Wayne Industries",
    year: "2026",
    pitch: "Six AI agents run a portfolio and audit themselves. Python sets the risk limits before the LLM gets a vote, because I've met LLMs. A four-step Decision Trace explains every allocation.",
    stat: { value: "6", label: "agents, zero say on risk limits" },
    stack: ["Python", "Claude API", "Supabase", "React"],
    links: { live: "https://portfolio-managment-one.vercel.app" },
  },
  {
    slot: "03",
    title: "RoCathon Search",
    year: "2025",
    pitch: "A hackathon search engine for finding the right creators. Keyword search and embeddings each had their own opinion, so Reciprocal Rank Fusion makes them settle it.",
    stat: { value: "2nd", label: "place. I'm fine about it." },
    stack: ["TypeScript", "PostgreSQL", "pgvector", "OpenAI Embeddings", "Supabase"],
    links: { repo: "https://github.com/nakuljadeja08/RoCathon-SearchEngine" },
  },
];
