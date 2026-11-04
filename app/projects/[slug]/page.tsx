import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyCopy, getCaseStudy, type Flow } from "@/content/caseStudies";
import { profile } from "@/content/profile";
import styles from "./page.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  const title = `${study.title} · Case study · ${profile.name}`;
  return { title, description: study.summary, openGraph: { title, description: study.summary, type: "article" } };
}

/** Steps read top to bottom, joined by a rail, so the same layout works from phone to desktop. */
function Pipeline({ flow }: { flow: Flow }) {
  return (
    <figure className={styles.flow}>
      <figcaption className={`nl-label ${styles.flowTitle}`}>{flow.title}</figcaption>
      <ol className={styles.steps}>
        {flow.steps.map((step, index) => (
          <li key={step.name} className={styles.step}>
            <span className={`nl-data ${styles.stepNo}`} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className={styles.stepName}>{step.name}</h3>
              <p className={`nl-body ${styles.stepDetail}`}>{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const study = getCaseStudy((await params).slug);
  if (!study) notFound();
  const index = caseStudies.indexOf(study);
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <main className={`nl-page ${styles.page}`}>
      <nav className={`nl-data ${styles.back}`} aria-label="Breadcrumb">
        <Link href="/#projects">{caseStudyCopy.back}</Link>
      </nav>

      <header className={styles.header}>
        <p className="nl-label">
          {caseStudyCopy.eyebrow} · {study.year}
        </p>
        <h1 className={`nl-display ${styles.title}`}>{study.title}</h1>
        <p className={styles.summary}>{study.summary}</p>
        <p className={`nl-data ${styles.links}`}>
          {study.links.repo && (
            <a href={study.links.repo} target="_blank" rel="noreferrer" aria-label={`${study.title} source code`}>
              {caseStudyCopy.source}
            </a>
          )}
          {study.links.live && (
            <a href={study.links.live} target="_blank" rel="noreferrer" aria-label={`${study.title} live site`}>
              {caseStudyCopy.live}
            </a>
          )}
        </p>
        <ul className={styles.chips} aria-label="Stack">
          {study.stack.map((tool) => (
            <li key={tool} className="nl-chip">
              {tool}
            </li>
          ))}
        </ul>
      </header>

      <dl className={styles.facts}>
        {study.facts.map((fact) => (
          <div key={fact.label} className={`nl-panel ${styles.fact}`}>
            <dt className={`nl-data ${styles.factLabel}`}>{fact.label}</dt>
            <dd className={`nl-score ${styles.factValue}`}>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <section className={styles.section} aria-labelledby="problem">
        <h2 id="problem" className={`nl-title ${styles.heading}`}>
          {caseStudyCopy.problem}
        </h2>
        {study.problem.map((paragraph) => (
          <p key={paragraph} className={`nl-body ${styles.prose}`}>
            {paragraph}
          </p>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="flow">
        <h2 id="flow" className={`nl-title ${styles.heading}`}>
          {caseStudyCopy.flow}
        </h2>
        <div className={styles.flows}>
          {study.flows.map((flow) => (
            <Pipeline key={flow.title} flow={flow} />
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="decisions">
        <h2 id="decisions" className={`nl-title ${styles.heading}`}>
          {caseStudyCopy.decisions}
        </h2>
        <dl className={styles.decisions}>
          {study.decisions.map((item) => (
            <div key={item.decision} className={styles.decision}>
              <dt className={styles.decisionName}>{item.decision}</dt>
              <dd className={`nl-body ${styles.decisionWhy}`}>{item.why}</dd>
            </div>
          ))}
        </dl>
      </section>

      {study.example && (
        <section className={styles.section} aria-labelledby="example">
          <h2 id="example" className={`nl-title ${styles.heading}`}>
            Worked example: {study.example.title}
          </h2>
          {study.example.body.map((paragraph) => (
            <p key={paragraph} className={`nl-body ${styles.prose}`}>
              {paragraph}
            </p>
          ))}
        </section>
      )}

      <section className={styles.section} aria-labelledby="limits">
        <h2 id="limits" className={`nl-title ${styles.heading}`}>
          {caseStudyCopy.limits}
        </h2>
        <ul className={styles.list}>
          {study.limits.map((item) => (
            <li key={item} className="nl-body">
              {item}
            </li>
          ))}
        </ul>
      </section>

      {study.next && (
        <section className={styles.section} aria-labelledby="next">
          <h2 id="next" className={`nl-title ${styles.heading}`}>
            {caseStudyCopy.next}
          </h2>
          <ul className={styles.list}>
            {study.next.map((item) => (
              <li key={item} className="nl-body">
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className={styles.footer}>
        <Link className={`nl-panel ${styles.nextStudy}`} href={`/projects/${next.slug}`}>
          <span className="nl-label">{caseStudyCopy.nextStudy}</span>
          <span className={`nl-title ${styles.nextTitle}`}>{next.title} →</span>
        </Link>
        <Link className={`nl-data ${styles.contact}`} href="/#contact">
          {caseStudyCopy.contact}
        </Link>
      </footer>
    </main>
  );
}
