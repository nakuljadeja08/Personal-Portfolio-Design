"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { m } from "motion/react";
import { abilities, profile } from "@/content/profile";
import { fadeUp } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import styles from "./PlayerCard.module.css";

const CHAR_DELAY_MS = 18;

/** Types in with CSS only, so the text ships in the HTML and never shifts layout. */
function TypedHeadline({ text }: { text: string }) {
  const words = text.split(" ");
  let index = 0;
  return (
    <h1 className={`nl-display ${styles.headline}`} aria-label={text}>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span className={styles.word}>
              {[...word].map((char, c) => (
                <span key={c} className={styles.char} style={{ animationDelay: `${index++ * CHAR_DELAY_MS}ms` }}>
                  {char}
                </span>
              ))}
            </span>{" "}
            {word.endsWith(".") && w < words.length - 1 && <br />}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function PlayerCard() {
  const reduced = useReducedMotion();
  const [activeKey, setActiveKey] = useState(abilities[0].key);

  // Q, E, C and X work like the real ability keys, unless someone is typing.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target as HTMLElement;
      if (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      const match = abilities.find((ability) => ability.key === event.key.toUpperCase());
      if (match) setActiveKey(match.key);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section id="about" className={`nl-page ${styles.hero}`}>
      <div className={styles.intro}>
        <p className={`nl-label ${styles.eyebrow}`}>01 · Kick-off</p>
        <TypedHeadline text={profile.headline} />
        {profile.lead.map((line) => (
          <p key={line} className={styles.lead}>
            {line}
          </p>
        ))}
        <p className={`nl-label ${styles.status}`}>
          <span className="nl-dot" aria-hidden="true" /> {profile.status}
        </p>
        <div className={styles.actions}>
          <a className={styles.resume} href={profile.resumes.fintech} download>
            {profile.resumeCta}
          </a>
          <a className={`nl-data ${styles.contact}`} href="#contact">
            {profile.contactCta}
          </a>
        </div>
      </div>

      <m.article
        className={`nl-panel ${styles.card}`}
        variants={fadeUp}
        initial={reduced ? "shown" : "hidden"}
        animate="shown"
        transition={{ delay: 0.5 }}
      >
        <header className={styles.cardHead}>
          <span className="nl-label">Operator</span>
          <span className={`nl-label ${styles.rank}`}>Rank · {profile.rank}</span>
        </header>
        <div className={styles.identity}>
          <Image
            className={styles.portrait}
            src={profile.portrait.src}
            alt={profile.portrait.alt}
            width={96}
            height={96}
            loading="eager"
          />
          <div>
            <h2 className={`nl-title ${styles.name}`}>{profile.name}</h2>
            <p className={`nl-data ${styles.role}`}>
              {profile.role} · {profile.location}
            </p>
          </div>
        </div>

        <ul className={styles.kit}>
          {abilities.map((ability) => (
            <li key={ability.key}>
              <button
                type="button"
                className={styles.ability}
                aria-pressed={ability.key === activeKey}
                onMouseEnter={() => setActiveKey(ability.key)}
                onFocus={() => setActiveKey(ability.key)}
                onClick={() => setActiveKey(ability.key)}
              >
                <span className={`nl-key ${ability.key === activeKey ? "is-active" : ""}`}>{ability.key}</span>
                <span className={styles.abilityText}>
                  <b>{ability.name}</b>
                  <small className="nl-data">{ability.detail}</small>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <footer className={styles.cardFoot}>
          <p className="nl-label">VALORANT peak · {profile.valorantPeak}</p>
        </footer>
      </m.article>
    </section>
  );
}
