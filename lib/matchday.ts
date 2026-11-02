export type Match = {
  home: string;
  away: string;
  competition: string;
  kickoff: string;
  venue: string | null;
  state: "upcoming" | "live" | "ft";
  score: { home: number; away: number } | null;
};

type Upstream = {
  id: number;
  utcDate: string;
  status: string;
  venue?: string | null;
  competition: { name: string };
  homeTeam: { name: string; shortName?: string | null };
  awayTeam: { name: string; shortName?: string | null };
  score?: { fullTime?: { home: number | null; away: number | null } };
};

const API = "https://api.football-data.org/v4";
const REAL_MADRID = 86;
const DAY = 24 * 60 * 60 * 1000;
const FIXTURES_CACHE = 6 * 60 * 60;
const LIVE_CACHE = 60;
// A result stays up for a day after kick-off, then the next fixture takes over.
const RESULT_WINDOW = DAY;

const STATES: Record<string, Match["state"]> = {
  SCHEDULED: "upcoming",
  TIMED: "upcoming",
  IN_PLAY: "live",
  PAUSED: "live",
  FINISHED: "ft",
  AWARDED: "ft",
};

async function upstream<T>(path: string, token: string, revalidate: number): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { "X-Auth-Token": token },
    next: { revalidate },
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error(`football-data ${response.status}`);
  return response.json();
}

function pickMatch(matches: Upstream[], now: number) {
  const inOrder = [...matches].sort((a, b) => Date.parse(a.utcDate) - Date.parse(b.utcDate));
  return (
    inOrder.find((match) => STATES[match.status] === "live") ??
    inOrder.findLast(
      (match) => STATES[match.status] === "ft" && now - Date.parse(match.utcDate) < RESULT_WINDOW,
    ) ??
    inOrder.find((match) => STATES[match.status] === "upcoming")
  );
}

function toMatch(match: Upstream): Match | null {
  const state = STATES[match.status];
  if (!state) return null;
  const { home, away } = match.score?.fullTime ?? {};
  return {
    home: match.homeTeam.shortName ?? match.homeTeam.name,
    away: match.awayTeam.shortName ?? match.awayTeam.name,
    competition: match.competition.name,
    kickoff: match.utcDate,
    venue: match.venue ?? null,
    state,
    score: state !== "upcoming" && home != null && away != null ? { home, away } : null,
  };
}

/** Real Madrid's current or next match. Null when there's no key or the API is having a day. */
export async function getMatchday(now = Date.now()): Promise<Match | null> {
  const token = process.env.FOOTBALL_DATA_KEY;
  if (!token) return null;
  try {
    const dateFrom = new Date(now - DAY).toISOString().slice(0, 10);
    const dateTo = new Date(now + 45 * DAY).toISOString().slice(0, 10);
    const { matches } = await upstream<{ matches: Upstream[] }>(
      `/teams/${REAL_MADRID}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      token,
      FIXTURES_CACHE,
    );
    const picked = pickMatch(matches, now);
    if (!picked) return null;
    // The fixture list can be six hours old, so once a match has kicked off, ask about it directly.
    const underway = Date.parse(picked.utcDate) <= now && STATES[picked.status] !== "ft";
    return toMatch(underway ? await upstream<Upstream>(`/matches/${picked.id}`, token, LIVE_CACHE) : picked);
  } catch {
    return null;
  }
}
