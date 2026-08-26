// Real certifications/training only. Two accuracy rules matter here more
// than anywhere else on the site:
//
// 1. `certificateName` preserves the name exactly as printed on the original
//    certificate ("Hafizal Ahmed Haj") even though the site displays
//    "Hafzal Ahmed" everywhere else — certificates are never silently
//    renamed to match current branding.
// 2. The AWS entry documents *training*, not a passed certification exam.
//    `notes` states that distinction explicitly and it must not be dropped
//    when this content is summarized or quoted (including by the chatbot).

export interface Course {
  name: string;
  provider: string;
  program?: string;
  topics: string[];
  date?: string;
  grade?: string;
  /** Name exactly as printed on the original certificate, if different from the site's display name. */
  certificateName?: string;
  /** Accuracy-critical context that must be preserved whenever this entry is summarized. */
  notes?: string;
  certificateUrl?: string;
}

export const courses: Course[] = [
  {
    name: "Certificate in C++ Programming",
    provider: "Institute of Entrepreneurship and Career Development, Bharathidasan University",
    program: "School University Industry Tie-Up Scheme (SU-IDS)",
    topics: ["C++ Programming"],
    date: "February–March 2017",
    grade: "Second Class",
    certificateName: "Hafizal Ahmed Haj",
    notes:
      "A formal C++ programming certificate demonstrating academic/training exposure to C++ — not a claim of professional C++ development experience.",
  },
  {
    name: "PC Hardware and Troubleshooting",
    provider: "Jamal Mohammed College (Autonomous) — Department of Computer Applications",
    program: "Value-added course, Bachelor of Computer Applications (Third BCA B)",
    topics: ["PC Hardware", "Troubleshooting"],
    grade: "A",
    certificateName: "Hafizal Ahmed Haj",
    notes: "Value-added academic course; detailed syllabus is not documented beyond the certificate title.",
  },
  {
    name: "AWS Certified Solutions Architect – Associate — Training",
    provider: "CSTech / SYSTECH",
    program: "Training ID 2489",
    topics: ["AWS Solutions Architecture (training)"],
    date: "August–September 2022",
    certificateName: "Hafizal Ahmed Haj",
    notes:
      "This documents completed AWS Solutions Architect – Associate training through CSTech/SYSTECH, not the official AWS certification exam credential. It should not be presented as having passed the AWS certification exam unless separate proof of that result is provided.",
  },
];

export const coursesPlaceholder =
  "Additional course and certification history may be added here as it's confirmed.";
