"use client";

import { useEffect, useRef, useState } from "react";
import { contactCopy, type ResumeCut } from "@/content/contact";
import { profile } from "@/content/profile";
import { FINTECH_EVENT, isFintechReferrer } from "@/lib/referrer";
import styles from "./ContactCard.module.css";

const CUTS: ResumeCut[] = ["fintech", "general"];

export function ContactCard() {
  const [cut, setCut] = useState<ResumeCut>("general");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isFintechReferrer(document.referrer)) setCut("fintech");
    const onFintech = () => setCut("fintech");
    window.addEventListener(FINTECH_EVENT, onFintech);
    return () => {
      window.removeEventListener(FINTECH_EVENT, onFintech);
      clearTimeout(copyTimer.current);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopyState("idle"), 2000);
  };

  const copyLabel = { idle: contactCopy.copy, copied: contactCopy.copied, failed: contactCopy.copyFailed }[copyState];

  return (
    <section id="contact" className={styles.section}>
      <div className={`nl-page ${styles.inner}`}>
        <p className={`nl-label ${styles.eyebrow}`}>{contactCopy.eyebrow}</p>
        <h2 className={`nl-display ${styles.title}`}>{contactCopy.title}</h2>
        <p className={styles.body}>{contactCopy.body}</p>
        <p className={styles.body}>{contactCopy.fintech}</p>

        <p className={styles.mail}>
          <a className={styles.address} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <button type="button" className={`nl-chip ${styles.copy}`} onClick={copyEmail} aria-live="polite">
            {copyLabel}
          </button>
        </p>

        <fieldset className={styles.picker}>
          <legend className={`nl-label ${styles.legend}`}>{contactCopy.pickerLabel}</legend>
          <div className={styles.segment}>
            {CUTS.map((option) => (
              <label key={option} className={styles.option}>
                <input
                  type="radio"
                  name="resume-cut"
                  value={option}
                  checked={cut === option}
                  onChange={() => setCut(option)}
                />
                <span>{contactCopy.cuts[option].label}</span>
              </label>
            ))}
          </div>
          <p className={`nl-data ${styles.note}`}>{contactCopy.cuts[cut].note}</p>
        </fieldset>

        <a className={styles.download} href={profile.resumes[cut]} download>
          {contactCopy.download}
        </a>

        <p className={`nl-data ${styles.social}`}>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn ↗
          </a>
          <a href={profile.github} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <span>{contactCopy.locale}</span>
        </p>
      </div>
    </section>
  );
}
