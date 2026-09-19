import { Fragment, type CSSProperties } from "react";

interface MeltTextProps {
  text: string;
  className?: string;
  /** Letters bob independently, as if weightless. */
  levitate?: boolean;
  /** Letters rise out of the sea on first paint (hero only). */
  rise?: boolean;
  /** Offset for the per-letter stagger when several MeltTexts form one line. */
  startIndex?: number;
  /**
   * Hex colours to spread across the letters, first letter to last. Done per
   * letter rather than with background-clip:text, which drops text that sits
   * on its own compositing layer — and every animated letter here does.
   */
  palette?: string[];
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function colourAt(palette: string[], t: number) {
  if (palette.length === 1) return palette[0];
  const x = Math.min(1, Math.max(0, t)) * (palette.length - 1);
  const i = Math.min(Math.floor(x), palette.length - 2);
  const f = x - i;
  const a = hexToRgb(palette[i]);
  const b = hexToRgb(palette[i + 1]);
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(" ")})`;
}

/**
 * Splits text into letters so each can soften, slump and drift on its own.
 *
 * The letters are aria-hidden, so screen readers never spell a word out one
 * character at a time — the enclosing heading or link must carry the text as
 * its aria-label instead. There is deliberately no visually-hidden duplicate:
 * crawlers read DOM text, and a second copy would index the name twice
 * ("HafzalHafzal"). Words are kept unbreakable so a line never wraps mid-word.
 *
 * The melt itself is pure CSS (.melt-char in globals.css) and is triggered by
 * hovering the nearest `.melt` or `.melt-group` ancestor.
 */
export function MeltText({ text, className, levitate, rise, startIndex = 0, palette }: MeltTextProps) {
  let index = startIndex;
  let letter = 0;
  const letters = text.replace(/ /g, "").length;
  const words = text.split(" ");

  return (
    <span className={className} aria-hidden>
      <span>
        {words.map((word, w) => (
          <Fragment key={w}>
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char, c) => {
                const i = index++;
                const style = { "--i": i } as CSSProperties;
                const colour = palette ? colourAt(palette, letters > 1 ? letter / (letters - 1) : 0) : undefined;
                letter++;
                const melt = (
                  <span className="melt-char" style={colour ? { ...style, color: colour } : style}>
                    {char}
                  </span>
                );
                const floated = levitate ? (
                  <span className="levitate-char" style={style}>
                    {melt}
                  </span>
                ) : (
                  melt
                );
                return rise ? (
                  <span key={c} className="rise-char" style={style}>
                    {floated}
                  </span>
                ) : (
                  <Fragment key={c}>{floated}</Fragment>
                );
              })}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
