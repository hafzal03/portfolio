// Skills grouped by depth, not fake percentages. Derived directly from the
// actual project history — every skill listed here traces back to a project.

export interface SkillGroup {
  tier: "Core" | "Hands-on" | "Working Knowledge";
  description: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    tier: "Core",
    description: "Depended on daily, across Khwarizmi Studio and other AI work.",
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
      "Backend Development",
      "Git & GitHub",
      "Docker",
    ],
  },
  {
    tier: "Working Knowledge",
    description: "Practical exposure through academic and independent projects.",
    skills: [
      "Kubernetes",
      "Microsoft Azure",
      "PostgreSQL & pgvector",
      "Java",
      "C++",
      "Computer Vision",
      "Linux Administration",
      "CI/CD (GitHub Actions)",
    ],
  },
];
