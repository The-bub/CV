import { certifications, skills, hobbies } from "../data";
import { useReveal } from "../hooks/useReveal";

export default function Skills() {
  const ref = useReveal();
  return (
    <section id="competences" className="section" ref={ref}>
      <div className="section__inner">
        <p className="section__eyebrow" data-reveal>
          Compétences
        </p>
        <h2 className="section__title" data-reveal>
          Certifications &amp; compétences
        </h2>

        <h3 className="skills-subtitle" data-reveal>
          Certifications
        </h3>
        <div className="certs-grid">
          {certifications.map((cert) => (
            <article className="cert-card" data-reveal key={cert.name}>
              <span className="cert-card__org">{cert.org}</span>
              <h4 className="cert-card__name">{cert.name}</h4>
              <p className="cert-card__full">{cert.fullName}</p>
              <p className="cert-card__detail">{cert.detail}</p>
            </article>
          ))}
        </div>

        <h3 className="skills-subtitle" data-reveal>
          Compétences
        </h3>
        <div className="skills-grid">
          {skills.map((group, i) => (
            <article className="skill-card" data-reveal key={i}>
              <h3 className="skill-card__title">{group.category}</h3>
              <ul className="skill-card__list">
                {group.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="hobbies" data-reveal>
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
        </div>
      </div>
    </section>
  );
}
