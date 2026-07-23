import { lazy, Suspense, useEffect, useRef } from "react";
import photo from "../assets/eliot-bedel-2026-v2.jpg";
import { profile } from "../data";
import { HeroSceneFallback } from "../three/HeroSceneFallback";
import { gsap, registerGsap, SplitText, prefersReducedMotion, scrollToHash } from "../lib/gsapSetup";
import { useMagnetic } from "../lib/useMagnetic";

const InstrumentField = lazy(() => import("../three/InstrumentField"));

const STATS = [
  { value: 9, suffix: " ans", label: "IT & cybersécurité" },
  { value: 3, suffix: " ans", label: "Pilotage Red Team & pentest" },
  { value: 2, suffix: "e", label: "CTF NetWars London" },
];

export default function Hero({ ready }) {
  const nameRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const keywordsRef = useRef(null);
  const bioRef = useRef(null);
  const ctaRef = useRef(null);
  const photoRef = useRef(null);
  const statRefs = useRef([]);
  const primaryMagnetic = useMagnetic(0.25);
  const ghostMagnetic = useMagnetic(0.25);

  useEffect(() => {
    if (!ready) return undefined;
    registerGsap();

    const metaEls = [eyebrowRef.current, titleRef.current, keywordsRef.current, bioRef.current, ctaRef.current].filter(
      Boolean,
    );
    const statEls = statRefs.current.filter(Boolean);

    if (prefersReducedMotion()) {
      return undefined;
    }

    const lineInners = Array.from(nameRef.current.querySelectorAll(".split-line-inner"));
    const split = new SplitText(lineInners, { type: "chars", charsClass: "split-char" });

    statEls.forEach((el) => {
      const valueEl = el.querySelector("[data-stat-value]");
      const suffix = el.dataset.statSuffix ?? "";
      if (valueEl) valueEl.textContent = `0${suffix}`;
    });

    gsap.set(split.chars, { yPercent: 115, opacity: 0 });
    gsap.set(metaEls, { autoAlpha: 0, y: 18 });
    gsap.set(photoRef.current, { autoAlpha: 0, scale: 1.04 });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(split.chars, { yPercent: 0, opacity: 1, duration: 0.85, stagger: 0.02 })
      .to(metaEls, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 }, "-=0.45")
      .to(photoRef.current, { autoAlpha: 1, scale: 1, duration: 0.9 }, "-=0.55");

    statEls.forEach((el, i) => {
      const stat = STATS[i];
      const valueEl = el.querySelector("[data-stat-value]");
      if (!valueEl) return;
      const counter = { v: 0 };
      tl.to(
        counter,
        {
          v: stat.value,
          duration: 0.7,
          ease: "power1.out",
          onUpdate: () => {
            valueEl.textContent = `${Math.round(counter.v)}${stat.suffix}`;
          },
        },
        i === 0 ? "-=0.2" : "<0.06",
      );
    });

    return () => {
      tl.kill();
      split.revert();
    };
  }, [ready]);

  return (
    <section id="accueil" className="hero">
      <Suspense
        fallback={
          <div className="hero__scene">
            <HeroSceneFallback />
          </div>
        }
      >
        <InstrumentField />
      </Suspense>

      <div className="hero__grid">
        <div className="hero__content">
          <p className="hero__eyebrow" ref={eyebrowRef}>
            Dossier professionnel — 2026
          </p>
          <h1 className="hero__name" aria-label={profile.name} ref={nameRef}>
            <span aria-hidden="true">
              <span className="split-line">
                <span className="split-line-inner">Eliot</span>
              </span>
              <span className="split-line">
                <span className="split-line-inner">Bedel</span>
              </span>
            </span>
          </h1>
          <p className="hero__title" ref={titleRef}>
            {profile.title}
          </p>
          <p className="hero__keywords" ref={keywordsRef}>
            {profile.keywords.join(" · ")}
          </p>
          <p className="hero__bio" ref={bioRef}>
            {profile.bio}
          </p>
          <div className="hero__cta" ref={ctaRef}>
            <a
              href="#parcours"
              className="btn btn--primary cursor-target"
              ref={primaryMagnetic}
              onClick={(e) => scrollToHash(e, "#parcours")}
            >
              Voir le parcours
            </a>
            <a
              href="#contact"
              className="btn btn--ghost cursor-target"
              ref={ghostMagnetic}
              onClick={(e) => scrollToHash(e, "#contact")}
            >
              Me contacter
            </a>
          </div>

          <div className="hero__stats">
            {STATS.map((stat, i) => (
              <div
                className="hero__stat"
                key={stat.label}
                data-stat-suffix={stat.suffix}
                ref={(el) => {
                  statRefs.current[i] = el;
                }}
              >
                <span className="hero__stat-value">
                  <span data-stat-value>
                    {stat.value}
                    {stat.suffix}
                  </span>
                </span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__photo-panel" ref={photoRef}>
          <img className="hero__photo" src={photo} alt="Portrait d'Eliot Bedel" />
          <div className="hero__photo-grain" aria-hidden="true" />
          <div className="hero__photo-fade" aria-hidden="true" />
          <div className="hero__badge">
            <span className="hero__badge-label">Basé à</span>
            <span className="hero__badge-value">{profile.contact.address}</span>
          </div>
        </div>
      </div>

      <a
        className="hero__scroll cursor-target"
        href="#parcours"
        aria-label="Défiler vers le parcours"
        onClick={(e) => scrollToHash(e, "#parcours")}
      >
        <span />
      </a>
    </section>
  );
}
