import photo from "../assets/eliot-bedel-2026.jpg";
import { profile } from "../data";
import BlurText from "./BlurText";
import GlareHover from "./GlareHover";

export default function Hero() {
  return (
    <section id="accueil" className="hero">
      <svg className="hero__decor" viewBox="0 0 1200 800" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-50 620 C 250 520, 450 720, 750 560 S 1150 480, 1260 600" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M-50 700 C 300 640, 500 800, 820 660 S 1200 600, 1300 700" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M900 -40 C 980 120, 860 220, 1000 340" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      <div className="hero__grid">
        <div className="hero__content">
          <p className="hero__eyebrow">Dossier professionnel — 2026</p>
          <h1 className="hero__name" aria-label="Eliot Bedel">
            <span aria-hidden="true">
              <BlurText text="Eliot" as="span" />
              <br />
              <BlurText text="Bedel" as="span" delay={40} startDelay={150} />
            </span>
          </h1>
          <p className="hero__title">{profile.title}</p>
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

          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-value">9 ans</span>
              <span className="hero__stat-label">IT &amp; cybersécurité</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">3 ans</span>
              <span className="hero__stat-label">Pilotage Red Team &amp; pentest</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-value">2e</span>
              <span className="hero__stat-label">CTF NetWars London</span>
            </div>
          </div>
        </div>

        <div className="hero__photo-panel">
          <GlareHover
            className="hero__photo-glare"
            width="100%"
            height="100%"
            background="transparent"
            borderColor="transparent"
            borderRadius="0px"
            glareColor="#fff4e0"
            glareOpacity={0.3}
            glareAngle={-45}
            glareSize={250}
            transitionDuration={700}
          >
            <img className="hero__photo" src={photo} alt="Portrait d'Eliot Bedel" />
          </GlareHover>
          <div className="hero__photo-fade" aria-hidden="true" />
          <div className="hero__badge">
            <span className="hero__badge-label">Basé à</span>
            <span className="hero__badge-value">{profile.contact.address}</span>
          </div>
        </div>
      </div>

      <a className="hero__scroll" href="#parcours" aria-label="Défiler vers le parcours">
        <span />
      </a>
    </section>
  );
}
