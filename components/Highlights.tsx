"use client";

import { m } from "motion/react";
import { highlightsCopy, type Clip } from "@/content/life";
import { profile } from "@/content/profile";
import { fadeUp } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./Highlights.module.css";

export function Highlights({ clips }: { clips: Clip[] }) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={styles.panel}
      variants={fadeUp}
      initial={reduced ? "shown" : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div>
        <h3 className={`nl-label ${styles.eyebrow}`}>{highlightsCopy.eyebrow}</h3>
        <p className={styles.peak}>
          <span className={`nl-score ${styles.rank}`}>{profile.valorantPeak}</span>
          <span className={`nl-label ${styles.label}`}>{highlightsCopy.peakLabel}</span>
        </p>
        <p className={`nl-body ${styles.line}`}>{highlightsCopy.line}</p>
        <p className={`nl-data ${styles.riot}`}>
          <span className={styles.dim}>{highlightsCopy.riotLabel}</span> {profile.riotId}
        </p>
      </div>

      <div className={styles.clips}>
        <h4 className={`nl-label ${styles.label}`}>{highlightsCopy.clipsLabel}</h4>
        {clips.length > 0 ? (
          <ul className={`nl-data ${styles.clipList}`}>
            {clips.map((clip) => (
              <li key={clip.href}>
                <a href={clip.href} target="_blank" rel="noreferrer">
                  {clip.title} ↗
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className={`nl-data ${styles.empty}`}>{highlightsCopy.empty}</p>
        )}
      </div>
    </m.div>
  );
}
