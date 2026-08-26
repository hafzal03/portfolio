import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 max-w-2xl md:mb-16">
      <p className="mb-3 font-mono text-xs tracking-[0.2em] text-accent uppercase">{eyebrow}</p>
      <h2 className="text-balance font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-balance text-base leading-relaxed text-fg-muted">{description}</p>
      )}
    </Reveal>
  );
}
