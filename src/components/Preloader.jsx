import { useEffect, useRef } from "react";
import { gsap, registerGsap, prefersReducedMotion } from "../lib/gsapSetup";

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null);
  const markRef = useRef(null);
  const barFillRef = useRef(null);
  const countRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    registerGsap();
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onComplete?.();
    };

    if (prefersReducedMotion()) {
      gsap.set(rootRef.current, { display: "none" });
      finish();
      return undefined;
    }

    const setVisual = (value) => {
      if (countRef.current) {
        countRef.current.textContent = String(Math.round(value)).padStart(3, "0");
      }
      if (barFillRef.current) {
        gsap.set(barFillRef.current, { scaleX: value / 100 });
      }
    };

    const counter = { value: 0 };
    const countTween = gsap.to(counter, {
      value: 92,
      duration: 1.7,
      ease: "power1.out",
      onUpdate: () => setVisual(counter.value),
    });

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    const minDelay = new Promise((resolve) => setTimeout(resolve, 850));
    let cancelled = false;

    Promise.all([fontsReady, minDelay]).then(() => {
      if (cancelled) return;
      countTween.kill();

      gsap
        .timeline({ onComplete: finish })
        .to(counter, {
          value: 100,
          duration: 0.35,
          ease: "power2.out",
          onUpdate: () => setVisual(counter.value),
        })
        .to(
          [markRef.current, barFillRef.current?.parentElement, countRef.current],
          { autoAlpha: 0, duration: 0.3, ease: "power1.out" },
          "+=0.15",
        )
        .to(
          rootRef.current,
          { scaleY: 0, duration: 0.85, ease: "power4.inOut" },
          "-=0.05",
        )
        .set(rootRef.current, { display: "none" });
    });

    return () => {
      cancelled = true;
      countTween.kill();
    };
  }, [onComplete]);

  return (
    <div className="preloader" ref={rootRef} aria-hidden="true">
      <p className="preloader__mark" ref={markRef}>
        Étalonnage
      </p>
      <div className="preloader__bar">
        <div className="preloader__bar-fill" ref={barFillRef} />
      </div>
      <p className="preloader__count" ref={countRef}>
        000
      </p>
    </div>
  );
}
