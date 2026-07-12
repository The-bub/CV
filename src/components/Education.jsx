import { education } from "../data";
import { useReveal } from "../hooks/useReveal";

export default function Education() {
  const ref = useReveal();
  return (
    <section id="formation" className="section section--alt" ref={ref}>
      <div className="section__inner">
        <p className="section__eyebrow" data-reveal>
          Formation
        </p>
        <h2 className="section__title" data-reveal>
          Un parcours par alternance
        </h2>

        <div className="edu-grid">
          {education.map((ed, i) => (
            <article className="edu-card" data-reveal key={i}>
              <span className="edu-card__period">{ed.period}</span>
              <h3 className="edu-card__title">{ed.title}</h3>
              <p className="edu-card__school">{ed.school}</p>
              {ed.detail && <p className="edu-card__detail">{ed.detail}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
