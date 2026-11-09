export type Ability = {
  key: "Q" | "E" | "C" | "X";
  name: string;
  detail: string;
};

export type TickerItem = {
  value: string;
  text: string;
  dir: "up" | "down" | "none";
};

export const profile = {
  name: "Nakul Jadeja",
  initials: "NJ",
  role: "Data Engineer",
  location: "New York, NY",
  rank: "DE II",
  headline: "Hi, I'm Nakul. I build data pipelines.",
  lead: [
    "I've wrangled data about ships, then oil wells, then internet creators. Now I'm looking for a full-time data engineering job, and I'm not fussy about what the data's about, as long as it's messy.",
    "Off the clock I run, lift, and take Real Madrid results personally.",
  ],
  status: "Free agent · open to data engineering roles",
  resumeCta: "Download résumé ↓",
  contactCta: "Say hello →",
  valorantPeak: "Immortal 1",
  riotId: "nakuljadeja08",
  email: "nakuljadeja08@gmail.com",
  linkedin: "https://linkedin.com/in/nakul-jadeja-797a29197",
  github: "https://github.com/nakuljadeja08",
  education: [
    { school: "Stevens Institute of Technology", degree: "MS Computer Science", dates: "Aug 2025 – Dec 2026 (expected)" },
    { school: "Vellore Institute of Technology", degree: "BTech Computer Science", dates: "July 2019 – April 2023" },
  ],
  resumes: {
    fintech: "/resumes/Nakul_Jadeja_Resume_Fintech.pdf",
    general: "/resumes/Nakul_Jadeja_Resume_General.pdf",
  },
} as const;

export const abilities: Ability[] = [
  { key: "Q", name: "ETL", detail: "gets data from A to B in one piece" },
  { key: "E", name: "Lineage", detail: "knows where every number grew up" },
  { key: "C", name: "CI/CD", detail: "deploys nobody has to babysit" },
  { key: "X", name: "Ultimate", detail: "one version of the truth. Long cooldown." },
];

export const tickerItems: TickerItem[] = [
  { value: "$5M", text: "annual savings · ExxonMobil", dir: "up" },
  { value: "82%", text: "deploy time cut · CI/CD", dir: "up" },
  { value: "200+", text: "engineers on my dashboards", dir: "up" },
  { value: "15%", text: "fewer drilling evaluation errors", dir: "up" },
  { value: "2nd", text: "place · RoCathon hackathon", dir: "none" },
  { value: "MS CS", text: "Stevens · expected Dec 2026", dir: "none" },
  { value: "12%", text: "vessel turnaround cut · Regal", dir: "up" },
];
