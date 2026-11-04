"use client";

import { useRef, useState } from "react";
import { m, useScroll } from "motion/react";
import { fixtures, seasonCopy } from "@/content/season";
import { fadeUp, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { CountUp } from "./CountUp";
import styles from "./FixtureList.module.css";

export function FixtureList() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<string | null>(seasonCopy.defaultOpen);
  const list = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: list, offset: ["start 75%", "end 75%"] });
  const { next } = seasonCopy;

  return (
    <section id="experience" className={`nl-page ${styles.section}`}>
      <p className={`nl-label ${styles.eyebrow}`}>{seasonCopy.eyebrow}</p>
      <h2 className={`nl-display ${styles.title}`}>{seasonCopy.title}</h2>
      <p className={`nl-body ${styles.intro}`}>{seasonCopy.intro}</p>

      <div className={styles.field}>
        {/* The gold line draws down the season as you scroll; full length under reduced motion. */}
        <m.span
          className={styles.progress}
          style={reduced ? undefined : { scaleY: scrollYProgress }}
          aria-hidden="true"
        />

        <m.ol
          ref={list}
          className={styles.list}
          variants={stagger}
          initial={reduced ? "shown" : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.15 }}
        >
          {fixtures.map((fixture) => {
            const isOpen = open === fixture.company;
            const panelId = `report-${fixture.season}`;
            return (
              <m.li key={fixture.company} className={styles.fixture} variants={fadeUp}>
                <h3 className={styles.heading}>
                  <button
                    type="button"
                    className={styles.row}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : fixture.company)}
                  >
                    <span className={`nl-label ${styles.season}`}>{fixture.season}</span>
                    <span className={styles.who}>
                      <span className={`nl-title ${styles.company}`}>{fixture.company}</span>
                      <span className={`nl-data ${styles.role}`}>
                        {fixture.role} · {fixture.venue}
                      </span>
                    </span>
                    <span className={styles.result}>
                      <CountUp
                        value={fixture.result.value}
                        className={`nl-score ${fixture.result.value === "W" ? "nl-up" : ""}`}
                      />
                      <span className={`nl-data ${styles.resultLabel}`}>
                        {fixture.result.dir === "up" && fixture.result.value !== "W" && (
                          <b className="nl-up" aria-hidden="true">▲ </b>
                        )}
                        {fixture.result.label}
                      </span>
                    </span>
                    <span className={`nl-data ${styles.toggle}`} aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>
                <div id={panelId} className={styles.panel} data-open={isOpen}>
                  <div className={styles.panelInner}>
                    {fixture.report.map((line) => (
                      <p key={line} className={`nl-body ${styles.line}`}>
                        {line}
                      </p>
                    ))}
                    {fixture.quote && (
                      <figure className={styles.quote}>
                        <blockquote className={`nl-body ${styles.quoteText}`}>“{fixture.quote.text}”</blockquote>
                        <figcaption className={`nl-data ${styles.quoteBy}`}>
                          {fixture.quote.name} · {fixture.quote.title}
                        </figcaption>
                      </figure>
                    )}
                  </div>
                </div>
              </m.li>
            );
          })}

          <m.li className={`${styles.fixture} ${styles.next}`} variants={fadeUp}>
            <span className={`nl-label ${styles.season}`}>{next.season}</span>
            <span className={`nl-title ${styles.nextTitle}`}>{next.title}</span>
            <a className={`nl-data ${styles.nextLink}`} href={next.href}>
              {next.cta}
            </a>
          </m.li>
        </m.ol>
      </div>
    </section>
  );
}
