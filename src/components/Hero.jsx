import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { profile } from "../data";
import { scrollTo } from "../lib/scroll";

export default function Hero({ ready }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el) return;

    const lines = el.querySelectorAll(".hero__title .line > span");
    const ins = el.querySelectorAll("[data-in]");

    // Before the loader hands over, keep the intro hidden (no flash).
    if (!ready) {
      gsap.set(lines, { yPercent: 115 });
      gsap.set(ins, { opacity: 0, y: 24 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(lines, {
      yPercent: 0,
      duration: 1.1,
      ease: "power4.out",
      stagger: 0.09,
    });
    tl.to(
      ins,
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 },
      "-=0.6",
    );
    return () => tl.kill();
  }, [ready]);

  return (
    <section className="hero" id="accueil" ref={rootRef}>
      <div className="hero__wrap">
        <div className="hero__topline" data-in>
          <span className="meta">Eliot Bedel — Portfolio ’26</span>
          <span className="meta">Nantes · France — Disponible</span>
        </div>

        <h1 className="hero__title">
          <span className="line">
            <span>Ingénieur</span>
          </span>
          <span className="line">
            <span>
              cyber<span className="thin">sécurité</span>
            </span>
          </span>
        </h1>

        <div className="hero__lower">
          <p className="hero__lead" data-in>
            J'extrais le <span className="serif">signal</span> du bruit — je
            traduis la complexité technique en risques métier actionnables, de
            l'offensive à la gouvernance.
          </p>
          <div className="hero__aside" data-in>
            <span className="meta">Champs d'expertise</span>
            <div className="hero__keywords">
              {profile.keywords.map((k) => (
                <span className="kw" key={k}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          className="hero__scroll"
          data-in
          onClick={() => scrollTo("#approche")}
          aria-label="Défiler vers l'approche"
        >
          <span className="line-y" />
          <span className="meta">Défiler</span>
        </button>
      </div>
    </section>
  );
}
