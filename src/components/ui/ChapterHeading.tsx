import { CHAPTER_BY_ID, type SectionId } from "@/lib/sections";
import { Reveal } from "./Reveal";
import { MeltText } from "./MeltText";

// Tangerine → magenta → ultraviolet: the dusk sky, top to bottom, reversed.
const ACCENT_GRADIENT = ["#ffa866", "#ff7ab8", "#b69cff"];

interface ChapterHeadingProps {
  id: SectionId;
  description?: string;
}

/**
 * "III — Projects" over a large dream-register title. The plain label is
 * always shown, so the poetry never costs anyone the ability to tell what a
 * section actually is. The title's last word is set in italic, coloured
 * letter by letter in the sky's gradient.
 */
export function ChapterHeading({ id, description }: ChapterHeadingProps) {
  const chapter = CHAPTER_BY_ID[id];
  const words = chapter.title.split(" ");
  const lead = words.slice(0, -1).join(" ");
  const last = words[words.length - 1];

  return (
    <header className="mb-14 max-w-4xl md:mb-20">
      <Reveal>
        <p className="eyebrow flex items-center gap-3">
          <span className="text-dawn">{chapter.numeral}</span>
          <span aria-hidden className="h-px w-10 bg-line-strong" />
          <span>{chapter.label}</span>
        </p>
      </Reveal>
      <Reveal delay={90}>
        <h2
          id={`${id}-title`}
          aria-label={chapter.title}
          className="melt mt-5 font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] font-light tracking-[-0.02em] text-balance text-ink"
        >
          {lead && (
            <>
              <MeltText text={lead} />{" "}
            </>
          )}
          <MeltText
            text={last}
            startIndex={lead.length + 1}
            palette={ACCENT_GRADIENT}
            className="font-normal italic"
          />
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={180}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-ink-muted">
            {description}
          </p>
        </Reveal>
      )}
    </header>
  );
}
