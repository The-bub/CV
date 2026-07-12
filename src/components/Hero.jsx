import photo from "../assets/eliot-bedel.jpg";
import { profile } from "../data";

export default function Hero() {
  return (
    <section id="accueil" className="hero">
      <div className="hero__inner">
        <div className="hero__photo-wrap">
          <img className="hero__photo" src={photo} alt="Portrait d'Eliot Bedel" />
        </div>
        <h1 className="hero__name">{profile.name}</h1>
        <p className="hero__title">{profile.title}</p>
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
