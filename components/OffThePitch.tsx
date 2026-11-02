"use client";

import { m } from "motion/react";
import { clips as liveClips, lifeCopy, type Clip, type Training } from "@/content/life";
import liveTraining from "@/data/training.json";
import { stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Highlights } from "./Highlights";
import { MatchdayWidget } from "./MatchdayWidget";
import { TrainingLog } from "./TrainingLog";
import styles from "./OffThePitch.module.css";

type Props = { training?: Training; clips?: Clip[] };

export function OffThePitch({ training = liveTraining as Training, clips = liveClips }: Props) {
  const reduced = useReducedMotion();
  return (
    <section id="life" className={`nl-page ${styles.section}`}>
      <p className={`nl-label ${styles.eyebrow}`}>{lifeCopy.eyebrow}</p>
      <h2 className={`nl-display ${styles.title}`}>{lifeCopy.title}</h2>
      <p className={`nl-body ${styles.intro}`}>{lifeCopy.intro}</p>

      {/* Any of these can be missing, so the row closes up around whatever is left. */}
      <m.div
        className={styles.widgets}
        variants={stagger}
        initial={reduced ? "shown" : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
      >
        <MatchdayWidget />
        <TrainingLog training={training} />
      </m.div>

      <Highlights clips={clips} />
    </section>
  );
}
