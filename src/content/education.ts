// Real academic history only. Subject lists are grouped into meaningful
// categories rather than dumped as a flat list — completing a subject is
// academic exposure, not professional mastery, and the UI/RAG knowledge base
// both frame it that way (see profile.ts's distinctionNote).

export interface SubjectGroup {
  category: string;
  subjects: string[];
}

export interface Degree {
  slug: string;
  degree: string;
  institution: string;
  faculty?: string;
  summary: string;
  subjectGroups: SubjectGroup[];
}

export const degrees: Degree[] = [
  {
    slug: "bca",
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Jamal Mohammed College (Autonomous)",
    summary:
      "Undergraduate study covering programming fundamentals, databases, systems, software development, networking, testing, data structures, mathematics, and business concepts — the starting foundation, not a claim of mastery in every subject listed below.",
    subjectGroups: [
      {
        category: "Programming",
        subjects: [
          "Programming in C",
          "C Programming Lab",
          "C++ Programming",
          "C++ Programming Lab",
          "Java Programming",
          "Java Programming Lab",
          "Python Programming",
          "Python Programming Practical",
          "PHP Programming",
          "VB.NET",
        ],
      },
      {
        category: "Software Engineering & Testing",
        subjects: ["Software Engineering", "Software Testing Tools", "Software Development"],
      },
      {
        category: "Data & Databases",
        subjects: ["Database Management System", "RDBMS", "Data Structures"],
      },
      {
        category: "Operating Systems & Systems",
        subjects: ["Operating System", "Data Communication and Networking"],
      },
      {
        category: "Emerging Technologies",
        subjects: ["Internet of Things", "Multimedia and Its Applications"],
      },
      {
        category: "Mathematics / Analytical",
        subjects: ["Numerical and Statistical Methods", "Operational Research"],
      },
      {
        category: "Business / Management",
        subjects: [
          "Entrepreneurship Development",
          "Management Principles",
          "Principles of Accountancy",
          "Accounting Package Lab",
        ],
      },
      {
        category: "Other Academic Subjects",
        subjects: [
          "Digital Electronics",
          "Environmental Studies",
          "Gender Studies",
          "Soft Skills Development",
        ],
      },
    ],
  },
  {
    slug: "masters-informatics",
    degree: "Master's in Informatics",
    institution: "Technical University of Košice",
    faculty: "Faculty of Electrical Engineering and Informatics",
    summary:
      "Graduate study in informatics with coursework spanning programming language theory, software engineering, requirements engineering, cybersecurity, cloud technologies, parallel computing, and systems modeling — completed with a diploma thesis (see the Master's Thesis project for the full case study).",
    subjectGroups: [
      {
        category: "Programming Languages & Theory",
        subjects: ["Semantics of Programming Languages", "Type Theory", "Logics of Informatics"],
      },
      {
        category: "Software Engineering",
        subjects: [
          "Requirements Engineering",
          "Software System Evaluation",
          "Modeling and Prototype of Systems",
          "Diploma Project",
        ],
      },
      {
        category: "Cybersecurity",
        subjects: [
          "Current Trends in Informatics and Cybersecurity",
          "Information and Communication Security",
        ],
      },
      {
        category: "Cloud Technologies",
        subjects: ["Cloud Technologies Development"],
      },
      {
        category: "Parallel Computing",
        subjects: ["Parallel Programming", "Parallel Computer Systems"],
      },
      {
        category: "Systems Modeling",
        subjects: ["Modeling and Simulation"],
      },
      {
        category: "Informatics Theory",
        subjects: ["Main Knowledge of Study Field in Informatics and Its Use"],
      },
      {
        category: "Business & Professional Skills",
        subjects: ["Basics of Business Skills for Non-Economists"],
      },
    ],
  },
];
