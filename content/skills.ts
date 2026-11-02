export type Skill = { name: string; where: string };

export type FormationLine = {
  id: "attack" | "midfield" | "defence" | "keeper";
  label: string;
  job: string;
  skills: Skill[];
};

export const formationCopy = {
  eyebrow: "02 · Formation 4-3-3",
  title: "The starting twelve.",
  intro: [
    "Yes, that's twelve players and two keepers. SQL and Python both refused to sit on the bench, so I stopped asking.",
    "Hover or tap anyone to see what they've actually done.",
  ],
  defaultSkill: "Databricks",
};

// Each `where` names work on the résumé or a public repo. Be funny about it, but don't stretch it.
export const formation: FormationLine[] = [
  {
    id: "attack",
    label: "Attack",
    job: "what people actually see",
    skills: [
      { name: "Snowflake", where: "Where my ExxonMobil pipelines delivered the data." },
      { name: "Power BI", where: "Put the reports in front of 200+ engineers at ExxonMobil." },
      { name: "React", where: "Built the Decision Trace dashboard for Wayne Industries." },
    ],
  },
  {
    id: "midfield",
    label: "Midfield",
    job: "moves the data and shapes it",
    skills: [
      { name: "Azure DF", where: "Fetched data from all over the place at ExxonMobil." },
      { name: "Databricks", where: "Did the heavy lifting on transforms at ExxonMobil." },
      { name: "Airflow", where: "Kept my Twitter pipeline side project on schedule." },
    ],
  },
  {
    id: "defence",
    label: "Defence",
    job: "keeps everything standing",
    skills: [
      { name: "Azure", where: "Home of the data lake at ExxonMobil." },
      { name: "Docker", where: "Reliable squad player. No highlight reel yet." },
      { name: "GH Actions", where: "Fails my VALORANT Copilot build if an export drifts by a byte." },
      { name: "Supabase", where: "Kept each brand out of the others' data at Return on Creators." },
    ],
  },
  {
    id: "keeper",
    label: "Keepers",
    job: "the last line, and the first thing I reach for",
    skills: [
      { name: "SQL", where: "In goal since the Regal Shipping fleet dashboards." },
      { name: "Python", where: "Enforces the risk limits at Wayne Industries before the LLM gets a say." },
    ],
  },
];
