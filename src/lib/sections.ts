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
  { id: "home", numeral: "0", label: "Home", title: "Introduction" },
  { id: "about", numeral: "I", label: "About", title: "About me" },
  { id: "experience", numeral: "II", label: "Experience", title: "Professional experience" },
  { id: "education", numeral: "III", label: "Education", title: "Academic foundation" },
  { id: "projects", numeral: "IV", label: "Projects", title: "Selected work" },
  { id: "skills", numeral: "V", label: "Skills", title: "Skills & expertise" },
  { id: "courses", numeral: "VI", label: "Certifications", title: "Certifications & training" },
  { id: "services", numeral: "VII", label: "Services", title: "Services & pricing" },
  { id: "contact", numeral: "VIII", label: "Contact", title: "Let's work together" },
];

export const CHAPTER_BY_ID = Object.fromEntries(CHAPTERS.map((c) => [c.id, c])) as Record<
  SectionId,
  Chapter
>;
