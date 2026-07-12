import { useEffect, useState } from "react";

const LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#parcours", label: "Parcours" },
  { href: "#formation", label: "Formation" },
  { href: "#competences", label: "Compétences" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <a className="nav__brand" href="#accueil">
          Eliot Bedel
        </a>
        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="nav__toggle"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
