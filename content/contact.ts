export type ResumeCut = "fintech" | "general";

export const contactCopy = {
  eyebrow: "08 · Full time",
  title: "Let's book a fixture.",
  body: "You made it to full time, which is more than most résumés get. If you've got data that needs questioning, I'd like to hear about it. I reply faster than VAR.",
  // The fintech pitch lives down here, so the top of the page doesn't narrow who keeps reading.
  fintech: "Work in fintech or banking? Even better. Money is the data I'd most like to work on next, and there's a résumé cut just for you below.",
  copy: "copy",
  copied: "copied ✓",
  copyFailed: "couldn't copy",
  pickerLabel: "Which résumé?",
  cuts: {
    fintech: { label: "Fintech", note: "Same me, with Orblex Industries and the Bloomberg Terminal up front." },
    general: { label: "General", note: "Same me, with the VALORANT Copilot up front." },
  } satisfies Record<ResumeCut, { label: string; note: string }>,
  download: "Download résumé ↓",
  locale: "Jersey City, NJ · ET",
};
