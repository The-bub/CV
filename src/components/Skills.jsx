import { certifications, skills, hobbies } from "../data";
import Reveal from "./Reveal";
import GsapReveal from "./GsapReveal";
import BorderGlow from "./BorderGlow";
import { onSpotlightMove } from "../lib/spotlight";

const NEUTRAL_GLOW = {
  glowColor: "236 233 228",
  colors: ["#ece9e4", "#c8c4bc", "#8d8a84"],
};

const SIGNAL_GLOW = {
  glowColor: "207 90 63",
  colors: ["#cf5a3f", "#e2755a", "#8d8a84"],
};

export default function Skills() {
  return (
    <section id="competences" className="section">
      <div className="section__inner">
        <Reveal as="p" className="section__eyebrow">
          Compétences
        </Reveal>
        <h2 className="section__title">
          <GsapReveal>Certifications &amp; compétences</GsapReveal>
        </h2>

        <Reveal as="h3" className="skills-subtitle">
          Certifications
        </Reveal>
        <div className="certs-grid">
          {certifications.map((cert) => {
            const glow = cert.status ? SIGNAL_GLOW : NEUTRAL_GLOW;
            return (
              <Reveal className="cert-card-wrap" key={cert.name}>
                <BorderGlow
                  className="cert-card"
                  borderRadius={0}
                  backgroundColor="var(--cert-card-bg)"
                  glowColor={glow.glowColor}
                  glowRadius={26}
                  glowIntensity={1.4}
                  edgeSensitivity={50}
                  coneSpread={40}
                  colors={glow.colors}
                >
                  <div className="cert-card__top">
                    <span className="cert-card__org">{cert.org}</span>
                    {cert.status && (
                      <span className="cert-card__status">{cert.status}</span>
                    )}
                  </div>
                  <h4 className="cert-card__name">{cert.name}</h4>
                  <p className="cert-card__full">{cert.fullName}</p>
                  <p className="cert-card__detail">{cert.detail}</p>
                </BorderGlow>
              </Reveal>
            );
          })}
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
