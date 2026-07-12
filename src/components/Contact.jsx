import { profile } from "../data";
import { useReveal } from "../hooks/useReveal";

export default function Contact() {
  const ref = useReveal();
  const { contact } = profile;

  return (
    <section id="contact" className="section section--dark" ref={ref}>
      <div className="section__inner section__inner--narrow">
        <p className="section__eyebrow" data-reveal>
          Contact
        </p>
        <h2 className="section__title" data-reveal>
          Discutons de votre prochain projet
        </h2>
        <p className="contact__lede" data-reveal>
          Disponible pour échanger sur vos enjeux de gouvernance, de gestion des
          risques ou de sécurité offensive.
        </p>

        <div className="contact__grid" data-reveal>
          <a className="contact__item" href={`mailto:${contact.email}`}>
            <span className="contact__label">Email</span>
            <span className="contact__value">{contact.email}</span>
          </a>
          <a className="contact__item" href={`tel:${contact.mobile.replace(/\s/g, "").replace(/^0/, "+33")}`}>
            <span className="contact__label">Téléphone</span>
            <span className="contact__value">{contact.mobile}</span>
          </a>
          <div className="contact__item">
            <span className="contact__label">Adresse</span>
            <span className="contact__value">{contact.address}</span>
          </div>
          <div className="contact__item">
            <span className="contact__label">Permis</span>
            <span className="contact__value">{contact.permis}</span>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>© {new Date().getFullYear()} {profile.name} — {profile.title}</p>
      </footer>
    </section>
  );
}
