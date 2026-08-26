// Single source of truth for Hafzal's identity/summary.
// Read by both the UI (Hero/About) and the RAG knowledge base — update here only.

export const profile = {
  name: "Hafzal Ahamed",
  role: "Software Engineer · AI Engineer",
  tagline:
    "Building intelligent software with Python, AI, LLMs, RAG, agents, and modern engineering practices.",
  summary: `Hafzal Ahamed is a software and AI engineer whose work spans traditional
software engineering and modern AI application development. His technical
foundation includes Java, C++, networking, databases, parallel computing, and
computer vision, built through academic and independent projects. That
foundation extended into backend development, cloud infrastructure, and
DevOps practice with Docker and Kubernetes, and more recently into AI
engineering: large language models, Retrieval-Augmented Generation,
structured/tabular data workflows, AI agents, and the Model Context Protocol
(MCP). His most advanced project, Khwarizmi Studio, is an AI-native studio
where an AI Engineer agent designs, builds, tests, and ships real code into a
user's own GitHub repository and cloud environment — bringing together LLM
orchestration, RAG-backed repository intelligence, MCP tools, sandboxed
execution, and Azure deployment into one system.`,
  focusAreas: [
    "Software Engineering",
    "AI Engineering",
    "Python",
    "Large Language Models",
    "Retrieval-Augmented Generation (RAG)",
    "AI Agents",
    "LangChain",
    "LangGraph",
    "Model Context Protocol (MCP)",
    "API Development",
    "AI Workflows & Orchestration",
  ],
  // Left intentionally minimal — no university/dates were provided, and we do not invent them.
  // The Master's-level thesis work is represented as a full project entry instead (see projects.ts).
  educationNote:
    "Master's-level academic research in Information Systems and Computer-Aided Software Engineering (CASE) — see the full project write-up.",
} as const;
