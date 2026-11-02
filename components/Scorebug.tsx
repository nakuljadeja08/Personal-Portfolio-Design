"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { sectionIds, sections } from "@/content/sections";
import { useSection } from "@/lib/useSection";
import styles from "./Scorebug.module.css";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function Scorebug() {
  const active = useSection(sectionIds);
  const [minute, setMinute] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => setTheme(currentTheme()), []);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const range = document.documentElement.scrollHeight - window.innerHeight;
      setMinute(range > 0 ? Math.min(90, Math.round((y / range) * 90)) : 0);
      if (Math.abs(y - lastY) > 4) {
        setCollapsed(y > 80 && y > lastY);
        setMenuOpen(false);
        lastY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("nl-theme", next);
    } catch {
      // Private windows can block storage; the choice still applies to this visit.
    }
    setTheme(next);
  };

  const clock = `${String(minute).padStart(2, "0")}'`;

  return (
    <nav className={styles.bug} data-collapsed={collapsed} aria-label="Sections">
      {/* Each label starts with the visible text, so voice control users can say what they see. */}
      <a className={styles.name} href="#about" aria-label={`${profile.initials}, ${profile.name}, back to top`}>
        {profile.initials}
      </a>

      <button
        className={`${styles.minute} nl-data`}
        type="button"
        aria-expanded={menuOpen}
        aria-controls="scorebug-menu"
        aria-label={`${clock} · ${sections[active].label}. Open section menu`}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="nl-dot" aria-hidden="true" />
        <span className={styles.clock}>{clock}</span>
        <span className={styles.current}>· {sections[active].label}</span>
      </button>

      <span className={`${styles.minuteStatic} nl-data`} aria-hidden="true">
        <span className="nl-dot" />
        <span className={styles.clock}>{clock}</span>
      </span>
      <span className={`${styles.currentStatic} nl-data`} aria-hidden="true">
        · {sections[active].label}
      </span>

      <ul id="scorebug-menu" className={styles.links} data-open={menuOpen}>
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        className={`${styles.theme} nl-label`}
        type="button"
        aria-label={theme === "dark" ? "Day / Night: switch to day match" : "Day / Night: switch to night match"}
        onClick={toggleTheme}
      >
        <span data-on={theme === "light"}>Day</span> / <span data-on={theme === "dark"}>Night</span>
      </button>
    </nav>
  );
}
