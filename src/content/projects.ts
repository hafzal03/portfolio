// Single source of truth for every project. Read by the UI (Projects section)
// and by the RAG knowledge base (lib/rag/knowledge.ts). Add a new project here
// and it is automatically picked up everywhere, including the chatbot.
//
// Every fact below is grounded in material Hafzal provided directly, or (for
// Khwarizmi Studio) verified against the project's own README/PRD/architecture
// docs. Nothing here is invented.

export type ProjectCategory =
  | "AI Engineering"
  | "Web Development"
  | "DevOps & Cloud"
  | "Academic & Research"
  | "Computer Vision & ML"
  | "Software Engineering";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  tagline: string;
  /** Short card-level description. */
  description: string;
  /** Rich detail-view description, one or more paragraphs. Also feeds the RAG knowledge base. */
  longDescription: string[];
  technologies: string[];
  /** Only for the flagship project — labelled sub-sections shown in the expanded detail view. */
  breakdown?: { heading: string; body: string }[];
  status?: string;
  featured?: boolean;
  /** Shown only in the "complete archive" list, not the main grid. */
  archived?: boolean;
}

export const projects: Project[] = [
  {
    slug: "khwarizmi-studio",
    name: "Khwarizmi Studio",
    category: "AI Engineering",
    tagline: "An AI Engineer that ships real code into your own GitHub repo",
    description:
      "An AI-native studio where you describe what you want to build, and an AI Engineer agent designs, builds, tests, and ships it as real, working code — into your own GitHub repository, deployed to Azure. No throwaway output, no black box: every change is a reviewable pull request.",
    longDescription: [
      "Khwarizmi Studio (named after Muhammad ibn Musa al-Khwarizmi, whose work gave us the word \"algorithm\") is Hafzal's most advanced project and the current stage of his progression from traditional software engineering into AI engineering. It is not a template picker or a black-box generator — it's an AI Engineer: a persistent, sandboxed coding agent that plans, writes, tests, and ships code the same way a careful human engineer would, with every change landing as an inspectable, versioned pull request.",
      "The system runs two workflows through the same underlying agent: a Website Creation Workflow (brief → plan → sandboxed build → pre-publish verification → GitHub + Azure deploy) and an AI Engineer Workflow, where the same agent is assigned scoped tasks on an existing, connected repository — indexing it with Repository Intelligence, working in an isolated branch, and opening a PR with test results and an evaluation summary.",
      "Early prototyping explored LangChain and LangGraph for the LLM orchestration layer. Hafzal later replaced that with a custom, deterministic Plan → Act → Verify → Report state machine — a design choice made for tighter auditability and safety guarantees: the LLM only ever produces a structured Plan, and is never itself an authority over which tools actually execute.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vite",
      "PostgreSQL + pgvector",
      "Redis",
      "Docker",
      "Model Context Protocol (MCP)",
      "Anthropic & Gemini APIs",
      "Retrieval-Augmented Generation",
      "Azure",
      "GitHub Actions",
    ],
    status: "Release candidate — in active development",
    featured: true,
    breakdown: [
      {
        heading: "What problem does it solve?",
        body: "AI website/app builders today produce disposable output — code you can't take with you, can't run through your own CI/CD, and can't hand to another engineer. Khwarizmi Studio is built around the opposite premise: the AI Engineer works inside your own GitHub repository and cloud account from the first commit, using the same engineering discipline (tests, CI, reviewable PRs) a human collaborator would.",
      },
      {
        heading: "Agent core",
        body: "A Plan → Act → Verify → Report state machine with a human-approval boundary. The LLM (provider-neutral: Anthropic and Gemini adapters, plus a deterministic fake provider for testing) only ever produces a structured Plan — it never executes anything directly. A bounded, budget-limited, allow-listed tool-calling loop carries the plan out.",
      },
      {
        heading: "MCP tools",
        body: "Agent-facing capabilities are unified behind a ToolRegistry and exposed as MCP tools, used specifically where the agent itself is deciding to take an action: a Sandbox MCP server (list_files, read_file, search_files, write_file, run_build, run_tests — allow-listed, logged with full diffs), a GitHub MCP server (create_repo, commit, open_pr — human-confirmation-gated), and a RAG-backed Repository Search MCP for indexed codebases.",
      },
      {
        heading: "RAG — Repository Intelligence",
        body: "Retrieval-Augmented Generation grounds the agent's understanding of a connected codebase: information is chunked, embedded, and retrieved via pgvector inside the existing Postgres instance — deliberately no separate vector database. This lets the agent answer questions about, and act on, an existing repository's real structure and conventions rather than guessing.",
      },
      {
        heading: "Sandboxed execution & safety",
        body: "All writes, builds, and tests run inside a network-disabled, resource-capped, per-run Docker container with fixed commands only — the model never gets a raw shell. A full pre-publish verification gate (build/tests, broken links, accessibility baseline, performance budget, secret/security scan, supply-chain checks) has to pass before anything ships, and the platform underwent a full security audit across 26 boundaries under one governing rule: the model is never an authority over which tools run.",
      },
      {
        heading: "Deployment & CI/CD",
        body: "Ships to Azure behind a DeploymentProvider interface, with GitHub Actions running backend (ruff, mypy --strict, pytest) and frontend (eslint, vitest, tsc + build) checks on every change. Evaluation dashboards track 21 metrics across 10 deterministic scenarios per project.",
      },
      {
        heading: "Current status & lessons learned",
        body: "Khwarizmi Studio is a release candidate, not yet declared production-ready — honestly, by design. Building the pre-publish verification gate and the MCP permission boundary taught the most: giving an LLM real write access to a user's repository requires the platform, not the model, to be the authority over every irreversible action. Remaining work includes a clean real-provider end-to-end run (prepared, pending approval to spend real model quota) and finishing live Azure subscription testing for the deployment provider.",
      },
    ],
  },
  {
    slug: "pd-vesture",
    name: "PD_VESTURE",
    category: "Web Development",
    tagline: "A luxury fashion e-commerce experience",
    description:
      "A modern, visually sophisticated digital shopping experience for a luxury fashion brand — built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion.",
    longDescription: [
      "PD_VESTURE is a modern web-development and e-commerce-oriented project focused on creating a luxury fashion website and digital shopping experience. It uses Next.js, React, TypeScript, Tailwind CSS, and Framer Motion to build a polished, animated frontend with reusable components and responsive layouts.",
      "The project demonstrates a different side of Hafzal's capabilities from his AI work — structuring a frontend application into reusable components, implementing responsive layouts, building interactive experiences, and using animation deliberately to improve the user experience rather than for decoration alone.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
    featured: true,
  },
  {
    slug: "masters-thesis-case",
    name: "Information Systems Based on CASE (Master's Thesis)",
    category: "Academic & Research",
    tagline: "Master's-level research in Computer-Aided Software Engineering",
    description:
      "Hafzal's Master's thesis — independent academic research into information systems and Computer-Aided Software Engineering (CASE): system analysis, system design, and computer-aided approaches to software development.",
    longDescription: [
      "Hafzal's Master's thesis, titled Information Systems Based on Computer-Aided Software Engineering, is a complete piece of independent academic and research work — his academic foundation in software engineering and information systems before his later move into modern AI engineering.",
      "It covers the research problem and objectives, the methodology used, the system analysis and design work, implementation where applicable, evaluation of results, and conclusions and future directions for the research.",
    ],
    technologies: ["Systems Analysis", "Software Engineering Methodology", "CASE Tools"],
    featured: true,
  },
  {
    slug: "docker-kubernetes-deployment",
    name: "Docker & Kubernetes Deployment",
    category: "DevOps & Cloud",
    tagline: "Containerization and orchestration in practice",
    description:
      "Hands-on work with Docker containerization and Kubernetes orchestration — packaging applications, and deploying and managing them across a container platform.",
    longDescription: [
      "This work covers Docker, Linux, containers, application packaging, and deployment concepts, extending into Kubernetes services and orchestration — understanding how applications are packaged into containers and how those containerized applications are deployed and managed at scale.",
      "It represents a bridge between traditional application development and modern deployment practice, and forms part of the DevOps foundation behind Khwarizmi Studio's own sandboxed, containerized agent execution.",
    ],
    technologies: ["Docker", "Kubernetes", "Linux", "Containers"],
    featured: true,
  },
  {
    slug: "face-recognition-attendance",
    name: "Face Recognition Attendance System",
    category: "Computer Vision & ML",
    tagline: "Automating attendance with facial recognition",
    description:
      "A computer-vision project using facial recognition to automate attendance management — an early, practical application of AI to a real-world workflow.",
    longDescription: [
      "Face Recognition Attendance System combines software development with computer vision and machine-learning concepts to identify individuals from facial information and use that identification as part of an automated attendance process.",
      "It represents an earlier stage of Hafzal's AI journey, focused on visual information and image processing, before his later focus on language models, RAG, agents, and AI workflows.",
    ],
    technologies: ["Python", "Computer Vision", "Machine Learning", "Image Processing"],
    featured: true,
  },
  {
    slug: "resume-classifier",
    name: "Resume Classifier Web Application",
    category: "AI Engineering",
    tagline: "A web app that classifies resumes automatically",
    description:
      "A web application that takes user-provided resumes, processes them, and applies classification logic to return a useful result.",
    longDescription: [
      "Resume Classifier Web Application connects web application development with document processing and automated classification — taking a real document, processing it, and building an intelligent workflow around that processing rather than a purely static application.",
      "It's part of the AI/ML experimentation that preceded Hafzal's later, more advanced LLM and RAG work.",
    ],
    technologies: ["Python", "Web Development", "Text Classification"],
    archived: true,
  },
  {
    slug: "toll-plaza-management",
    name: "Toll Plaza Management System",
    category: "Software Engineering",
    tagline: "An early Java application project",
    description:
      "A Java-based system for managing toll plaza operations — object-oriented design, application logic, and workflow modelling.",
    longDescription: [
      "One of Hafzal's earliest software-development projects, built in Java to manage the operations of a toll plaza. It demonstrates early experience with object-oriented programming, application logic, data handling, and translating a real-world operational problem into defined entities, processes, and system workflows.",
    ],
    technologies: ["Java", "Object-Oriented Programming"],
    archived: true,
  },
  {
    slug: "client-server-cpp",
    name: "Client-Server Communication in C++",
    category: "Software Engineering",
    tagline: "Networked application programming in C++",
    description:
      "A networking project exploring client-server architecture in C++, including secure/encrypted communication between client and server.",
    longDescription: [
      "This project covers establishing communication between a client and a server over a network, exchanging information, handling requests and responses, and building a working networked application — including work on secure/encrypted communication, protocols, and data exchange.",
      "It shows that Hafzal's technical development wasn't limited to web development or AI — he also worked with lower-level software and networking concepts.",
    ],
    technologies: ["C++", "Networking", "Client-Server Architecture"],
    archived: true,
  },
  {
    slug: "requirements-management-system",
    name: "Requirements Management System",
    category: "Software Engineering",
    tagline: "Managing the software requirements lifecycle",
    description:
      "A system focused on managing software requirements and the information associated with them throughout the development lifecycle.",
    longDescription: [
      "A software-engineering project demonstrating that development isn't only about programming — it's also about collecting, organizing, tracing, and managing requirements throughout a project's lifecycle. Connects directly to Hafzal's Master's-level CASE and information-systems background.",
    ],
    technologies: ["Requirements Engineering", "Systems Analysis"],
    archived: true,
  },
  {
    slug: "parallel-matrix-multiplication",
    name: "Parallel Matrix Multiplication",
    category: "Academic & Research",
    tagline: "Dividing a computationally intensive operation across processors",
    description:
      "Exploring how matrix multiplication can be divided into concurrent work instead of executed purely sequentially.",
    longDescription: [
      "A parallel-computing project exploring how a computationally intensive operation such as matrix multiplication can be divided into work that runs concurrently — algorithmic thinking, computational optimization, and performance-oriented programming.",
    ],
    technologies: ["Parallel Computing", "Algorithms"],
    archived: true,
  },
  {
    slug: "parallel-edge-detection",
    name: "Parallel Edge Detection",
    category: "Computer Vision & ML",
    tagline: "Image edge detection with parallel processing",
    description:
      "Applying edge-detection techniques to images while exploring parallel processing for performance.",
    longDescription: [
      "Combines image processing with parallel computation — applying edge-detection techniques to image data while exploring how the computation can be sped up through parallel execution. A separate project from Parallel Matrix Multiplication, applying the same parallel-computing lens to a different problem.",
    ],
    technologies: ["Parallel Computing", "Computer Vision"],
    archived: true,
  },
  {
    slug: "ct-image-processing",
    name: "CT Image Processing",
    category: "Computer Vision & ML",
    tagline: "Processing and analyzing medical CT imagery",
    description:
      "A medical-image-processing project involving the processing and analysis of CT images.",
    longDescription: [
      "Exposure to image-processing techniques, computer vision, and computational approaches applied to specialized medical imagery rather than ordinary application data.",
    ],
    technologies: ["Computer Vision", "Image Processing"],
    archived: true,
  },
  {
    slug: "cloud-infrastructure",
    name: "Cloud Infrastructure Project",
    category: "DevOps & Cloud",
    tagline: "Infrastructure, deployment, and cloud environments",
    description:
      "Work and learning around cloud infrastructure — deployment, services, networking, application hosting, and configuration.",
    longDescription: [
      "Covers infrastructure, deployment, services, networking, application hosting, and configuration in cloud environments — the development of understanding how applications move beyond local development into remotely hosted, managed environments. Forms part of the progression toward the current Azure deployment and CI/CD work on Khwarizmi Studio and this portfolio.",
    ],
    technologies: ["Cloud Infrastructure", "Networking"],
    archived: true,
  },
  {
    slug: "cloud-deployment-hosting",
    name: "Cloud Deployment and Hosting",
    category: "DevOps & Cloud",
    tagline: "Taking an application from local dev to hosted and reachable",
    description:
      "Deploying and hosting applications in cloud environments — configuring deployment components and understanding the relationship between code, infrastructure, and hosting.",
    longDescription: [
      "Directly relevant to deploying this portfolio and its AI chatbot through Microsoft Azure with GitHub-based CI/CD.",
    ],
    technologies: ["Cloud Hosting", "Deployment"],
    archived: true,
  },
  {
    slug: "devops-practice",
    name: "DevOps Practice",
    category: "DevOps & Cloud",
    tagline: "Git, CI/CD, and delivery practice",
    description:
      "Hands-on learning in Git, GitHub, version control, build processes, automated testing, deployment workflows, and CI/CD concepts.",
    longDescription: [
      "Represented honestly as practical learning and project work — Git, GitHub, version control, build processes, automated testing, CI/CD, Docker, Kubernetes, and cloud deployment — not as years of enterprise DevOps experience.",
    ],
    technologies: ["Git", "GitHub", "CI/CD", "Docker", "Kubernetes"],
    archived: true,
  },
  {
    slug: "networking-laboratory",
    name: "Networking Laboratory",
    category: "Academic & Research",
    tagline: "Academic networking coursework and experiments",
    description:
      "Practical exploration of computer networks, communication, client-server architecture, and networking protocols.",
    longDescription: [
      "Academic networking work that the Client-Server Communication in C++ project belongs within — the broader context for that concrete implementation.",
    ],
    technologies: ["Networking Protocols", "Client-Server Architecture"],
    archived: true,
  },
  {
    slug: "database-projects",
    name: "Database Projects",
    category: "Software Engineering",
    tagline: "Academic and applied database work",
    description:
      "A collection of academic and software-development work involving databases, SQL, and structured data storage/retrieval.",
    longDescription: [
      "Demonstrates understanding of how applications store and retrieve structured information and how database systems support software applications.",
    ],
    technologies: ["SQL", "Databases"],
    archived: true,
  },
  {
    slug: "system-linux-administration",
    name: "System & Linux Administration Practice",
    category: "DevOps & Cloud",
    tagline: "Operating systems, Linux, and environment configuration",
    description:
      "Hands-on exposure to Linux environments, command-line operations, system administration, and configuration.",
    longDescription: [
      "An important foundation for later work with containers, Docker, Kubernetes, cloud systems, backend development, and DevOps.",
    ],
    technologies: ["Linux", "System Administration"],
    archived: true,
  },
  {
    slug: "hafzal-portfolio",
    name: "Hafzal.dev — This Portfolio",
    category: "Web Development",
    tagline: "A production deployment case study, not just a résumé",
    description:
      "This site: a Next.js portfolio with a RAG-powered AI chatbot, deployed to Azure via GitHub Actions CI/CD — deliberately simple everywhere except the one advanced feature.",
    longDescription: [
      "The portfolio you're looking at is itself a project: a deliberately simple, high-polish personal site — no unnecessary microservices, no unnecessary databases — with exactly one advanced engineering feature, a Retrieval-Augmented Generation chatbot that answers questions about Hafzal grounded in this site's own content.",
      "It demonstrates the full lifecycle: GitHub-based development, automated linting/testing/build via GitHub Actions, and deployment to Microsoft Azure.",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "OpenAI API", "Azure", "GitHub Actions"],
    archived: true,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const archivedProjects = projects.filter((p) => p.archived);
