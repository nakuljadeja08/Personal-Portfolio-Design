"use client";

import { m } from "motion/react";
import { cabinetCopy, shelves, type Trophy } from "@/content/cabinet";
import { fadeUp, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./TrophyCabinet.module.css";

function VerifyLink({ trophy }: { trophy: Trophy }) {
  if (!trophy.verify) return null;
  return (
    <a
      className={`nl-data ${styles.verify}`}
      href={trophy.verify}
      target="_blank"
      rel="noreferrer"
      aria-label={`${cabinetCopy.verify.replace(" ↗", "")} ${trophy.name}`}
    >
      {cabinetCopy.verify}
    </a>
  );
}

export function TrophyCabinet() {
  const reduced = useReducedMotion();
  const filled = shelves.filter((shelf) => shelf.trophies.length > 0);

  return (
    <section id="cabinet" className={`nl-page ${styles.section}`}>
      <p className={`nl-label ${styles.eyebrow}`}>{cabinetCopy.eyebrow}</p>
      <h2 className={`nl-display ${styles.title}`}>{cabinetCopy.title}</h2>
      <p className={`nl-body ${styles.intro}`}>{cabinetCopy.intro}</p>

      {filled.map((shelf) => {
        const big = shelf.trophies.filter((trophy) => trophy.stat);
        const rest = shelf.trophies.filter((trophy) => !trophy.stat);
        return (
          <m.div
            key={shelf.id}
            className={styles.shelf}
            variants={stagger}
            initial={reduced ? "shown" : "hidden"}
            whileInView="shown"
            viewport={{ once: true, amount: 0.15 }}
          >
            <h3 className={`nl-label ${styles.shelfLabel}`}>{shelf.label}</h3>

            {big.length > 0 && (
              <ul className={styles.big}>
                {big.map((trophy) => (
                  <m.li key={trophy.name} className={styles.card} variants={fadeUp}>
                    <p className={styles.stat}>
                      <span className={`nl-score ${styles.value}`}>{trophy.stat?.value}</span>
                      <span className={`nl-label ${styles.statLabel}`}>{trophy.stat?.label}</span>
                    </p>
                    <h4 className={`nl-title ${styles.name}`}>{trophy.name}</h4>
                    <p className={`nl-data ${styles.meta}`}>
                      {trophy.issuer} · {trophy.date}
                    </p>
                    <p className={`nl-body ${styles.note}`}>{trophy.note}</p>
                    <VerifyLink trophy={trophy} />
                  </m.li>
                ))}
              </ul>
            )}

            {rest.length > 0 && (
              <ul className={styles.rows}>
                {rest.map((trophy) => (
                  <m.li key={trophy.name} className={styles.row} variants={fadeUp}>
                    <div>
                      <h4 className={styles.rowName}>{trophy.name}</h4>
                      <p className={`nl-body ${styles.rowNote}`}>{trophy.note}</p>
                    </div>
                    <p className={`nl-data ${styles.rowMeta}`}>
                      {trophy.issuer} · {trophy.date}
                    </p>
                    <VerifyLink trophy={trophy} />
                  </m.li>
                ))}
              </ul>
            )}
          </m.div>
        );
      })}
    </section>
  );
}
