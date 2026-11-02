export type Trophy = {
  name: string;
  issuer: string;
  date: string;
  note: string;
  /** Only for the big ones. Gets the large card and a number. */
  stat?: { value: string; label: string };
  verify?: string;
};

export type Shelf = { id: string; label: string; trophies: Trophy[] };

export const cabinetCopy = {
  eyebrow: "06 · Trophy cabinet",
  title: "The trophy cabinet.",
  intro: "The certificates that matter for this job, and links so you can check I'm not making them up. The rest are on the bench, including one on solar cells.",
  verify: "Verify ↗",
};

// Every entry comes from a certificate on file, apart from Bloomberg, which comes from the résumé.
// A shelf with no trophies stays hidden, so the last two appear once something goes on them.
export const shelves: Shelf[] = [
  {
    id: "major",
    label: "Data and finance",
    trophies: [
      {
        name: "IBM Data Engineering Professional Certificate",
        issuer: "IBM · Coursera",
        date: "Mar 2026",
        note: "SQL, Spark, Airflow, Kafka and a capstone. I took it after two years of doing the job, which is a striker going back for shooting drills.",
        stat: { value: "16", label: "courses" },
        verify: "https://coursera.org/verify/professional-cert/ECISYRBHKYF0",
      },
      {
        name: "Snowflake Data Engineering Professional Certificate",
        issuer: "Snowflake · Coursera",
        date: "Jun 2026",
        note: "Ingestion, transformation, orchestration and observability, on the warehouse my ExxonMobil pipelines already delivered to.",
        stat: { value: "3", label: "courses" },
        verify: "https://coursera.org/verify/professional-cert/1PBPDS82B26I",
      },
      {
        name: "Bloomberg Market Concepts",
        issuer: "Bloomberg",
        date: "Oct 2026",
        note: "How markets work, from the people whose terminal they work on.",
      },
      {
        name: "SQL (Intermediate)",
        issuer: "HackerRank",
        date: "Oct 2025",
        note: "A test rather than a course, so no watching the videos at double speed.",
        verify: "https://www.hackerrank.com/certificates/493274d91a80",
      },
      {
        name: "Introduction to Financial Markets",
        issuer: "Indian School of Business · Coursera",
        date: "Nov 2020",
        note: "Taken years before I admitted where this was heading.",
        verify: "https://coursera.org/verify/B55DXWJH9CKG",
      },
    ],
  },
  { id: "co-curricular", label: "Co-curricular", trophies: [] },
  { id: "extra-curricular", label: "Extra-curricular", trophies: [] },
];
