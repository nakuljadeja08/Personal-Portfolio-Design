"use client";

import Link from "next/link";
import { m } from "motion/react";
import { loadoutCopy, projects, type Project } from "@/content/projects";
import { fadeUp, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { CountUp } from "./CountUp";
import styles from "./ProjectCard.module.css";

function ProjectCard({ project }: { project: Project }) {
  const { repo, live } = project.links;
  return (
    <m.article className={`nl-panel ${styles.card}`} variants={fadeUp}>
      <span className="nl-label">
        Slot {project.slot} · {project.year}
      </span>
      <h3 className={`nl-title ${styles.name}`}>{project.title}</h3>
      <p className={`nl-body ${styles.pitch}`}>{project.pitch}</p>
      <p className={styles.stat}>
        <CountUp value={project.stat.value} className={`nl-score ${styles.value}`} />
        <span className={`nl-data ${styles.statLabel}`}>{project.stat.label}</span>
      </p>
      <ul className={styles.chips} aria-label="Stack">
        {project.stack.map((tool) => (
          <li key={tool} className="nl-chip">
            {tool}
          </li>
        ))}
      </ul>
      <p className={`nl-data ${styles.links}`}>
        <Link href={`/projects/${project.slug}`} aria-label={`${project.title} case study`}>
          Case study →
        </Link>
        {repo && (
          <a href={repo} target="_blank" rel="noreferrer" aria-label={`${project.title} source code`}>
            Source ↗
          </a>
        )}
        {live && (
          <a href={live} target="_blank" rel="noreferrer" aria-label={`${project.title} live site`}>
            Live ↗
          </a>
        )}
      </p>
    </m.article>
  );
}

export function Loadout() {
  const reduced = useReducedMotion();
  return (
    <section id="projects" className={`nl-page ${styles.section}`}>
      <p className={`nl-label ${styles.eyebrow}`}>{loadoutCopy.eyebrow}</p>
      <h2 className={`nl-display ${styles.title}`}>{loadoutCopy.title}</h2>
      <p className={`nl-body ${styles.intro}`}>{loadoutCopy.intro}</p>
      <m.div
        className={styles.grid}
        variants={stagger}
        initial={reduced ? "shown" : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.slot} project={project} />
        ))}
      </m.div>
    </section>
  );
}
