import type { Variants } from "motion/react";

// Timings come from the design system's Motion section.
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT } },
};

export const stagger: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
};
