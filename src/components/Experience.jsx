import { experiences } from "../data";
import Reveal from "./Reveal";
import BlurText from "./BlurText";

export default function Experience() {
  return (
    <section id="parcours" className="section">
      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Parcours
        </Reveal>
        <h2 className="section__title">
          <BlurText text="Expériences professionnelles" as="span" delay={30} />
        </h2>

        <div className="dossier">
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
