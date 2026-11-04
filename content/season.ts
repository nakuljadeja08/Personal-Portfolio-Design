export type Fixture = {
  season: string;
  company: string;
  venue: string;
  role: string;
  result: { value: string; label: string; dir: "up" | "none" };
  report: string[];
  /** Quoted word for word from a LinkedIn recommendation, cut only where the ellipsis says so (and his hyphen set as a dash). */
  quote?: { text: string; name: string; title: string };
};

export const seasonCopy = {
  eyebrow: "02 · Season",
  title: "The season so far.",
  intro: "Three clubs and one trip back to school, and nobody has relegated me yet. Newest first. Open any fixture for the match report.",
  defaultOpen: "ExxonMobil",
  next: { season: "Next", title: "Your team?", cta: "Book a fixture →", href: "#contact" },
};

// Newest first. Tell it like a story, but every number and claim has to match the résumé.
export const fixtures: Fixture[] = [
  {
    season: "2026",
    company: "Return on Creators",
    venue: "Jersey City, NJ (remote)",
    role: "Data Engineering Intern",
    result: { value: "W", label: "every brand in its own lane", dir: "up" },
    report: [
      "Brands wanted to find the right creators, so I worked on the scoring logic that ranks them and put the results in views brands could use without asking anyone.",
      "Production is no place to try out a schema change, so I set up a separate Supabase staging environment, with CI/CD and migrations synced over from production automatically.",
      "Then came Row-Level Security, so each brand only sees its own data, plus indexing and query rewrites so nobody waits as long to see it.",
    ],
  },
  {
    season: "2025–26",
    company: "Stevens Institute of Technology",
    venue: "Hoboken, NJ",
    role: "MS Computer Science",
    result: { value: "MS", label: "expected December 2026", dir: "none" },
    report: [
      "After two years at ExxonMobil I went back to school for a master's in computer science. Call it a very long pre-season.",
      "Along the way I picked up the Snowflake and IBM data engineering certificates, plus Bloomberg Market Concepts, because if I'm going to work around money I should probably speak the language.",
    ],
  },
  {
    season: "2023–25",
    company: "ExxonMobil",
    venue: "Bengaluru, India",
    role: "Data Engineer II",
    result: { value: "$5M", label: "saved every year", dir: "up" },
    report: [
      "Drilling data comes from everywhere and agrees on very little. I built ETL pipelines with Azure Data Factory and Databricks to get it all into Snowflake and Azure Data Lake Gen2.",
      "I led the Hole Section Grading project (yes, that's its real name), which turned data from many sources into one standard set of KPIs. Evaluation errors fell 15%, and it earned me 2 leadership recommendation letters.",
      "I also automated our deployments through GitHub, which cut deployment time by 82%.",
      "On top of the pipelines sat the Spotfire and Power BI reports. 200+ engineers adopted them, and they generated $5M in annual savings.",
    ],
    quote: {
      text: "His ability to grasp complex concepts and apply them practically was remarkable. … Beyond his technical skills, Nakul is a natural communicator — confident, articulate, and always approachable.",
      name: "Piyush Namdeo",
      title: "Wells Analytics Engineer, ExxonMobil",
    },
  },
  {
    season: "2021–22",
    company: "Regal Shipping",
    venue: "Kutch, India",
    role: "Data Engineering Intern",
    result: { value: "12%", label: "off vessel turnaround time", dir: "up" },
    report: [
      "Where it started: an internship at a shipping company, building SQL dashboards for fuel use, voyage duration and maintenance.",
      "Compliance tracking improved 20% and vessel turnaround time dropped 12%. Turns out ships behave better when someone is watching the numbers.",
    ],
  },
];
