"use client";

import { LazyMotion } from "motion/react";

const features = () => import("@/lib/motionFeatures").then((mod) => mod.domAnimation);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={features} strict>
      {children}
    </LazyMotion>
  );
}
