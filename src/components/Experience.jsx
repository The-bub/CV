import { experiences } from "../data";
import { useReveal } from "../hooks/useReveal";

export default function Experience() {
  const ref = useReveal();
  return (
    <section id="parcours" className="section" ref={ref}>
      <div className="section__inner">
        <p className="section__eyebrow" data-reveal>
          Parcours
        </p>
        <h2 className="section__title" data-reveal>
          Expériences professionnelles
        </h2>

        <div className="timeline">
          {experiences.map((exp, i) => (
            <article className="timeline__item" data-reveal key={i}>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
