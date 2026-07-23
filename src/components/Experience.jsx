import { useEffect, useRef } from "react";
import { experiences } from "../data";
import Reveal from "./Reveal";
import GsapReveal from "./GsapReveal";
import { gsap, registerGsap, ScrollTrigger } from "../lib/gsapSetup";

export default function Experience() {
  const dossierRef = useRef(null);
  const railFillRef = useRef(null);

  useEffect(() => {
    registerGsap();
    const dossier = dossierRef.current;
    const fill = railFillRef.current;
    if (!dossier || !fill) return undefined;

    const trigger = ScrollTrigger.create({
      trigger: dossier,
      start: "top 60%",
      end: "bottom 60%",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(fill, { scaleY: self.progress });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section id="parcours" className="section">
      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Parcours
        </Reveal>
        <h2 className="section__title">
          <GsapReveal>Expériences professionnelles</GsapReveal>
        </h2>

        <div className="dossier" ref={dossierRef}>
          <div className="dossier__rail" aria-hidden="true">
            <div className="dossier__rail-fill" ref={railFillRef} />
          </div>
          {experiences.map((exp, i) => {
            const isCurrent = exp.period.toLowerCase().startsWith("depuis");
            return (
              <Reveal as="article" className="dossier__item" key={i}>
                <span className="dossier__index">{String(i + 1).padStart(2, "0")}</span>
                <div className="dossier__body">
                  <div className="dossier__head">
                    <h3 className="dossier__role">{exp.role}</h3>
                    <span
                      className={`dossier__period ${isCurrent ? "dossier__period--current" : ""}`}
                    >
                      {exp.period}
                    </span>
                  </div>
                  <p className="dossier__company">{exp.company}</p>
                  <ul className="dossier__list">
                    {exp.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
