"use client";

import dynamic from "next/dynamic";

// Neither shows anything until the browser takes over, so they can load after the page has.
const CommandBox = dynamic(() => import("./CommandBox").then((mod) => mod.CommandBox), { ssr: false });
const Cursor = dynamic(() => import("./Cursor").then((mod) => mod.Cursor), { ssr: false });

export function Extras() {
  return (
    <>
      <CommandBox />
      <Cursor />
    </>
  );
}
