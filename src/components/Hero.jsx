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
        <p className="hero__keywords">{profile.keywords.join(" · ")}</p>
        <p className="hero__bio">{profile.bio}</p>
        <div className="hero__cta">
          <a href="#parcours" className="btn btn--primary">
            Voir le parcours
          </a>
          <a href="#contact" className="btn btn--ghost">
            Me contacter
          </a>
        </div>
      </div>
      <a className="hero__scroll" href="#parcours" aria-label="Défiler vers le parcours">
        <span />
      </a>
    </section>
  );
}
