"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { matchdayCopy } from "@/content/life";
import type { Match } from "@/lib/matchday";
import { fadeUp } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./MatchdayWidget.module.css";

const MINUTE = 60 * 1000;

function countdown(ms: number) {
  const minutes = Math.ceil(ms / MINUTE);
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor(minutes / 60) % 24;
  const pad = (value: number) => String(value).padStart(2, "0");
  if (days) return `T−${days}d ${pad(hours)}h`;
  if (hours) return `T−${hours}h ${pad(minutes % 60)}m`;
  return `T−${minutes}m`;
}

function localKickoff(kickoff: string) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(kickoff));
}

export function MatchdayCard({ match, now }: { match: Match; now: number }) {
  const reduced = useReducedMotion();
  const untilKickoff = Date.parse(match.kickoff) - now;
  return (
    <m.article
      className={`nl-panel ${styles.card}`}
      variants={fadeUp}
      initial={reduced ? false : "hidden"}
      animate="shown"
    >
      <h3 className={`nl-label ${styles.top}`}>
        {match.state === "upcoming" && <span>{matchdayCopy.next}</span>}
        {match.state === "live" && (
          <span>
            <span className="nl-dot" /> <b className="nl-up">{matchdayCopy.live}</b>
          </span>
        )}
        {match.state === "ft" && <span>{matchdayCopy.fullTime}</span>}
        <span>{match.competition}</span>
      </h3>

      <p className={styles.teams}>
        <span className="nl-title">{match.home}</span>
        {match.score ? (
          <span className={`nl-score ${styles.score}`}>
            {match.score.home}–{match.score.away}
          </span>
        ) : (
          <span className={`nl-data ${styles.vs}`}>vs</span>
        )}
        <span className="nl-title">{match.away}</span>
      </p>

      {match.state === "upcoming" && (
        <p className={`nl-data ${styles.when}`}>
          {localKickoff(match.kickoff)} {matchdayCopy.yourTime} ·{" "}
          <b>{untilKickoff > 0 ? countdown(untilKickoff) : matchdayCopy.kickoff}</b>
          {match.venue && <span className={styles.venue}>{match.venue}</span>}
        </p>
      )}

      <p className={`nl-body ${styles.footer}`}>{matchdayCopy.footer}</p>
    </m.article>
  );
}

async function fetchMatch(): Promise<Match | null> {
  try {
    const response = await fetch("/api/matchday");
    return response.ok ? ((await response.json()).match as Match | null) : null;
  } catch {
    return null;
  }
}

/** Renders nothing at all until there's a real fixture to show. */
export function MatchdayWidget() {
  const [match, setMatch] = useState<Match | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchMatch().then((next) => {
      if (cancelled) return;
      setNow(Date.now());
      setMatch(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Ticks the countdown, and asks for a fresh score once the match is underway.
  useEffect(() => {
    if (!match) return;
    const timer = setInterval(() => {
      setNow(Date.now());
      if (match.state !== "ft" && Date.parse(match.kickoff) <= Date.now()) fetchMatch().then(setMatch);
    }, MINUTE);
    return () => clearInterval(timer);
  }, [match]);

  return match ? <MatchdayCard match={match} now={now} /> : null;
}
