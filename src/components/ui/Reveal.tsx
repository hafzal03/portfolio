"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { observeReveal } from "@/lib/reveal";

type RevealTag = "div" | "li" | "p" | "article" | "header" | "figure";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger in milliseconds. */
  delay?: number;
  as?: RevealTag;
  style?: CSSProperties;
}

/**
 * Surfaces its children as they drift into view — rising, un-blurring,
 * condensing out of the dream. All timing lives in CSS ([data-reveal] in
 * globals.css), so reduced-motion and no-JS both get plain, visible content.
 */
export function Reveal({ children, className, delay = 0, as = "div", style }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    return observeReveal(ref.current);
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=""
      className={className}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
