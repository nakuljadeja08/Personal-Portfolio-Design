import { profile } from "./profile";

export type Command = { answer: string; links?: { label: string; href: string }[] };

// Written in advance, so the box can't make anything up. Every claim has to match the résumé.
export const commands: Record<string, Command> = {
  projects: {
    answer: "Three in the loadout: a coach that has to show its work, an AI trader on a short leash, and a search engine that came 2nd. Each has a full case study.",
    links: [{ label: "See the loadout →", href: "#projects" }],
  },
  fintech: {
    answer: "Short version: I built Orblex Industries, where Claude proposes trades and Python rules decide what gets through, got Bloomberg Market Concepts certified, and I'd like to do this for a living. I've switched the résumé picker to Fintech for you.",
    links: [
      { label: "Fintech résumé ↓", href: profile.resumes.fintech },
      { label: "Book a fixture →", href: "#contact" },
    ],
  },
  stack: {
    answer: "SQL and Python in goal. Azure, Docker, GitHub Actions and Supabase at the back. Azure Data Factory, Databricks and Airflow in midfield. Snowflake, Power BI and React up front.",
    links: [{ label: "See the team sheet →", href: "#skills" }],
  },
  resume: {
    answer: "Two cuts, Fintech and General. Same me, different project up front.",
    links: [
      { label: "Fintech ↓", href: profile.resumes.fintech },
      { label: "General ↓", href: profile.resumes.general },
    ],
  },
  contact: {
    answer: `${profile.email} is the fastest way to reach me.`,
    links: [
      { label: "Email →", href: `mailto:${profile.email}` },
      { label: "LinkedIn ↗", href: profile.linkedin },
      { label: "GitHub ↗", href: profile.github },
    ],
  },
  madrid: {
    answer: "Real Madrid, always. The fixtures live in Off the pitch, whenever the API and I are on speaking terms.",
    links: [{ label: "Off the pitch →", href: "#life" }],
  },
  val: {
    answer: `Peak ${profile.valorantPeak}. Riot ID: ${profile.riotId}. Be nice, I'm supposed to be job hunting.`,
  },
  help: {
    answer: "Try: projects, fintech, stack, resume, contact, madrid, val. I only know what I've been told, which is more than most chatbots admit.",
  },
};

export const commandAliases: Record<string, string> = {
  project: "projects",
  loadout: "projects",
  bank: "fintech",
  banking: "fintech",
  finance: "fintech",
  skills: "stack",
  "résumé": "resume",
  cv: "resume",
  email: "contact",
  hire: "contact",
  "real madrid": "madrid",
  valorant: "val",
};

export const commandSuggestions = ["projects", "fintech", "stack", "resume", "contact"] as const;

export const commandCopy = {
  trigger: "ask",
  title: "Ask my pipeline",
  hint: "/ to open · esc",
  close: "close",
  placeholder: "try: projects, stack, resume",
  inputLabel: "Ask my pipeline",
  welcome: "It's not an LLM, so it only answers what I've written down. Nothing here gets hallucinated.",
  miss: "No rows matched. Try help.",
};
