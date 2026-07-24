import { education } from "../data";
import Reveal from "./Reveal";

export default function Education() {
  return (
    <section id="formation" className="section section--alt">
      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Formation
        </Reveal>
        <Reveal as="h2" className="section__title">
          Un parcours par alternance
        </Reveal>

        <div className="edu-grid">
          {education.map((ed, i) => (
            <Reveal as="article" className="edu-card" key={i}>
              <span className="edu-card__period">{ed.period}</span>
              <h3 className="edu-card__title">{ed.title}</h3>
              <p className="edu-card__school">{ed.school}</p>
              {ed.detail && <p className="edu-card__detail">{ed.detail}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
