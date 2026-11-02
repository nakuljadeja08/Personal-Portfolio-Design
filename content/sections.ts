export const sections = [
  { id: "about", label: "Kick-off" },
  { id: "skills", label: "Formation" },
  { id: "transfer", label: "Transfers" },
  { id: "experience", label: "Season" },
  { id: "projects", label: "Loadout" },
  { id: "life", label: "Off the pitch" },
  { id: "contact", label: "Full time" },
] as const;

export const sectionIds = sections.map((section) => section.id);
