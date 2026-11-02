"use client";

import { useState } from "react";
import { m, type Variants } from "motion/react";
import { trainingCopy, type Training, type TrainingPr, type TrainingWeek } from "@/content/life";
import { fadeUp } from "@/lib/motion";
import { CountUp } from "./CountUp";
import styles from "./TrainingLog.module.css";

const grow: Variants = {
  hidden: { scaleY: 0 },
  shown: { scaleY: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// Fixed locale and zone, so the server and the browser print the same date.
const updated = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

function RunningChart({ weeks, updatedAt }: { weeks: TrainingWeek[]; updatedAt: string | null }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = Math.round(weeks.reduce((sum, week) => sum + week.km, 0));
  const tallest = Math.max(...weeks.map((week) => week.km), 1);
  const current = weeks.length - 1;
  const shown = weeks[hovered ?? current];

  return (
    <m.article className={`nl-panel ${styles.run}`} variants={fadeUp}>
      <h3 className={`nl-label ${styles.heading}`}>{trainingCopy.runTitle}</h3>
      <p className={styles.summary}>
        <CountUp value={String(total)} className="nl-score" />
        <span className={`nl-data ${styles.muted}`}>{trainingCopy.scoreLabel}</span>
      </p>

      <p className={`nl-data ${styles.readout}`} aria-hidden="true">
        {hovered === null ? trainingCopy.thisWeek : `Week of ${shown.label}`} · {shown.km} km
      </p>
      <ol className={styles.bars} aria-hidden="true" onPointerLeave={() => setHovered(null)}>
        {weeks.map((week, index) => (
          <li key={week.label} onPointerEnter={() => setHovered(index)}>
            <m.i
              className={styles.bar}
              data-current={index === current}
              data-faded={hovered !== null && hovered !== index}
              style={{ height: `${(week.km / tallest) * 100}%` }}
              variants={grow}
            />
          </li>
        ))}
      </ol>
      <p className={`nl-label ${styles.axis}`} aria-hidden="true">
        <span>{weeks[0].label}</span>
        <span>{weeks[current].label}</span>
      </p>

      {/* The same numbers as a table, for screen readers. */}
      <table className="nl-sr">
        <caption>{trainingCopy.runTitle}</caption>
        <thead>
          <tr>
            <th scope="col">Week of</th>
            <th scope="col">Kilometres</th>
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week.label}>
              <td>{week.label}</td>
              <td>{week.km}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={`nl-label ${styles.lineage}`}>
        {trainingCopy.lineage} {updatedAt && updated.format(new Date(updatedAt))}
      </p>
      <p className={`nl-data ${styles.note}`}>{trainingCopy.note}</p>
    </m.article>
  );
}

function PrList({ prs }: { prs: TrainingPr[] }) {
  return (
    <m.article className={`nl-panel ${styles.prs}`} variants={fadeUp}>
      <h3 className={`nl-label ${styles.heading}`}>{trainingCopy.prTitle}</h3>
      <ul className={`nl-data ${styles.prList}`}>
        {prs.map((pr) => (
          <li key={pr.lift}>
            <span className={styles.muted}>{pr.lift}</span>
            <b>{pr.value}</b>
            <span className={styles.prDate}>{pr.date}</span>
          </li>
        ))}
      </ul>
    </m.article>
  );
}

/** Each panel only exists once it has real data behind it. */
export function TrainingLog({ training }: { training: Training }) {
  return (
    <>
      {training.weeks.length > 0 && <RunningChart weeks={training.weeks} updatedAt={training.updatedAt} />}
      {training.prs.length > 0 && <PrList prs={training.prs} />}
    </>
  );
}
