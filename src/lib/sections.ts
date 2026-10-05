// Section ids in document order. Shared by the top bar, the chapter rail, the
// dream menu and the WebGL sky so they can never drift out of sync with the
// page. The ids themselves are unchanged from the previous design so existing
// deep links (hafzal.dev/#projects etc.) keep working.
export const SECTION_IDS = [
  "home",
  "about",
  "experience",
  "education",
  "projects",
  "skills",
  "courses",
  "services",
  "contact",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export interface Chapter {
  id: SectionId;
  /** Roman numeral shown beside the chapter name. */
  numeral: string;
  /** Short name — what the section is. Shown as the eyebrow and in navigation. */
  label: string;
  /** The section heading. Its last word is set in italic, in the accent gradient. */
  title: string;
}

export const CHAPTERS: Chapter[] = [
  { id: "home", numeral: "0", label: "Core", title: "System online" },
  { id: "about", numeral: "I", label: "About", title: "I build software that thinks, connects and executes." },
  { id: "experience", numeral: "II", label: "Experience", title: "System log" },
  { id: "education", numeral: "III", label: "Education", title: "Academic system" },
  { id: "projects", numeral: "IV", label: "Projects", title: "Selected systems" },
  { id: "skills", numeral: "V", label: "Stack", title: "Technical stack" },
  { id: "courses", numeral: "VI", label: "Knowledge", title: "Knowledge base" },
  { id: "services", numeral: "VII", label: "Capabilities", title: "Capabilities" },
  { id: "contact", numeral: "VIII", label: "Contact", title: "Ready to build the next system?" },
];

export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c])) as Record<
  SectionId,
  Chapter
>;
