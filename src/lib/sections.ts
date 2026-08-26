// Section ids in document order. Shared by the navbar, the scroll backdrop,
// and the HUD overlay so they can never drift out of sync with the page.
export const SECTION_IDS = [
  "home",
  "about",
  "education",
  "projects",
  "skills",
  "courses",
  "services",
  "contact",
] as const;

export const MODULE_LABELS: Record<string, string> = {
  home: "INDEX",
  about: "PROFILE",
  education: "ACADEMIC_RECORD",
  projects: "PROJECT_ARCHIVE",
  skills: "CAPABILITY_MATRIX",
  courses: "CERTIFICATION_LOG",
  services: "SERVICE_REGISTRY",
  contact: "UPLINK",
};
