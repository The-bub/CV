// Motion preference.
//
// The full animated experience is the default on every machine. The OS
// `prefers-reduced-motion` setting is deliberately NOT consulted: a large share
// of desktops (Windows in particular) report `reduce` without the owner ever
// asking for it, which used to blank the loader and every reveal on this site.
//
// The visitor-facing toggle that used to drive this was removed on request, so
// `data-motion` is now always "full" and `isReduced()` always false. The
// plumbing is kept because Field, Reveal, SmoothScroll and Manifesto all branch
// on it: setting `data-motion="reduced"` on <html> still calms the whole site,
// which is the hook to reach for if a control is ever wanted back.

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
