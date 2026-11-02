"use client";

import { useEffect, useRef } from "react";
import type { TickerItem } from "@/content/profile";
import styles from "./Ticker.module.css";

const PX_PER_SECOND = 40;

function Items({ items, hidden }: { items: TickerItem[]; hidden?: boolean }) {
  return (
    <ul className={styles.group} aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.text}>
          {item.dir === "up" && <b className="nl-up" aria-label="up">▲ </b>}
          {item.dir === "down" && <b className="nl-down" aria-label="down">▼ </b>}
          {item.dir === "none" && <b className={styles.neutral} aria-hidden="true">● </b>}
          <b className={styles.value}>{item.value}</b> {item.text}
        </li>
      ))}
    </ul>
  );
}

export function Ticker({ items }: { items: TickerItem[] }) {
  const track = useRef<HTMLDivElement>(null);

  // Duration follows the content width, so the crawl stays at 40px/s at any font or length.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      el.style.setProperty("--crawl", `${el.scrollWidth / 2 / PX_PER_SECOND}s`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`${styles.ticker} nl-data`} tabIndex={0} role="region" aria-label="Headline stats">
      <div className={styles.track} ref={track}>
        <Items items={items} />
        <Items items={items} hidden />
      </div>
    </div>
  );
}
