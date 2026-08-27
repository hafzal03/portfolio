// Single source of truth for every project. Read by the UI (Projects section)
// and by the RAG knowledge base (lib/rag/knowledge.ts). Add a new project here
// and it is automatically picked up everywhere, including the chatbot.
//
// Every fact below is grounded in material Hafzal provided directly, or (for
// Khwarizmi Studio) verified against the project's own README/PRD/architecture
// docs. Where a technical detail hasn't been confirmed, it's marked as such
// rather than invented — search for "to be confirmed" below.

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
  /** Filter facets shown as chips and used by the archive's search/filter UI. */
  tags: string[];
  tagline: string;
  /** Short card-level description. */
  description: string;
  /** Rich detail-view description, one or more paragraphs. Also feeds the RAG knowledge base. */
  longDescription: string[];
  technologies: string[];
  /** Labelled sub-sections shown in the expanded detail view — only included when there's real information for them. */
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
    tags: ["AI", "Python", "Cloud", "Software Engineering", "Web"],
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
        heading: "What it is, and why it exists",
        body: "AI website/app builders today produce disposable output — code you can't take with you, can't run through your own CI/CD, and can't hand to another engineer. Khwarizmi Studio is built around the opposite premise: an AI Engineer agent works inside your own GitHub repository and cloud account from the first commit, using the same engineering discipline (tests, CI, reviewable PRs) a human collaborator would. Hafzal built it to understand — and demonstrate — how a real AI application is constructed around an LLM, rather than treating the LLM as the entire application.",
      },
      {
        heading: "How the LLM fits into the architecture",
        body: "The LLM is deliberately kept out of the execution path. A Plan → Act → Verify → Report state machine, with a human-approval boundary, is the actual orchestrator. The LLM (provider-neutral: Anthropic and Gemini adapters, plus a deterministic fake provider for testing) only ever produces a structured Plan — it never executes anything directly. A bounded, budget-limited, allow-listed tool-calling loop then carries that plan out.",
      },
      {
        heading: "How RAG and Repository Intelligence work",
        body: "Retrieval-Augmented Generation grounds the agent's understanding of a connected codebase: information is chunked, embedded, and retrieved via pgvector inside the existing Postgres instance — deliberately no separate vector database. This lets the agent answer questions about, and act on, an existing repository's real structure and conventions rather than guessing.",
      },
      {
        heading: "How agents, tools, and MCP fit together",
        body: "Agent-facing capabilities are unified behind a ToolRegistry and exposed as MCP (Model Context Protocol) tools, used specifically where the agent itself is deciding to take an action: a Sandbox MCP server (list_files, read_file, search_files, write_file, run_build, run_tests — allow-listed, logged with full diffs), a GitHub MCP server (create_repo, commit, open_pr — human-confirmation-gated), and a RAG-backed Repository Search MCP for indexed codebases. This is the concrete mechanism behind \"AI agents\" and \"tool calling\" in Hafzal's work: structured, permissioned interfaces rather than an agent with unrestricted access.",
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
        heading: "What Hafzal personally implemented",
        body: "The agent core state machine, the MCP tool boundary and its allow-list/confirmation policy, the RAG-backed Repository Intelligence pipeline, the sandbox execution model, the CI/CD pipeline, and the Azure deployment integration. Python and FastAPI on the backend, React/TypeScript/Vite on the frontend.",
      },
      {
        heading: "Current status & lessons learned",
        body: "Khwarizmi Studio is a release candidate, not yet declared production-ready — honestly, by design. Building the pre-publish verification gate and the MCP permission boundary taught the most: giving an LLM real write access to a user's repository requires the platform, not the model, to be the authority over every irreversible action. Remaining work includes a clean real-provider end-to-end run (prepared, pending approval to spend real model quota) and finishing live Azure subscription testing for the deployment provider.",
      },
    ],
  },
  {
    slug: "masters-thesis-case",
    name: "Information System for Computer-Aided Software Engineering",
    category: "Academic & Research",
    tags: ["Thesis", "Academic", "Python", "Web", "Database", "Software Engineering", "Research"],
    tagline: "Master's thesis — a web-based CASE and project-management system",
    description:
      "Hafzal's Master's thesis at the Technical University of Košice: a web-based information system supporting Computer-Aided Software Engineering (CASE) and project management, built with Python and Flask.",
    longDescription: [
      "Hafzal's Master's thesis, Information System for Computer-Aided Software Engineering, was completed at the Technical University of Košice, Faculty of Electrical Engineering and Informatics. It focuses on the design and implementation of a web-based information system supporting CASE and project-management activities.",
      "The objective was to analyze the current state of CASE tools and requirements-management approaches, then develop a lightweight system demonstrating key CASE concepts: requirement management, dependency tracking, project planning, and responsibility assignment. The research included an analysis of modern CASE environments, requirements engineering methods, and techniques used for project scheduling and traceability management.",
      "Based on that analysis, a web-based prototype was designed and implemented using Python, Flask, a relational database, and web interface technologies. The system was implemented and tested against several functional scenarios to verify correctness of its modules and the readability of its dependency-management mechanisms.",
    ],
    technologies: ["Python", "Flask", "Relational Database", "Web Interface Technologies"],
    featured: true,
    breakdown: [
      {
        heading: "Problem",
        body: "Software projects need a way to manage requirements, track dependencies between them, assign responsibility, and schedule work — but many CASE tools are either heavyweight commercial platforms or absent entirely from smaller academic and educational contexts.",
      },
      {
        heading: "Research",
        body: "An analysis of modern CASE environments, requirements-engineering methods, and project-scheduling/traceability-management techniques, used to establish what a lightweight system would need to demonstrate to be a credible educational example of the field.",
      },
      {
        heading: "System objectives",
        body: "Develop a lightweight web-based system demonstrating core CASE concepts — requirement management, dependency tracking, project planning, and responsibility assignment — as an accessible, simplified environment rather than a full commercial CASE platform.",
      },
      {
        heading: "Requirements management",
        body: "Users can create and manage project requirements within the system.",
      },
      {
        heading: "Dependency management & circular dependency detection",
        body: "The system supports defining dependencies between requirements and includes detection of circular dependencies — an essential correctness check for any dependency graph used in real project planning.",
      },
      {
        heading: "Responsibility assignment & incidence matrix",
        body: "Project responsibility can be assigned using an incidence matrix, connecting requirements/tasks to the people responsible for them.",
      },
      {
        heading: "Project scheduling & Gantt charts",
        body: "The system generates project schedules and Gantt charts from the underlying requirement and dependency data.",
      },
      {
        heading: "Glossary & import/export",
        body: "A glossary of project terminology is maintained within the system, and projects can be imported and exported using structured formats.",
      },
      {
        heading: "Technology stack & implementation",
        body: "Built with Python and Flask on the backend, a relational database for persistence, and web interface technologies for the frontend. (Specific database engine and frontend framework beyond \"web interface technologies\" — to be confirmed.)",
      },
      {
        heading: "Testing",
        body: "The system was tested using several functional scenarios designed to verify the correctness of its implemented modules and the readability of its dependency-management mechanisms.",
      },
      {
        heading: "Results & academic significance",
        body: "The results demonstrated that the proposed system successfully supports essential CASE activities and provides an educational demonstration of software engineering and project-management concepts in a simplified, accessible environment. The thesis represents Hafzal's academic foundation in software engineering and information systems, prior to his later, more advanced AI engineering work.",
      },
      {
        heading: "Engineering lessons learned",
        body: "Requirements management is inseparable from dependency correctness — a requirements system without circular-dependency detection can silently produce an unschedulable project. Building the incidence-matrix-based responsibility assignment also reinforced that project management tooling has to model both the technical structure (requirements, dependencies) and the human structure (who owns what) as first-class, connected data.",
      },
    ],
  },
  // {
  //   slug: "pd-vesture",
  //   name: "PD_VESTURE",
  //   category: "Web Development",
  //   tags: ["Web", "AI"],
  //   tagline: "A luxury fashion e-commerce experience",
  //   description:
  //     "A modern, visually sophisticated digital shopping experience for a luxury fashion brand — built with Next.js, React, TypeScript, Tailwind CSS, and Framer Motion.",
  //   longDescription: [
  //     "PD_VESTURE is a modern web-development and e-commerce-oriented project focused on creating a luxury fashion website and digital shopping experience. It uses Next.js, React, TypeScript, Tailwind CSS, and Framer Motion to build a polished, animated frontend with reusable components and responsive layouts.",
  //     "The project demonstrates a different side of Hafzal's capabilities from his AI work — structuring a frontend application into reusable components, implementing responsive layouts, building interactive experiences, and using animation deliberately to improve the user experience rather than for decoration alone.",
  //   ],
  //   technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"],
  //   featured: true,
  // },
  {
    slug: "case-based-system",
    name: "Case-Based System",
    category: "Software Engineering",
    tags: ["Software Engineering", "Academic", "Research"],
    tagline: "Software engineering work connected to Hafzal's broader CASE-tool background",
    description:
      "A project connected to Hafzal's software-engineering and CASE-tool background, kept as a separate entry from the Master's thesis.",
    longDescription: [
      "Case-Based System is part of Hafzal's broader software-engineering and CASE-tool background, distinct from the Master's thesis (Information System for Computer-Aided Software Engineering). Technical implementation details for this project are to be confirmed.",
    ],
    technologies: [],
    archived: true,
  },
  {
    slug: "docker-kubernetes-deployment",
    name: "Docker & Kubernetes Deployment",
    category: "DevOps & Cloud",
    tags: ["Docker", "Kubernetes", "Cloud", "Software Engineering"],
    tagline: "Containerization and orchestration in practice",
    description:
      "Hands-on work with Docker containerization and Kubernetes orchestration — packaging applications, and deploying and managing them across a container platform.",
    longDescription: [
      "This work covers Docker, Linux, containers, application packaging, and deployment concepts, extending into Kubernetes services and orchestration — understanding how applications are packaged into containers and how those containerized applications are deployed and managed at scale.",
      "It represents a bridge between traditional application development and modern deployment practice, and forms part of the DevOps foundation behind Khwarizmi Studio's own sandboxed, containerized agent execution. (Specific deployment targets and cluster configuration used — to be confirmed.)",
    ],
    technologies: ["Docker", "Kubernetes", "Linux", "Containers"],
    featured: true,
  },
  {
    slug: "face-recognition-attendance",
    name: "Face Recognition Attendance System",
    category: "Computer Vision & ML",
    tags: ["AI", "Python", "Academic"],
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
    tags: ["AI", "Python", "Web"],
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
    tags: ["Java", "Software Engineering", "Academic"],
    tagline: "An early Java application project",
    description:
      "A Java-based system for managing toll plaza operations — object-oriented design, application logic, and workflow modelling.",
    longDescription: [
      "One of Hafzal's earliest software-development projects, built in Java to manage the operations of a toll plaza. It demonstrates early experience with object-oriented programming, application logic, data handling, and translating a real-world operational problem into defined entities, processes, and system workflows. Specific feature-level implementation details are to be confirmed.",
    ],
    technologies: ["Java", "Object-Oriented Programming"],
    archived: true,
  },
  {
    slug: "client-server-cpp",
    name: "Client-Server Communication in C++",
    category: "Software Engineering",
    tags: ["C++", "Networking", "Systems", "Academic"],
    tagline: "Networked application programming in C++",
    description:
      "A networking project exploring client-server architecture in C++, including communication between client and server.",
    longDescription: [
      "This project covers establishing communication between a client and a server over a network, exchanging information, and building a working networked application using C++ and client-server architecture and systems-programming concepts.",
      "It shows that Hafzal's technical development wasn't limited to web development or AI — he also worked with lower-level software and networking concepts. Specific protocols, ports, concurrency model, authentication, encryption, and any database integration used — to be confirmed.",
    ],
    technologies: ["C++", "Networking", "Client-Server Architecture"],
    archived: true,
  },
  {
    slug: "requirements-management-system",
    name: "Requirements Management System",
    category: "Software Engineering",
    tags: ["Software Engineering", "Academic", "Database"],
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
    tags: ["Academic", "Systems", "Research"],
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
    tags: ["AI", "Academic", "Systems"],
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
    tags: ["AI", "Academic"],
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
    tags: ["Cloud", "Networking", "Systems"],
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
    tags: ["Cloud"],
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
    tags: ["Docker", "Kubernetes", "Cloud", "Software Engineering"],
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
    tags: ["Networking", "Systems", "Academic"],
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
    tags: ["Database", "Academic", "Software Engineering"],
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
    tags: ["Systems", "Cloud"],
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
    // A personal engineering project and portfolio implementation — deliberately
    // not framed as a company, startup, or founder role, and not as academic work.
    slug: "hafzal-portfolio",
    name: "Hafzal.dev",
    category: "Web Development",
    tags: ["Web", "AI", "Cloud", "Python", "Software Engineering", "Docker"],
    tagline: "An end-to-end build: Next.js app, RAG chatbot, CI/CD, and a live Azure deployment",
    description:
      "A personal engineering project taken from local development to a public production website: a Next.js 15 application with a RAG-powered AI chatbot, automated GitHub Actions CI/CD, and deployment to Azure Static Web Apps on a custom domain.",
    longDescription: [
      "Hafzal.dev is the site you're currently reading, and it is itself a completed engineering project rather than just a résumé page. Hafzal designed, implemented, deployed, and continues to develop it — covering the full path from an empty repository to a publicly accessible production website on a custom domain.",
      "The application is a Next.js 15 project written in TypeScript, with an emphasis on interaction and motion design: a scroll-driven animated backdrop, 3D perspective and mouse-tracked tilt effects, shared-element transitions between project cards and their detail views, and a reduced-motion path so the whole experience degrades gracefully for users who prefer less animation.",
      "Its one deliberately advanced component is Hafzal AI — a Retrieval-Augmented Generation chatbot that answers questions about Hafzal grounded strictly in this site's own content. The knowledge base is built directly from the site's content files, embedded with Google's Gemini embedding model, retrieved by cosine similarity over an in-memory vector set, and passed as context to Gemini for generation. There is no separate vector database: at portfolio scale, an in-memory array is the simplest correct tool. The API key is read server-side only, inside a Next.js route handler, so it is never exposed to the browser.",
      "The deployment side is a real part of the work. The repository is managed with Git and GitHub; a GitHub Actions workflow runs linting, typechecking, tests, and a production build on every push and pull request; and Azure Static Web Apps builds and deploys the application automatically on merges to the main branch. The custom domain hafzal.dev is configured through DNS with HTTPS/SSL provided by Azure, and the production secret is stored as an Azure application setting rather than anywhere in the repository.",
    ],
    technologies: [
      "Next.js 15",
      "TypeScript",
      "React",
      "Tailwind CSS",
      "Framer Motion",
      "Google Gemini API",
      "Retrieval-Augmented Generation",
      "Azure Static Web Apps",
      "GitHub Actions",
      "Vitest",
      "DNS / Custom Domain",
      "HTTPS / SSL",
    ],
    status: "Live in production — actively developed",
    featured: true,
    breakdown: [
      {
        heading: "What this project is",
        body: "A personal software and AI engineering project: a portfolio website that doubles as a practical demonstration of taking a modern web application from local development, through source control and automated CI/CD, onto cloud infrastructure with a custom domain and HTTPS. It is a personal project and portfolio implementation — not a business, startup, or commercial product.",
      },
      {
        heading: "Frontend & UI/UX engineering",
        body: "Built with Next.js 15 (App Router) and TypeScript, styled with Tailwind CSS, and animated with Framer Motion. The interaction work includes a scroll-driven backdrop whose layers respond continuously to scroll depth, 3D perspective with mouse-tracked tilt, shared-element expand transitions from project cards into full case-study views, a filterable project archive, and a system-style HUD overlay. Accessibility and responsiveness were treated as requirements rather than extras: keyboard-navigable controls, semantic structure, and a full prefers-reduced-motion path.",
      },
      {
        heading: "Hafzal AI — RAG architecture",
        body: "The chatbot's knowledge base is generated from the same content modules that render the site, so adding a project updates both the page and what the assistant knows. Those chunks are embedded via Gemini's embedding model and cached in memory for the life of the server process; an incoming question is embedded with the matching retrieval task type, scored against every chunk by cosine similarity, and the top matches are passed to Gemini as grounding context. A strict system prompt constrains it to the retrieved material and requires it to say when something isn't in the portfolio rather than guessing.",
      },
      {
        heading: "Backend & secure secret handling",
        body: "The AI integration runs entirely server-side in a Next.js route handler: the browser posts a question to the API, and the API performs retrieval and model calls. The Gemini API key is read only from a server-side environment variable, never referenced in client code, never bundled into the browser, and never committed — locally it lives in a gitignored .env.local, and in production it is an Azure application setting. The route also validates and size-limits input, applies rate limiting, and converts provider failures into friendly messages instead of leaking stack traces.",
      },
      {
        heading: "CI/CD & deployment automation",
        body: "The repository is managed with Git and GitHub. A GitHub Actions workflow acts as a quality gate on every push and pull request — install, lint, typecheck, test, production build — so a broken change is caught before it can ship. Azure Static Web Apps is connected to the repository and builds and deploys the application automatically when changes land on the main branch, giving a genuine push-to-production pipeline rather than a manual upload.",
      },
      {
        heading: "Cloud infrastructure, domain & HTTPS",
        body: "Hosted on Microsoft Azure Static Web Apps, with environment configuration and application settings managed in Azure. The custom domain hafzal.dev was purchased and configured through DNS records pointing at the Azure deployment, with HTTPS/SSL certificates handled by Azure. An alternative Azure App Service deployment path is also defined as infrastructure-as-code (Bicep) in the repository for a more controlled hosting option.",
      },
      {
        heading: "Testing & verification",
        body: "Vitest covers the parts where correctness actually matters: retrieval ranking and the cosine-similarity implementation, chat request validation, the Gemini request assembly (role mapping and context placement), and knowledge-base integrity — including a test asserting that accuracy-critical distinctions, such as completed training versus a passed certification exam, survive into what the assistant is given. Beyond unit tests, the site was verified against a real production build and checked live in the browser.",
      },
      {
        heading: "What this project taught",
        body: "The deployment and integration work was where most of the learning happened: configuring cloud hosting and environment settings, wiring automated CI/CD so quality checks gate every change, connecting and validating a custom domain with DNS and HTTPS, and handling API credentials so that a secret used by the application never reaches the browser or the repository. On the AI side, it meant building a retrieval pipeline end to end — chunking content, generating and caching embeddings, ranking by similarity, and constraining a language model to only the retrieved evidence so it reports missing information instead of inventing it.",
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const archivedProjects = projects.filter((p) => p.archived);

export const allTags = Array.from(new Set(projects.flatMap((p) => p.tags))).sort();
