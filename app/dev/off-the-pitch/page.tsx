"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { MatchdayCard } from "@/components/MatchdayWidget";
import { OffThePitch } from "@/components/OffThePitch";
import type { Training } from "@/content/life";
import type { Match } from "@/lib/matchday";

// Review page for the states the real section can't show until the keys are in. Sample numbers
// only, and it 404s in production, so none of them can reach a visitor.
const NOW = Date.parse("2026-11-01T12:00:00Z");

const fixture = { home: "Real Madrid", away: "Sample FC", competition: "Sample League", venue: "Sample Stadium" };

const matches: Match[] = [
  { ...fixture, kickoff: "2026-11-03T20:00:00Z", state: "upcoming", score: null },
  { ...fixture, kickoff: "2026-11-01T11:00:00Z", state: "live", score: { home: 2, away: 1 } },
  { ...fixture, kickoff: "2026-10-31T20:00:00Z", state: "ft", score: { home: 3, away: 0 } },
];

const km = [8, 12, 10, 14, 9, 0, 13, 6, 12, 15, 14, 18];
const training: Training = {
  updatedAt: "2026-11-01T10:00:00Z",
  weeks: km.map((value, index) => ({ label: `Week ${index + 1}`, km: value })),
  prs: [
    { lift: "Sample lift", value: "100 kg", date: "Sample date" },
    { lift: "Sample run", value: "25:00", date: "Sample date" },
  ],
};

const clips = [
  { title: "Sample clip one", href: "https://example.com/1" },
  { title: "Sample clip two", href: "https://example.com/2" },
];

export default function OffThePitchSamples() {
  if (process.env.NODE_ENV === "production") notFound();
  // The real card only renders after its fetch, so the samples wait for the browser too.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <main>
      <div className="nl-page" style={{ paddingBlock: "var(--space-8)" }}>
        <p className="nl-label">Sample data · dev only · not on the real page</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)", marginTop: "var(--space-4)" }}>
          {matches.map((match) => (
            <MatchdayCard key={match.state} match={match} now={NOW} />
          ))}
        </div>
      </div>
      <OffThePitch training={training} clips={clips} />
    </main>
  );
}
