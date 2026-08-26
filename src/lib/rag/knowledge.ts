import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { degrees } from "@/content/education";
import { skillGroups } from "@/content/skills";
import { courses, coursesPlaceholder } from "@/content/courses";
import { services, pricingTiers, pricingDisclaimer } from "@/content/services";
import { contact } from "@/content/contact";

export interface KnowledgeChunk {
  id: string;
  text: string;
  source: string;
}

/**
 * Builds the chatbot's knowledge base directly from the same content files
 * that render the site. Add a project, degree, or course to content/*.ts and
 * it shows up here automatically — nothing to keep in sync by hand.
 */
export function buildKnowledgeChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  chunks.push({
    id: "profile-summary",
    source: "About",
    text: `${profile.name} (full name: ${profile.legalName}) — ${profile.role}. ${profile.summary}`,
  });

  chunks.push({
    id: "profile-focus",
    source: "About",
    text: `${profile.name}'s focus areas: ${profile.focusAreas.join(", ")}. ${profile.distinctionNote}`,
  });

  for (const degree of degrees) {
    const subjectsSummary = degree.subjectGroups
      .map((g) => `${g.category}: ${g.subjects.join(", ")}`)
      .join(". ");
    chunks.push({
      id: `education-${degree.slug}`,
      source: `Education: ${degree.degree}`,
      text: `${profile.name} completed a ${degree.degree} at ${degree.institution}${
        degree.faculty ? ` (${degree.faculty})` : ""
      }. ${degree.summary} Coursework by area — ${subjectsSummary}. This is academic coursework exposure, not a claim of professional mastery in every subject.`,
    });
  }

  for (const project of projects) {
    const body = project.longDescription.join(" ");
    chunks.push({
      id: `project-${project.slug}`,
      source: `Project: ${project.name}`,
      text: `Project: ${project.name} (${project.category}). ${project.tagline}. ${body} Technologies used: ${project.technologies.join(", ") || "not yet specified"}.${
        project.status ? ` Status: ${project.status}.` : ""
      }`,
    });

    if (project.breakdown) {
      for (const section of project.breakdown) {
        chunks.push({
          id: `project-${project.slug}-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          source: `Project: ${project.name} — ${section.heading}`,
          text: `${project.name} — ${section.heading}: ${section.body}`,
        });
      }
    }
  }

  for (const group of skillGroups) {
    chunks.push({
      id: `skills-${group.tier.toLowerCase().replace(/\s+/g, "-")}`,
      source: `Skills: ${group.tier}`,
      text: `${profile.name}'s ${group.tier} skills (${group.description}): ${group.skills.join(", ")}.`,
    });
  }

  if (courses.length > 0) {
    for (const course of courses) {
      const details = [
        course.provider,
        course.program,
        course.date,
        course.grade ? `Result: ${course.grade}` : null,
      ]
        .filter(Boolean)
        .join(". ");
      chunks.push({
        id: `course-${course.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        source: `Course/Certification: ${course.name}`,
        // The exact notes text is preserved verbatim here — this is the
        // accuracy-critical distinction (e.g. AWS training vs. exam
        // credential) that the chatbot must never drop or paraphrase away.
        text: `Certification/course: ${course.name}. ${details}. Topics: ${course.topics.join(", ")}.${
          course.notes ? ` IMPORTANT: ${course.notes}` : ""
        }${course.certificateName ? ` (Certificate is issued in the name "${course.certificateName}", from before ${profile.name} adopted his current professional name spelling.)` : ""}`,
      });
    }
  } else {
    chunks.push({
      id: "courses",
      source: "Courses & Learning",
      text: `Course and certification history: ${coursesPlaceholder}`,
    });
  }

  chunks.push({
    id: "services",
    source: "Services",
    text: `Services ${profile.name} offers: ${services.map((s) => `${s.name} — ${s.description}`).join("; ")}.`,
  });

  chunks.push({
    id: "pricing",
    source: "Pricing",
    text: `Indicative pricing packages: ${pricingTiers
      .map((t) => `${t.name} (starting at ${t.startingAt}): ${t.description}`)
      .join("; ")}. ${pricingDisclaimer}`,
  });

  chunks.push({
    id: "contact",
    source: "Contact",
    text: `To get in touch with ${profile.name}: email ${contact.email}${
      contact.githubUrl ? `, GitHub at ${contact.githubUrl}` : ""
    }${contact.linkedinUrl ? `, LinkedIn at ${contact.linkedinUrl}` : ""}.`,
  });

  return chunks;
}
