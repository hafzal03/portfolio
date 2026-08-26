import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
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
 * that render the site. Add a project to content/projects.ts and it shows up
 * here automatically — nothing to keep in sync by hand.
 */
export function buildKnowledgeChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];

  chunks.push({
    id: "profile-summary",
    source: "About",
    text: `${profile.name} — ${profile.role}. ${profile.summary}`,
  });

  chunks.push({
    id: "profile-focus",
    source: "About",
    text: `${profile.name}'s focus areas: ${profile.focusAreas.join(", ")}. ${profile.educationNote}`,
  });

  for (const project of projects) {
    const body = project.longDescription.join(" ");
    chunks.push({
      id: `project-${project.slug}`,
      source: `Project: ${project.name}`,
      text: `Project: ${project.name} (${project.category}). ${project.tagline}. ${body} Technologies used: ${project.technologies.join(", ")}.${
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

  chunks.push({
    id: "courses",
    source: "Courses & Learning",
    text:
      courses.length > 0
        ? courses
            .map(
              (c) =>
                `Course: ${c.name} by ${c.provider}${c.date ? ` (${c.date})` : ""}. Topics: ${c.topics.join(", ")}.`
            )
            .join(" ")
        : `Course and certification history: ${coursesPlaceholder}`,
  });

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
