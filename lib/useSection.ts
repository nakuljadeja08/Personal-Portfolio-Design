"use client";

import { useEffect, useState } from "react";

/** Returns the index of the section crossing the middle of the viewport. */
export function useSection(ids: readonly string[]): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const middle = window.innerHeight / 2;
      let current = 0;
      ids.forEach((id, index) => {
        const el = document.getElementById(id);
        // A section still streaming in has no box yet, and would measure as top: 0.
        if (el && el.getClientRects().length > 0 && el.getBoundingClientRect().top <= middle) current = index;
      });
      // A short final section may never reach the middle, so the bottom of the page counts as it.
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      setActive(atBottom ? ids.length - 1 : current);
    };
    const onChange = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onChange, { passive: true });
    window.addEventListener("resize", onChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, [ids]);

  return active;
}
