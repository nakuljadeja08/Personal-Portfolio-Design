"use client";

import { useEffect, useState } from "react";
import { m } from "motion/react";
import { profile } from "@/content/profile";
import { stack, stackCopy } from "@/content/skills";
import { MAX_SIGNINGS, signings, transferCopy } from "@/content/transfer";
import { fadeUp } from "@/lib/motion";
import { FINTECH_EVENT, isFintechReferrer } from "@/lib/referrer";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./TransferWindow.module.css";

export function TransferWindow() {
  const reduced = useReducedMotion();
  const [signedIds, setSignedIds] = useState<string[]>([]);
  const [fromFintech, setFromFintech] = useState(false);
  const [triedFull, setTriedFull] = useState(false);

  useEffect(() => setFromFintech(isFintechReferrer(document.referrer)), []);

  const signed = signedIds.flatMap((id) => signings.filter((signing) => signing.id === id));
  const full = signed.length === MAX_SIGNINGS;
  const cut = fromFintech || signed.some((signing) => signing.fintech) ? "fintech" : "general";

  const toggle = (id: string) => {
    if (signedIds.includes(id)) {
      setSignedIds(signedIds.filter((signedId) => signedId !== id));
      setTriedFull(false);
    } else if (full) {
      setTriedFull(true);
    } else {
      setSignedIds([...signedIds, id]);
      if (signings.find((signing) => signing.id === id)?.fintech) window.dispatchEvent(new Event(FINTECH_EVENT));
    }
  };

  return (
    <section id="transfer" className={`nl-page ${styles.section}`}>
      <div>
        <p className={`nl-label ${styles.eyebrow}`}>{transferCopy.eyebrow}</p>
        <h2 className={`nl-display ${styles.title}`}>{transferCopy.title}</h2>
        <p className={`nl-body ${styles.intro}`}>{transferCopy.intro}</p>

        <ul className={styles.problems} aria-label={transferCopy.problemsLabel}>
          {signings.map((signing) => {
            const on = signedIds.includes(signing.id);
            return (
              <li key={signing.id}>
                <button
                  type="button"
                  className={styles.problem}
                  aria-pressed={on}
                  // Not `disabled`, so keyboard users keep their place and still hear why it did nothing.
                  aria-disabled={full && !on}
                  onClick={() => toggle(signing.id)}
                >
                  {on && <span aria-hidden="true">✓ </span>}
                  {signing.problem}
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.kit}>
          <h3 className={`nl-label ${styles.kitLabel}`}>{stackCopy.label}</h3>
          <dl className={`nl-data ${styles.kitList}`}>
            {stack.map((group) => (
              <div key={group.label}>
                <dt>{group.label}</dt>
                <dd>{group.tools.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <m.div
        className={styles.sheet}
        variants={fadeUp}
        initial={reduced ? "shown" : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
      >
        <header className={styles.head}>
          <h3 className={`nl-label ${styles.sheetLabel}`}>{transferCopy.sheetLabel}</h3>
          <span className={`nl-data ${styles.count}`}>
            {signed.length} / {MAX_SIGNINGS}
          </span>
        </header>

        <ol className={styles.rows} aria-live="polite">
          {signed.map((signing) => (
            <li key={signing.id} className={styles.row}>
              <span className={`nl-label ${styles.position}`}>{signing.position}</span>
              <div>
                <p className={`nl-title ${styles.player}`}>{signing.player}</p>
                <p className={`nl-body ${styles.evidence}`}>{signing.evidence}</p>
              </div>
              <p className={styles.stat}>
                <span className={`nl-score ${styles.value}`}>{signing.stat.value}</span>
                <span className={`nl-label ${styles.statLabel}`}>{signing.stat.label}</span>
              </p>
            </li>
          ))}
          {Array.from({ length: MAX_SIGNINGS - signed.length }, (_, index) => (
            <li key={index} className={`nl-label ${styles.open}`}>
              {transferCopy.openSlot}
            </li>
          ))}
        </ol>

        <p className={`nl-data ${styles.verdict}`} aria-live="polite">
          {full && triedFull ? transferCopy.windowClosed : transferCopy.verdicts[signed.length]}
        </p>

        {signed.length > 0 && (
          <p className={styles.actions}>
            <a className={styles.resume} href={profile.resumes[cut]} download>
              {profile.resumeCta}
            </a>
            <span className={`nl-label ${styles.cut}`}>{transferCopy.cutNote[cut]}</span>
            <a className={`nl-data ${styles.contact}`} href="#contact">
              {transferCopy.contactCta}
            </a>
          </p>
        )}
      </m.div>
    </section>
  );
}
