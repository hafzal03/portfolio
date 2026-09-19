"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

interface DialogOptions {
  /** Keep Tab/Shift+Tab inside the container (true for modal dialogs). */
  trapFocus?: boolean;
  /** Stop the page behind from scrolling. */
  lockScroll?: boolean;
  /** Element to focus on open; defaults to the first focusable element. */
  initialFocus?: RefObject<HTMLElement | null>;
}

/**
 * Shared behaviour for every overlay on the site — the dream menu, the
 * project detail view and the chat panel: Escape closes, focus moves in on
 * open and returns to whatever opened it on close, and (for modal ones)
 * Tab can't wander into the page underneath.
 */
export function useDialog(
  open: boolean,
  onClose: () => void,
  containerRef: RefObject<HTMLElement | null>,
  { trapFocus = true, lockScroll = true, initialFocus }: DialogOptions = {}
) {
  // Callers usually pass an inline arrow; keep the latest without re-running
  // the effect (which would yank focus back to the first element).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    const opener = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
        (el) => el.getClientRects().length > 0
      );

    (initialFocus?.current ?? focusables()[0])?.focus({ preventScroll: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !trapFocus) return;
      const list = focusables();
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !container?.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    if (lockScroll) {
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      if (lockScroll) {
        body.style.overflow = prevOverflow;
        body.style.paddingRight = prevPadding;
      }
      // Hand focus back to the opener — unless something (e.g. jumping to a
      // chapter) has already, deliberately, put it somewhere else.
      const current = document.activeElement;
      const focusLeftBehind =
        !current || current === document.body || (container?.contains(current) ?? false);
      if (focusLeftBehind && opener && document.contains(opener)) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [open, containerRef, trapFocus, lockScroll, initialFocus]);
}

/** Scrolls to a chapter and hands keyboard focus to it. */
export function goToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  el.focus({ preventScroll: true });
  history.replaceState(null, "", `#${id}`);
}
