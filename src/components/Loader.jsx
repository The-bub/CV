import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

const NAME = "ELIOT BEDEL";
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\#%<>*·";
const PHRASES = [
  "Calibration du champ",
  "Triangulation des expositions",
  "Extraction du signal",
  "Cartographie des risques",
];

export default function Loader({ onComplete, revealRef }) {
  const rootRef = useRef(null);
  const centerRef = useRef(null);
  const countRef = useRef(null);
  const barRef = useRef(null);
  const nameRef = useRef(null);
  const phraseRef = useRef(null);
  const startedRef = useRef(false);

  useLayoutEffect(() => {
    // Run exactly once — survives React StrictMode's double-mount without a
    // cleanup that would kill the (single) intro timeline mid-flight.
    if (startedRef.current) return;
    startedRef.current = true;

    const root = rootRef.current;
    const chars = nameRef.current
      ? Array.from(nameRef.current.querySelectorAll("span"))
      : [];

    const finish = () => {
      document.body.classList.remove("is-loading");
      onComplete?.();
    };

    const setReveal = (v) => {
      if (revealRef) revealRef.current = v;
    };

    // Reduced motion: no theatrics — settle the field and reveal immediately.
    if (prefersReducedMotion()) {
      chars.forEach((s, i) => (s.textContent = NAME[i]));
      if (countRef.current) countRef.current.textContent = "100";
      setReveal(1);
      requestAnimationFrame(finish);
      return;
    }

    const state = { v: 0 };
    let phraseIndex = -1;

    const tl = gsap.timeline({ onComplete: finish });

    // Counter + name resolving from noise + progress bar, all driven together.
    tl.to(state, {
      v: 100,
      duration: 2.4,
      ease: "power2.inOut",
      onUpdate: () => {
        const p = state.v / 100;
        if (countRef.current)
          countRef.current.textContent = String(Math.round(state.v)).padStart(
            3,
            "0",
          );
        if (barRef.current) barRef.current.style.width = `${state.v}%`;

        const lock = Math.floor(p * NAME.length);
        chars.forEach((s, i) => {
          if (NAME[i] === " ") s.textContent = " ";
          else if (i < lock || p >= 1) {
            s.textContent = NAME[i];
            s.style.color = "var(--bone)";
          } else {
            s.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
            s.style.color = "var(--bone-3)";
          }
        });

        const idx = Math.min(PHRASES.length - 1, Math.floor(p * PHRASES.length));
        if (idx !== phraseIndex && phraseRef.current) {
          phraseIndex = idx;
          gsap.fromTo(
            phraseRef.current,
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          );
          phraseRef.current.firstChild.textContent = PHRASES[idx];
        }
      },
    });

    // Hand-off: settle the field while the curtain lifts.
    tl.addLabel("out", ">-0.1");
    tl.to(
      centerRef.current,
      { yPercent: -12, opacity: 0, duration: 0.6, ease: "power3.in" },
      "out",
    );
    tl.to(
      state,
      {
        duration: 1.5,
        ease: "power2.out",
        onStart: () => {},
        onUpdate: function () {
          setReveal(this.progress());
        },
      },
      "out",
    );
    tl.to(
      root,
      { yPercent: -100, duration: 1.1, ease: "power4.inOut" },
      "out+=0.25",
    );
    tl.set(root, { display: "none" });
    // No cleanup: the run-once guard keeps this the only timeline, and the
    // loader never truly unmounts (it ends at display:none).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="loader" ref={rootRef}>
      <div className="loader__center" ref={centerRef}>
        <div className="loader__eyebrow">
          <span>Cartographie du risque · Portfolio 2026</span>
        </div>
        <div className="loader__word" ref={nameRef} aria-label={NAME}>
          {NAME.split("").map((c, i) => (
            <span key={i}>{c === " " ? " " : c}</span>
          ))}
        </div>
        <div className="loader__tagline" ref={phraseRef}>
          <span>Calibration du champ</span>
          <span className="loader__caret"> ▍</span>
        </div>
      </div>

      <div className="loader__foot">
        <div className="loader__count">
          <span ref={countRef}>000</span>
          <sup>%</sup>
        </div>
        <div className="loader__meta meta">
          Nantes, France
          <br />
          47.2184° N / 1.5536° W
        </div>
        <div className="loader__bar">
          <i ref={barRef} />
        </div>
      </div>
    </div>
  );
}
