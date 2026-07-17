import photo from "../assets/eliot-bedel.jpg";
import { profile } from "../data";
import BlurText from "./BlurText";

export default function Hero() {
  return (
    <section id="accueil" className="hero">
      <div className="hero__inner">
        <div className="hero__photo-wrap">
          <img className="hero__photo" src={photo} alt="Portrait d'Eliot Bedel" />
        </div>
        <h1 className="hero__name">
          <BlurText text={profile.name} as="span" />
        </h1>
        <p className="hero__title">
          <BlurText text={profile.title} as="span" delay={40} startDelay={450} />
        </p>
        <div className="hero__keywords">
          {profile.keywords.map((keyword) => (
            <span className="tag tag--accent" key={keyword}>
              {keyword}
            </span>
          ))}
        </div>
        <p className="hero__bio">{profile.bio}</p>
        <div className="hero__cta">
          <a href="#parcours" className="btn btn--primary">
            Voir le parcours
          </a>
          <a href="#contact" className="btn btn--ghost">
            Me contacter
          </a>
        </div>
        <a href="/eliot-bedel-cv.pdf" className="hero__pdf-link" download>
          <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true">
            <path
              fill="currentColor"
              d="M10 2a1 1 0 0 1 1 1v7.586l2.293-2.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 1 1 1.414-1.414L9 10.586V3a1 1 0 0 1 1-1Z"
            />
            <path
              fill="currentColor"
              d="M4 14a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z"
            />
          </svg>
          Télécharger le CV (PDF)
        </a>
      </div>
      <a className="hero__scroll" href="#parcours" aria-label="Défiler vers le parcours">
        <span />
      </a>
    </section>
  );
}
