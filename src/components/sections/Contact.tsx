import { ArrowUpRight, Mail } from "lucide-react";
import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { SectionShell } from "@/components/system/SectionShell";
import { PowerDown } from "@/components/system/PowerDown";
import { CopyEmail } from "./CopyEmail";
import { Reveal } from "@/components/ui/Reveal";
// lucide-react dropped its brand glyphs; the project carries its own.
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";

/**
 * The end of the sequence. Everything that moved earlier is still now; what
 * is left is the name, what he does, and every real way to reach him.
 *
 * Empty contact routes are omitted rather than rendered as dead links.
 */
export function Contact() {
  const routes = [
    {
      id: "email",
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
      Icon: Mail,
    },
    {
      id: "github",
      label: "GitHub",
      value: contact.githubUrl.replace(/^https?:\/\//, ""),
      href: contact.githubUrl,
      Icon: GithubIcon,
    },
    contact.linkedinUrl
      ? {
          id: "linkedin",
          label: "LinkedIn",
          value: contact.linkedinUrl.replace(/^https?:\/\//, ""),
          href: contact.linkedinUrl,
          Icon: LinkedinIcon,
        }
      : null,
  ].filter((r): r is NonNullable<typeof r> => r !== null);

  return (
    <SectionShell id="contact">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-20">
        <Reveal>
          <div>
            <div className="mb-8">
              <PowerDown />
            </div>
            <p className="font-sans text-2xl font-semibold tracking-[-0.025em] text-ink sm:text-3xl">
              {profile.name}
            </p>
            <p className="readout mt-4 text-dawn">{profile.role}</p>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ink-muted">
              Open to AI engineering and software work — building systems, integrating models, or
              taking something from an idea to something running in production.
            </p>
            <div className="mt-8">
              <CopyEmail email={contact.email} />
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {routes.map(({ id, label, value, href, Icon }) => (
              <li key={id}>
                <a
                  href={href}
                  {...(id === "email" ? {} : { target: "_blank", rel: "noreferrer noopener" })}
                  className="focus-ring group flex items-center gap-5 rounded py-5 transition-colors"
                >
                  <span aria-hidden className="shrink-0 text-ink-subtle transition-colors group-hover:text-dawn">
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="readout block text-ink-subtle">{label}</span>
                    <span className="mt-1 block truncate text-[15px] text-ink-muted transition-colors group-hover:text-ink">
                      {value}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="shrink-0 text-ink-subtle transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-dawn"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal delay={240}>
        <footer className="mt-24 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-8">
          <p className="readout text-ink-subtle">
            © {new Date().getFullYear()} {profile.name}
          </p>
          <a
            href="#home"
            className="focus-ring readout rounded py-2 text-ink-subtle transition-colors hover:text-dawn"
          >
            Back to top
          </a>
        </footer>
      </Reveal>
    </SectionShell>
  );
}
