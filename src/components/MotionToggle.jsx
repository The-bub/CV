import { useEffect, useState } from "react";
import { isReduced, setReduced } from "../lib/motion";

/**
 * Lets the visitor stop the animated field, the smooth scroll and the
 * scroll-scrubbed reveals. The icon is the concept: a live signal that flattens
 * to a straight line. See lib/motion.js for why this is a control rather than
 * an OS media query.
 */
export default function MotionToggle() {
  const [reduced, setLocal] = useState(false);

  // The pre-paint script in index.html has already set data-motion; mirror it
  // into state after mount so the markup React renders on the server-ish first
  // pass and the DOM never disagree.
  useEffect(() => setLocal(isReduced()), []);

  const toggle = () => {
    const next = !reduced;
    setLocal(next);
    setReduced(next);
  };

  return (
    <button
      type="button"
      className="motion-toggle controls__pill"
      onClick={toggle}
      aria-pressed={reduced}
      aria-label="Réduire les animations"
      title={
        reduced ? "Réactiver les animations" : "Réduire les animations"
      }
    >
      <svg width="24" height="12" viewBox="0 0 24 12" aria-hidden="true">
        <path
          className="motion-toggle__wave"
          d="M1 6c2.6-5.2 5.1-5.2 7.7 0s5.1 5.2 7.7 0 4.5-3 6.6-1.2"
        />
        <path className="motion-toggle__flat" d="M1 6h22" />
      </svg>
      <span className="controls__label">Animations</span>
    </button>
  );
}
