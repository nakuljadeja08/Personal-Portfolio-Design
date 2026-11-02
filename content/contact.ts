export type ResumeCut = "fintech" | "general";

export const contactCopy = {
  eyebrow: "07 · Full time",
  title: "Let's book a fixture.",
  body: "You made it to full time, which is more than most résumés get. If you've got data that needs questioning, I'd like to hear about it. I reply faster than VAR.",
  copy: "copy",
  copied: "copied ✓",
  copyFailed: "couldn't copy",
  pickerLabel: "Which résumé?",
  cuts: {
    fintech: { label: "Fintech", note: "Same me, with Wayne Industries and the Bloomberg Terminal up front." },
    general: { label: "General", note: "Same me, with the VALORANT Copilot up front." },
  } satisfies Record<ResumeCut, { label: string; note: string }>,
  download: "Download the serious version ↓",
  locale: "Jersey City, NJ · ET",
};
