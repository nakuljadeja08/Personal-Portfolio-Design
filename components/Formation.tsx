"use client";

import { useState } from "react";
import { m } from "motion/react";
import { formation, formationCopy } from "@/content/skills";
import { fadeUp, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./Formation.module.css";

const allSkills = formation.flatMap((line) => line.skills);

export function Formation() {
  const reduced = useReducedMotion();
  const [activeName, setActiveName] = useState(formationCopy.defaultSkill);
  const active = allSkills.find((skill) => skill.name === activeName) ?? allSkills[0];

  return (
    <section id="skills" className={`nl-page ${styles.section}`}>
      <div className={styles.intro}>
        <p className={`nl-label ${styles.eyebrow}`}>{formationCopy.eyebrow}</p>
        <h2 className={`nl-display ${styles.title}`}>{formationCopy.title}</h2>
        {formationCopy.intro.map((line) => (
          <p key={line} className={`nl-body ${styles.copy}`}>
            {line}
          </p>
        ))}
      </div>

      <div className={styles.field}>
        <m.div
          className={styles.pitch}
          data-cursor="pitch"
          variants={stagger}
          initial={reduced ? "shown" : "hidden"}
          whileInView="shown"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.marks} aria-hidden="true">
            <span className={styles.boundary} />
            <span className={styles.halfway} />
            <span className={styles.circle} />
            <span className={styles.boxTop} />
            <span className={styles.boxBottom} />
          </div>

          {formation.map((line) => (
            <ul key={line.id} className={styles.line} aria-label={line.label}>
              {line.skills.map((skill) => (
                <m.li key={skill.name} variants={fadeUp}>
                  <button
                    type="button"
                    className={styles.player}
                    data-active={skill.name === active.name}
                    aria-label={`${skill.name}: ${skill.where}`}
                    onMouseEnter={() => setActiveName(skill.name)}
                    onFocus={() => setActiveName(skill.name)}
                    onClick={() => setActiveName(skill.name)}
                  >
                    {skill.name}
                  </button>
                </m.li>
              ))}
            </ul>
          ))}

          <p className={`nl-data ${styles.tip}`} aria-hidden="true">
            {active.where}
          </p>
        </m.div>

        {/* The same squad as plain text, for quick scanning, screen readers and ATS scrapers. */}
        <dl className={styles.sheet}>
          {formation.map((line) => (
            <div key={line.id} className={styles.sheetRow}>
              <dt className="nl-label">{line.label}</dt>
              <dd className="nl-data">
                {line.skills.map((skill) => skill.name).join(" · ")}
                <span className={styles.job}>{line.job}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
