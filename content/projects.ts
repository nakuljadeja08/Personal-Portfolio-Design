export type Project = {
  slot: string;
  /** Matches a case study in caseStudies.ts. */
  slug: string;
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
  intro: "Three projects, one number each. Open any of them for the full case study: how it's built, why, and what it still can't do.",
};

export const projects: Project[] = [
  {
    slot: "01",
    slug: "valorant-copilot",
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
    slug: "orblex-industries",
    title: "Orblex Industries",
    year: "2026",
    pitch: "Claude reads the market and proposes swing trades. Python owns every number and limit, and can only make a trade smaller or stop it. I still approve every order, because I've met LLMs.",
    stat: { value: "0", label: "limits the model is allowed to loosen" },
    stack: ["Python", "Claude API", "Supabase", "React"],
    links: {
      repo: "https://github.com/nakuljadeja08/orblex-industries",
      live: "https://www.orblexindustries.com",
    },
  },
  {
    slot: "03",
    slug: "rocathon-search",
    title: "RoCathon Search",
    year: "2025",
    pitch: "A hackathon search engine for finding the right creators. Keyword search and embeddings each had their own opinion, so Reciprocal Rank Fusion makes them settle it.",
    stat: { value: "2nd", label: "place. I'm fine about it." },
    stack: ["TypeScript", "PostgreSQL", "pgvector", "OpenAI Embeddings", "Supabase"],
    links: { repo: "https://github.com/nakuljadeja08/RoCathon-SearchEngine" },
  },
];
