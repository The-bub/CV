import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { onMotionChange } from "../lib/motion";

// Distilled from the bio — his real arc: Red Team → management du risque.
const TOKENS = [
  "Pendant",
  "trois",
  "ans,",
  "j'ai",
  { t: "éprouvé", em: true },
  "les",
  "défenses",
  "de",
  "l'intérieur.",
  "Aujourd'hui,",
  "je",
  { t: "cartographie", em: true },
  "le",
  "risque,",
  "et",
  "je",
  "traduis",
  "la",
  "complexité",
  "technique",
  "en",
  { t: "décisions", em: true },
  { t: "métier.", em: true },
];

const STATS = [
  { k: "03", v: "ans en sécurité offensive" },
  { k: "360°", v: "vision du risque cyber" },
  { k: "RNCP 7", v: "Expert en sécurité digitale" },
];

export default function Manifesto() {
  const rootRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = rootRef.current;
    const words = textRef.current.querySelectorAll(".word");

    const ctx = gsap.context(() => {
      gsap.set(words, { opacity: 0.14 });
      gsap.to(words, {
        opacity: 1,
        ease: "none",
        stagger: 0.5,
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 75%",
          end: "bottom 65%",
          scrub: 0.6,
        },
      });

      gsap.from(el.querySelectorAll("[data-mi]"), {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 70%", once: true },
      });
    }, el);

    // The scrubbed words sit at opacity 0.14 until they are read through, so a
    // motion change has to release them — never freeze them half-dimmed, in
    // either direction. `ctx.revert()` alone does not undo a `gsap.set()`, so the
    // inline props are cleared explicitly: the words fall back to their CSS
    // state, fully legible, and the scrub is not re-armed.
    const offMotion = onMotionChange(() => {
      ctx.revert();
      gsap.set(words, { clearProps: "all" });
      gsap.set(el.querySelectorAll("[data-mi]"), { clearProps: "all" });
      ScrollTrigger.refresh();
    });

    return () => {
      offMotion();
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section
      className="section section--solid manifesto"
      id="approche"
      ref={rootRef}
    >
      <div className="wrap">
        <div className="manifesto__grid">
          <div className="manifesto__aside">
            <div className="block-label" data-mi>
              §01 · Approche
            </div>
            <p data-mi>
              Expertise offensive et approche stratégique de la protection des
              SI : analyses de risques, priorisation des vulnérabilités, conseil
              en conformité et maturité SSI.
            </p>
            <div className="manifesto__stats">
              {STATS.map((s) => (
                <div className="mstat" data-mi key={s.k}>
                  <b>{s.k}</b>
                  <span>{s.v}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="manifesto__text" ref={textRef}>
            {TOKENS.map((tok, i) => {
              const isEm = typeof tok === "object";
              const text = isEm ? tok.t : tok;
              return (
                <span className="word" key={i}>
                  {isEm ? <em>{text}</em> : text}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
