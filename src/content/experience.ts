// Single source of truth for professional experience. Read by the UI
// (Experience section) and by the RAG knowledge base (lib/rag/knowledge.ts) —
// update here only.
//
// Every responsibility below is stated as Hafzal described the role. The
// `context` line describes what the employer does and is taken from Bite
// Globe's own site (biteglobe.store) — it is context for the work, not a claim
// about what Hafzal personally owned.

export interface Role {
  slug: string;
  title: string;
  company: string;
  companyUrl?: string;
  location: string;
  /** Full-time, Part-time, Internship, Contract. */
  employmentType: string;
  /** Display form, e.g. "Jan 2026 – Aug 2026". */
  period: string;
  /** Machine-readable bounds, for <time> elements. */
  start: string;
  end: string;
  /** One line on what the employer does, so the work has a setting. */
  context: string;
  responsibilities: string[];
  technologies: string[];
}

export const roles: Role[] = [
  {
    slug: "bite-globe-technical-operations-assistant",
    title: "Technical Operations Assistant",
    company: "Bite Globe",
    companyUrl: "https://biteglobe.store",
    location: "Slovakia",
    employmentType: "Part-time",
    period: "Jan 2026 – Aug 2026",
    start: "2026-01",
    end: "2026-08",
    context:
      "Bite Globe is an online grocery retailer in Slovakia specialising in authentic Indian food — rice, atta, spices, pickles, ghee and everyday essentials — with ordering, checkout, order tracking and an admin back office serving selected Slovak cities.",
    responsibilities: [
      "Developed and maintained backend applications and internal data workflows using Python, Flask, SQL and PostgreSQL.",
      "Wrote SQL logic for data transformation and validation, processing structured business data for consistency and accuracy across systems.",
      "Designed and integrated REST APIs connecting backend services to support scalable business workflows.",
      "Maintained technical documentation, API documentation and user guides.",
      "Contributed across the full project lifecycle — requirements gathering, solution design, development, testing and deployment.",
      "Used Git and GitHub for version control and collaborative development on a live codebase, and containerised and deployed applications with Docker and Kubernetes in Linux environments.",
    ],
    technologies: [
      "Python",
      "Flask",
      "SQL",
      "PostgreSQL",
      "REST APIs",
      "Git",
      "GitHub",
      "Docker",
      "Kubernetes",
      "Linux",
    ],
  },
];
