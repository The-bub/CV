import { certifications, skills, hobbies } from "../data";
import Reveal from "./Reveal";
import { onSpotlightMove } from "../lib/spotlight";

export default function Skills() {
  return (
    <section id="competences" className="section">
      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Compétences
        </Reveal>
        <Reveal as="h2" className="section__title">
          Certifications &amp; compétences
        </Reveal>

        <Reveal as="h3" className="skills-subtitle">
          Certifications
        </Reveal>
        <div className="certs-grid">
          {certifications.map((cert) => (
            <Reveal as="article" className="cert-card" key={cert.name} onMouseMove={onSpotlightMove}>
              <span className="card-spotlight" aria-hidden="true" />
              <span className="cert-card__org">{cert.org}</span>
              {cert.status && (
                <span className="cert-card__status">{cert.status}</span>
              )}
              <h4 className="cert-card__name">{cert.name}</h4>
              <p className="cert-card__full">{cert.fullName}</p>
              <p className="cert-card__detail">{cert.detail}</p>
            </Reveal>
          ))}
        </div>

        <Reveal as="h3" className="skills-subtitle">
          Compétences
        </Reveal>
        <div className="skills-grid">
          {skills.map((group, i) => (
            <Reveal as="article" className="skill-card" key={i} onMouseMove={onSpotlightMove}>
              <span className="card-spotlight" aria-hidden="true" />
              <h4 className="skill-card__title">{group.category}</h4>
              <ul className="skill-card__list">
                {group.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal as="div" className="hobbies">
          <h3 className="hobbies__title">Centres d'intérêt</h3>
          <div className="hobbies__row">
            <span className="tag">{hobbies.tech}</span>
            {hobbies.ctf.map((c) => (
              <span className="tag" key={c}>
                CTF · {c}
              </span>
            ))}
            {hobbies.other.map((o) => (
              <span className="tag" key={o}>
                {o}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
