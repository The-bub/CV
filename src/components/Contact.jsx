import { profile } from "../data";
import Reveal from "./Reveal";
import GsapReveal from "./GsapReveal";

export default function Contact() {
  const { contact } = profile;

  return (
    <section id="contact" className="section section--dark">
      <div className="section__inner section__inner--narrow">
        <Reveal as="p" className="section__eyebrow">
          Contact
        </Reveal>
        <h2 className="section__title">
          <GsapReveal>Discutons de votre prochain projet</GsapReveal>
        </h2>
        <Reveal as="p" className="contact__lede">
          Disponible pour échanger sur vos enjeux de gouvernance, de gestion des
          risques ou de sécurité offensive.
        </Reveal>

        <Reveal as="div" className="contact__grid">
          <a className="contact__item cursor-target" href={`mailto:${contact.email}`}>
            <span className="contact__label">Email</span>
            <span className="contact__value">{contact.email}</span>
          </a>
          <a
            className="contact__item cursor-target"
            href={`tel:${contact.mobile.replace(/\s/g, "").replace(/^0/, "+33")}`}
          >
            <span className="contact__label">Téléphone</span>
            <span className="contact__value">{contact.mobile}</span>
          </a>
          <a
            className="contact__item cursor-target"
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact__label">LinkedIn</span>
            <span className="contact__value">Voir le profil</span>
          </a>
          <a
            className="contact__item cursor-target"
            href={contact.maps}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="contact__label">Adresse</span>
            <span className="contact__value">{contact.address}</span>
          </a>
        </Reveal>

        <Reveal as="p" className="contact__cv">
          <a className="cursor-target" href="/eliot-bedel-cv.pdf" download>
            Télécharger mon CV (PDF)
          </a>
        </Reveal>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name} — {profile.title}</p>
      </footer>
    </section>
  );
}
