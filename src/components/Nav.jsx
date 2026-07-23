import { useEffect, useRef, useState } from "react";
import { applyTheme, getPreferredTheme } from "../lib/theme";
import { gsap, registerGsap, ScrollTrigger, scrollToHash } from "../lib/gsapSetup";

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
  const [theme, setTheme] = useState(getPreferredTheme);
  const progressRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    registerGsap();
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleX: self.progress });
        }
      },
    });
    return () => trigger.kill();
  }, []);

  const handleNavClick = (e, href) => {
    setOpen(false);
    scrollToHash(e, href);
  };

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner">
        <a
          className="nav__brand cursor-target"
          href="#accueil"
          onClick={(e) => handleNavClick(e, "#accueil")}
        >
          <span className="nav__brand-line1">Eliot</span>
          <span className="nav__brand-line2">Bedel</span>
        </a>
        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {LINKS.map((link) => (
            <a
              key={link.href}
              className="cursor-target"
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            className="nav__cv-link cursor-target"
            href="/eliot-bedel-cv.pdf"
            download
            onClick={() => setOpen(false)}
          >
            CV (PDF)
          </a>
        </nav>
        <button
          type="button"
          className="icon-btn theme-toggle cursor-target"
          aria-label={
            theme === "dark" ? "Activer le mode clair" : "Activer le mode sombre"
          }
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          {theme === "dark" ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
        <button
          type="button"
          className="icon-btn nav__toggle cursor-target"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
        <div className="nav__progress" ref={progressRef} aria-hidden="true" />
      </div>
    </header>
  );
}
