// Motion preference.
//
// The full animated experience is the default on every machine. The OS
// `prefers-reduced-motion` setting is deliberately NOT consulted: a large share
// of desktops (Windows in particular) report `reduce` without the owner ever
// asking for it, which used to blank the loader and every reveal on this site.
//
// Instead the visitor gets an explicit control (see components/MotionToggle),
// so the one group the animated default excludes has a way out. The choice is
// persisted and re-applied before first paint by the inline script in
// index.html, so a returning visitor never sees a frame of unwanted motion.

const KEY = "cv-motion";
const listeners = new Set();

/** True when the visitor has asked for reduced motion. */
export const isReduced = () =>
  typeof document !== "undefined" &&
  document.documentElement.dataset.motion === "reduced";

export function setReduced(reduced) {
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  try {
    localStorage.setItem(KEY, reduced ? "reduced" : "full");
  } catch {
    // private mode / storage disabled — the choice just won't persist
  }
  listeners.forEach((fn) => fn(reduced));
}

/** Subscribe to changes. Returns an unsubscribe function. */
export function onMotionChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
