// Single source of truth for Hafzal's identity/summary.
// Read by both the UI (Hero/About) and the RAG knowledge base — update here only.
//
// Naming note: displayed as "Hafzal Ahmed" (matches hafzal.dev / github.com/hafzal03).
// Full legal name is preserved separately since it appears differently across
// historical certificates (see content/courses.ts) — never silently rewritten.

export const profile = {
  name: "Hafzal Ahmed",
  legalName: "Hafizal Ahmed Hassan Mohammed",
  role: "Software Engineer · AI Engineer",
  tagline:
    "Building intelligent software with Python, AI, LLMs, RAG, agents, and modern engineering practices.",
  summary: `Hafzal Ahmed is a software and AI engineer whose background combines formal study in
computer applications and informatics with hands-on engineering work. His academic foundation —
a Bachelor of Computer Applications and a Master's in Informatics — covered programming,
databases, software engineering, networking, cloud technologies, and information security. His
current engineering work centers on AI application development: large language models,
Retrieval-Augmented Generation, AI agents, workflow orchestration, and the Model Context Protocol
(MCP). His most advanced project, Khwarizmi Studio, is an AI-native studio where an AI Engineer
agent designs, builds, tests, and ships real code into a user's own GitHub repository and cloud
environment — bringing together LLM orchestration, RAG-backed repository intelligence, MCP tools,
sandboxed execution, and Azure deployment into one system.`,
  // Deliberately distinguishes what's practiced day-to-day from what was studied — see the
  // About section's "Academic knowledge vs. hands-on experience" framing and skills.ts tiers.
  distinctionNote:
    "This site distinguishes hands-on engineering (things actually built), current AI engineering (Khwarizmi Studio and related work), academic knowledge (studied during the BCA and Master's), and formal training/certification — rather than presenting every studied subject as professional expertise.",
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
} as const;
