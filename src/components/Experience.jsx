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

        <div className="timeline">
          {experiences.map((exp, i) => (
            <Reveal as="article" className="timeline__item" key={i}>
              <div className="timeline__marker" />
              <div className="timeline__content">
                <span className="timeline__period">{exp.period}</span>
                <h3 className="timeline__role">{exp.role}</h3>
                <p className="timeline__company">{exp.company}</p>
                <ul className="timeline__list">
                  {exp.items.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
