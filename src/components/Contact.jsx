import { useRef } from "react";
import { profile } from "../data";
import Reveal from "./Reveal";
import TargetCursor from "./TargetCursor";

export default function Contact() {
  const { contact } = profile;
  const sectionRef = useRef(null);
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <section id="contact" className="section section--dark" ref={sectionRef}>
      {!prefersReducedMotion && <TargetCursor containerRef={sectionRef} />}
      <div className="section__inner section__inner--narrow">
        <Reveal as="p" className="section__eyebrow">
          Contact
        </Reveal>
        <Reveal as="h2" className="section__title">
          Discutons de votre prochain projet
        </Reveal>
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
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name} — {profile.title}</p>
      </footer>
    </section>
  );
}
