export const sections = [
  // Plain words up here so nobody has to decode the menu. The football lives in each section's eyebrow.
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "transfer", label: "Problems solved" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "cabinet", label: "Certifications" },
  { id: "life", label: "Off the pitch" },
  { id: "contact", label: "Contact" },
] as const;

export const sectionIds = sections.map((section) => section.id);
