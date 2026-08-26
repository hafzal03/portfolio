// Skills grouped by depth, not fake percentages. The four tiers exist
// specifically to keep academic exposure from being presented as
// professional expertise (see profile.ts's distinctionNote) — every skill
// here traces back to a real project or a real course (see projects.ts /
// education.ts / courses.ts).

export interface SkillGroup {
  tier: "Core" | "Hands-on" | "Working Knowledge" | "Academic Foundation";
  description: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    tier: "Core",
    description: "Depended on daily, across Khwarizmi Studio and other current AI work.",
    skills: [
      "Python",
      "AI / LLM Application Engineering",
      "Retrieval-Augmented Generation (RAG)",
      "AI Agents & Orchestration",
    ],
  },
  {
    tier: "Hands-on",
    description: "Used directly to build and ship real project components.",
    skills: [
      "LangChain",
      "LangGraph",
      "Model Context Protocol (MCP)",
      "FastAPI & API Development",
      "Flask",
      "Backend Development",
      "Git & GitHub",
      "Docker",
    ],
  },
  {
    tier: "Working Knowledge",
    description: "Practical exposure through independent and academic projects — less deep than daily hands-on use.",
    skills: [
      "Kubernetes",
      "Microsoft Azure",
      "PostgreSQL & pgvector",
      "Computer Vision",
      "Linux Administration",
      "CI/CD (GitHub Actions)",
      "Client-Server Networking (C++)",
    ],
  },
  {
    tier: "Academic Foundation",
    description: "Studied during the BCA and Master's in Informatics — coursework exposure, not a claim of professional mastery.",
    skills: [
      "C, C++, Java, PHP, VB.NET",
      "Database Management Systems / RDBMS",
      "Operating Systems & Data Communication Networking",
      "Requirements Engineering",
      "Software Testing & System Evaluation",
      "Parallel Programming & Parallel Computer Systems",
      "Information & Communication Security",
      "Systems Modeling & Simulation",
    ],
  },
];
