"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/icons";
import { contact } from "@/content/contact";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable — the visible email text is still a fallback.
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-4xl px-6 py-24 md:py-32">
      <Reveal>
        <p className="mb-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">Contact</p>
        <h2 className="text-balance font-display text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Let&rsquo;s build something.
        </h2>
        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-fg-muted">
          Have a project, a role, or a question about Khwarizmi Studio? Reach out — I read every
          message.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <a
            href={`mailto:${contact.email}`}
            className="focus-ring inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent-strong"
          >
            <Mail size={16} />
            {contact.email}
          </a>

          <button
            type="button"
            onClick={copyEmail}
            aria-label="Copy email address"
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-border px-4 py-3 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>

          {contact.githubUrl && (
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              <GithubIcon size={16} />
              GitHub
            </a>
          )}

          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-sm text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            >
              <LinkedinIcon size={16} />
              LinkedIn
            </a>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.25}>
        <p className="mt-16 border-t border-border pt-8 text-xs text-fg-subtle">
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, deployed on Azure.
        </p>
      </Reveal>
    </section>
  );
}
