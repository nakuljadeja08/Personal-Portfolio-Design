// Strava → weekly kilometres → data/training.json. Run nightly by .github/workflows/training-sync.yml.
// Only weekly totals are written, so no routes, start times or locations ever reach the site.
import { readFile, writeFile } from "node:fs/promises";

const OUTPUT = new URL("../data/training.json", import.meta.url);
const WEEKS = 12;
const DAY = 24 * 60 * 60 * 1000;
const PAGE_SIZE = 200;

const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } = process.env;

const label = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function mondayOf(time) {
  const midnight = time - (time % DAY);
  const daysSinceMonday = (new Date(midnight).getUTCDay() + 6) % 7;
  return midnight - daysSinceMonday * DAY;
}

async function json(response) {
  if (!response.ok) throw new Error(`Strava said ${response.status} for ${response.url}`);
  return response.json();
}

async function accessToken() {
  const { access_token: token, refresh_token: refreshToken } = await json(
    await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        refresh_token: STRAVA_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    }),
  );
  if (refreshToken !== STRAVA_REFRESH_TOKEN) {
    // Printed as a warning, not the token: Action logs can be public.
    console.log("::warning::Strava rotated the refresh token. Re-authorise and update STRAVA_REFRESH_TOKEN.");
  }
  return token;
}

async function runsSince(start, token) {
  const runs = [];
  for (let page = 1; ; page++) {
    const query = new URLSearchParams({ after: String(start / 1000), per_page: String(PAGE_SIZE), page: String(page) });
    const activities = await json(
      await fetch(`https://www.strava.com/api/v3/athlete/activities?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    );
    runs.push(...activities.filter((activity) => /Run$/.test(activity.sport_type ?? activity.type)));
    if (activities.length < PAGE_SIZE) return runs;
  }
}

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
  console.log("::notice::No Strava secrets set, so data/training.json stays as it is.");
  process.exit(0);
}

const now = Date.now();
const thisWeek = mondayOf(now);
const firstWeek = thisWeek - (WEEKS - 1) * 7 * DAY;
// One day early, because Strava's `after` is UTC and weeks here follow the runner's local date.
const runs = await runsSince(firstWeek - DAY, await accessToken());

const metres = new Map();
for (const run of runs) {
  const week = mondayOf(Date.parse(run.start_date_local));
  metres.set(week, (metres.get(week) ?? 0) + run.distance);
}

const weeks = Array.from({ length: WEEKS }, (_, index) => {
  const week = firstWeek + index * 7 * DAY;
  return { label: label.format(week), km: Math.round((metres.get(week) ?? 0) / 100) / 10 };
});

// PRs are typed in by hand, since Strava doesn't know what I deadlift.
const { prs } = JSON.parse(await readFile(OUTPUT, "utf8"));
await writeFile(OUTPUT, `${JSON.stringify({ updatedAt: new Date(now).toISOString(), weeks, prs }, null, 2)}\n`);
console.log(`Wrote ${runs.length} runs into ${WEEKS} weeks.`);
