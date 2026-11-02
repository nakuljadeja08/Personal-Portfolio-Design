export type TrainingWeek = { label: string; km: number };
export type TrainingPr = { lift: string; value: string; date: string };
export type Training = { updatedAt: string | null; weeks: TrainingWeek[]; prs: TrainingPr[] };
export type Clip = { title: string; href: string };

export const lifeCopy = {
  eyebrow: "07 · Off the pitch",
  title: "What I do when the pipelines are green.",
  intro: "Running, lifting, Real Madrid and Valorant. All four keep score, and none of them care how my day went.",
};

export const matchdayCopy = {
  next: "Next match",
  live: "Live",
  fullTime: "Full time",
  kickoff: "Kick-off",
  yourTime: "your time",
  footer: "Real Madrid fan. I watch the stats as closely as the match, which doesn't help either.",
};

export const trainingCopy = {
  runTitle: "Running · last 12 weeks",
  scoreLabel: "km in 12 weeks",
  thisWeek: "This week",
  lineage: "source: strava → actions → json · updated",
  note: "Yes, my running has its own data pipeline. Old habits.",
  prTitle: "Lift PRs",
};

export const highlightsCopy = {
  eyebrow: "Valorant",
  peakLabel: "Peak rank",
  line: "It doesn't go on the résumé, but it does go here.",
  riotLabel: "Riot ID",
  clipsLabel: "Highlights",
  empty: "Clips coming soon. I'm being picky, since my best rounds and my recorded rounds have rarely met.",
};

// Add a clip here and it replaces the empty line above.
export const clips: Clip[] = [];
