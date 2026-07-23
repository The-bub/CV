import { profile } from "../data";
import Reveal from "./Reveal";
import { useMagnetic } from "../lib/useMagnetic";
import { scrollTo } from "../lib/scroll";

export default function Contact() {
  const mailRef = useMagnetic(0.18);

  return (
    <>
      <section className="section contact" id="contact">
        <div className="wrap">
          <Reveal y={30}>
            <span className="sec-index">§06 — Contact</span>
            <h2 className="contact__lead">
              Traduisons la complexité en <em>décisions</em>.
            </h2>
            <a
              className="contact__mail"
              href={`mailto:${profile.contact.email}`}
              ref={mailRef}
            >
              {profile.contact.email}
            </a>
          </Reveal>

          <Reveal className="contact__grid" stagger={0.1} selector=".contact__col" y={24}>
            <div className="contact__col">
              <h4>Réseau</h4>
              <a
                href={profile.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
            <div className="contact__col">
              <h4>Localisation</h4>
              <a
                href={profile.contact.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                {profile.contact.address} ↗
              </a>
            </div>
            <div className="contact__col">
              <h4>Disponibilité</h4>
              <p>Ouvert aux opportunités</p>
              <p style={{ color: "var(--bone-2)" }}>GRC · Red Team · Conseil</p>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="foot">
        <span>© 2026 Eliot Bedel</span>
        <span>Cartographie du risque — du bruit au signal</span>
        <button className="foot__top" onClick={() => scrollTo("#accueil")}>
          Retour en haut ↑
        </button>
      </footer>
    </>
  );
}
