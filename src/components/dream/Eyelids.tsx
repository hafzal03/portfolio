/**
 * The opening moment: two lids part — a flicker, a blink, then wide open —
 * onto the sky. Pure CSS (.eyelids in globals.css): it never blocks input,
 * is skipped with reduced motion, and plays once per browser session (the
 * inline script in layout.tsx marks <html> as .eyes-open on later loads).
 */
export function Eyelids() {
  return (
    <div aria-hidden className="eyelids">
      <div className="lid lid-top" />
      <div className="lid lid-bottom" />
    </div>
  );
}

/** Runs before first paint, so a repeat visit in the same session never flashes the lids. */
export const EYELIDS_SCRIPT = `try{var k="somnium-eyes-open";if(sessionStorage.getItem(k)){document.documentElement.classList.add("eyes-open")}else{sessionStorage.setItem(k,"1")}}catch(e){}`;
