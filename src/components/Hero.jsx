import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { scrollTo } from "../lib/scroll";
import portrait from "../assets/eliot-bedel-2026-v2.jpg";

const CV_URL = "/eliot-bedel-cv.pdf";

const STATS = [
  { k: "9", v: "ans IT & cybersécurité" },
  { k: "3", v: "ans en sécurité offensive" },
  { k: "2×", v: "2ᵉ place en CTF" },
];

export default function Hero({ ready }) {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el) return;

    const lines = el.querySelectorAll(".hero__title .line > span");
    const ins = el.querySelectorAll("[data-in]");

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
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 },
      "-=0.6",
    );
    return () => tl.kill();
  }, [ready]);

  return (
    <section className="hero" id="accueil" ref={rootRef}>
      <div className="hero__wrap">
        <div className="hero__topline" data-in>
          <span className="meta">Eliot Bedel · Portfolio 2026</span>
          <span className="meta">Nantes, France · Disponible</span>
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
          <div className="hero__intro">
            <p className="hero__lead" data-in>
              J'extrais le <span className="serif">signal</span> du bruit. Je
              traduis la complexité technique en risques métier actionnables, de
              l'offensive à la gouvernance.
            </p>

            <div className="hero__foot">
              <dl className="hero__stats" data-in>
                {STATS.map((s) => (
                  <div className="hstat" key={s.k}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="hero__actions" data-in>
                <a className="btn btn--solid" href={CV_URL} download>
                  Télécharger le CV
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path
                      d="M6.5 1.5V9M6.5 9L3.5 6M6.5 9L9.5 6M2 11h9"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <span className="meta">PDF · optimisé ATS</span>
              </div>
            </div>
          </div>

          <figure className="hero__portrait" data-in>
            <img
              src={portrait}
              alt="Portrait d'Eliot Bedel"
              width="1448"
              height="1086"
            />
            <figcaption className="meta">Nantes (44)</figcaption>
          </figure>
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
