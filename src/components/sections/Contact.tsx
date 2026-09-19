import { ArrowUpRight, Sparkles } from "lucide-react";
import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { ChapterHeading } from "@/components/ui/ChapterHeading";
import { Reveal } from "@/components/ui/Reveal";
import { MeltText } from "@/components/ui/MeltText";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { AskAIButton } from "@/components/chatbot/AskAIButton";
import { Mark } from "@/components/brand/Mark";
import { CopyEmail } from "./CopyEmail";

/** Contact — the sky behind this section is the dawn at the end of the scroll. */
export function Contact() {
  const [user, domain] = contact.email.split("@");

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      tabIndex={-1}
      className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col px-6 pt-28 outline-none md:pt-40"
    >
      <ChapterHeading
        id="contact"
        description="Looking for a website, an AI integration, or a chatbot grounded in your own content? I'd be glad to hear about your project."
      />

      <Reveal>
        <a
          href={`mailto:${contact.email}`}
          aria-label={`Email ${contact.email}`}
          className="focus-ring melt group block w-fit max-w-full rounded-2xl"
        >
          <span className="eyebrow">Email</span>
          <span className="mt-3 block font-display text-[clamp(1.9rem,6.4vw,5.5rem)] leading-[1] font-light tracking-[-0.02em] break-words text-ink transition-colors duration-500 group-hover:text-dawn-strong">
            <MeltText text={user} />
            <span className="text-rose italic">@</span>
            <wbr />
            <MeltText text={domain} startIndex={user.length + 1} />
          </span>
        </a>
      </Reveal>

      <Reveal delay={120}>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <CopyEmail email={contact.email} />
          <a
            href={contact.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring group inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-night-1/50 px-4 text-sm text-ink transition-colors hover:border-dawn/60"
          >
            <GithubIcon size={15} />
            GitHub
            <ArrowUpRight size={14} aria-hidden className="text-ink-subtle transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring group inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-night-1/50 px-4 text-sm text-ink transition-colors hover:border-dawn/60"
            >
              <LinkedinIcon size={15} />
              LinkedIn
              <ArrowUpRight size={14} aria-hidden className="text-ink-subtle" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
          <AskAIButton className="focus-ring group inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-dawn to-rose px-5 text-sm font-medium text-night-0 transition-[filter] hover:brightness-110">
            <Sparkles size={15} aria-hidden className="transition-transform duration-500 group-hover:rotate-45" />
            Or ask Hafzal AI
          </AskAIButton>
        </div>
      </Reveal>

      <footer className="mt-auto flex flex-col gap-6 border-t border-line pt-8 pb-28 text-sm text-ink-subtle sm:flex-row sm:items-center sm:justify-between sm:pb-10">
        <p className="flex items-center gap-3">
          <Mark size={22} />
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
        </p>
        <a href="#home" className="focus-ring group inline-flex min-h-11 items-center gap-2 rounded transition-colors hover:text-ink">
          Back to top
          <span aria-hidden className="transition-transform duration-500 group-hover:-translate-y-1">↑</span>
        </a>
      </footer>
    </section>
  );
}
