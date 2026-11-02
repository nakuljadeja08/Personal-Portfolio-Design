"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const DURATION_MS = 900;

/** Counts the number inside a value like "$5M" or "12%" up from 0, once. Others stay as they are. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const parts = value.match(/^(\D*)(\d+)(.*)$/);
    if (!inView || reduced || !parts) return;
    const [, prefix, number, suffix] = parts;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const progress = Math.min((now - start) / DURATION_MS, 1);
      const eased = 1 - (1 - progress) ** 4;
      setShown(`${prefix}${Math.round(Number(number) * eased)}${suffix}`);
      if (progress < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}
