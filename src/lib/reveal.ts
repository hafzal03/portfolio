// One shared scroll watcher for every [data-reveal] element on the page.
//
// Deliberately not IntersectionObserver (nor framer-motion's whileInView,
// which is built on it): IO silently stops firing in contexts that aren't
// compositing — background tabs, some embedded webviews, headless browsers —
// and a reveal that never fires means content that never appears. A
// throttled scroll check can't get stuck like that.
//
// Progressive enhancement: until this module runs, nothing is hidden (see
// the .reveal-on rules in globals.css). Anything already on screen when it
// registers is marked revealed synchronously, so it never flickers out.

const pending = new Set<HTMLElement>();
let started = false;
let frame = 0;
let fallback = 0;

function inView(el: HTMLElement) {
  return el.getBoundingClientRect().top < window.innerHeight * 0.9;
}

function check() {
  if (frame) cancelAnimationFrame(frame);
  if (fallback) window.clearTimeout(fallback);
  frame = 0;
  fallback = 0;
  for (const el of pending) {
    if (inView(el)) {
      el.dataset.revealed = "true";
      pending.delete(el);
    }
  }
}

function schedule() {
  if (document.visibilityState === "hidden") {
    check();
    return;
  }
  if (frame) return;
  frame = requestAnimationFrame(check);
  // Belt and braces for environments that throttle rAF to nothing.
  fallback = window.setTimeout(check, 250);
}

function start() {
  if (started) return;
  started = true;
  document.documentElement.classList.add("reveal-on");
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener("hashchange", schedule);
  // A page opened in a background tab (e.g. hafzal.dev/#projects via
  // middle-click) can be scrolled to its anchor while hidden, when no scroll
  // events fire — re-check the moment it's shown, loaded or restored.
  document.addEventListener("visibilitychange", schedule);
  window.addEventListener("load", schedule);
  window.addEventListener("pageshow", schedule);
}

/** Registers an element; returns a cleanup that unregisters it. */
export function observeReveal(el: HTMLElement): () => void {
  if (inView(el)) {
    el.dataset.revealed = "true";
  } else {
    pending.add(el);
  }
  start();
  schedule();
  return () => {
    pending.delete(el);
  };
}
