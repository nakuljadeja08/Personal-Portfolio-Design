"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Cursor.module.css";

const TARGETS = 'a, button, label, summary, [role="button"]';
const TRAIL_LENGTH = 10;
const LOCK_PADDING = 4;

/** Crosshair, target-lock brackets on anything clickable, and a run trail on the pitch. */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const crosshair = useRef<HTMLDivElement>(null);
  const lock = useRef<HTMLDivElement>(null);
  const trail = useRef<(HTMLSpanElement | null)[]>([]);

  // Only for a real mouse, and never under reduced motion.
  useEffect(() => {
    const mouse = matchMedia("(hover: hover) and (pointer: fine)");
    const calm = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(mouse.matches && !calm.matches);
    update();
    mouse.addEventListener("change", update);
    calm.addEventListener("change", update);
    return () => {
      mouse.removeEventListener("change", update);
      calm.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    const points = Array.from({ length: TRAIL_LENGTH }, () => ({ x: 0, y: 0 }));
    let x = 0;
    let y = 0;
    let locked: Element | null = null;
    let onPitch = false;
    let frame = 0;

    // Everything moves through transforms in one frame loop, so React never re-renders on hover.
    const draw = () => {
      frame = 0;
      if (crosshair.current) crosshair.current.style.transform = `translate(${x}px, ${y}px)`;
      if (lock.current) {
        const box = locked?.getBoundingClientRect();
        if (box) {
          // Coming from hidden, jump straight to the target; only slide between targets.
          const appearing = lock.current.dataset.on !== "true";
          if (appearing) lock.current.style.transition = "none";
          lock.current.style.transform = `translate(${box.left - LOCK_PADDING}px, ${box.top - LOCK_PADDING}px)`;
          lock.current.style.width = `${box.width + 2 * LOCK_PADDING}px`;
          lock.current.style.height = `${box.height + 2 * LOCK_PADDING}px`;
          if (appearing) {
            void lock.current.offsetWidth;
            lock.current.style.transition = "";
          }
        }
        lock.current.dataset.on = String(Boolean(box));
      }
      if (onPitch) {
        let moving = false;
        let leadX = x;
        let leadY = y;
        points.forEach((point, index) => {
          point.x += (leadX - point.x) * 0.45;
          point.y += (leadY - point.y) * 0.45;
          if (Math.abs(leadX - point.x) + Math.abs(leadY - point.y) > 0.5) moving = true;
          const dot = trail.current[index];
          if (dot) dot.style.transform = `translate(${point.x}px, ${point.y}px)`;
          leadX = point.x;
          leadY = point.y;
        });
        if (moving) frame = requestAnimationFrame(draw);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const setPitch = (next: boolean) => {
      if (next === onPitch) return;
      onPitch = next;
      if (next) points.forEach((point) => Object.assign(point, { x, y }));
      trail.current.forEach((dot) => dot?.toggleAttribute("data-on", next));
    };

    const inspect = (target: Element | null) => {
      const field = target?.closest("input, textarea");
      const typing = Boolean(field && (field as HTMLInputElement).type !== "radio");
      if (crosshair.current) crosshair.current.dataset.on = String(!typing);
      locked = typing ? null : (target?.closest(TARGETS) ?? null);
      setPitch(Boolean(target?.closest("[data-cursor='pitch']")));
    };

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      root.classList.add("nl-cursor");
      inspect(event.target as Element);
      schedule();
    };
    // The page can move under a still mouse, so scrolling has to re-check what's underneath.
    const onScroll = () => {
      inspect(document.elementFromPoint(x, y));
      schedule();
    };
    const onLeave = () => {
      if (crosshair.current) crosshair.current.dataset.on = "false";
      locked = null;
      setPitch(false);
      schedule();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    // Pitch players lift on hover, so the brackets re-measure once the lift has finished.
    window.addEventListener("transitionend", schedule);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("transitionend", schedule);
      root.removeEventListener("mouseleave", onLeave);
      root.classList.remove("nl-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true">
      {Array.from({ length: TRAIL_LENGTH }, (_, index) => (
        <span
          key={index}
          ref={(node) => {
            trail.current[index] = node;
          }}
          className={styles.dot}
          style={{ "--fade": 1 - index / TRAIL_LENGTH } as React.CSSProperties}
        />
      ))}
      <div ref={lock} className={styles.lock} data-on="false">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div ref={crosshair} className={styles.crosshair} data-on="false">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
