import { useEffect, useRef } from "react";
import { scrollTo } from "../lib/scroll";
import { useMagnetic } from "../lib/useMagnetic";

const LINKS = [
  { id: "#approche", label: "Approche", hideable: true },
  { id: "#parcours", label: "Parcours" },
  { id: "#expertise", label: "Expertise" },
  { id: "#certifications", label: "Titres", hideable: true },
];

// TODO: remplacer par l'URL réelle du déploiement de la V4.
const V4_URL = "https://v4.cv.ebedel.fr/";

export default function Nav() {
  const navRef = useRef(null);
  const ctaRef = useMagnetic(0.3);

  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return;
      navRef.current.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e, id) => {
    e.preventDefault();
    scrollTo(id);
  };

  return (
    <nav className="nav" ref={navRef}>
      <a
        className="nav__mark"
        href="#accueil"
        onClick={(e) => go(e, "#accueil")}
        aria-label="Eliot Bedel, accueil"
      >
        <b />
        Eliot Bedel
      </a>
      <div className="nav__links">
        {LINKS.map((l) => (
          <a
            key={l.id}
            href={l.id}
            onClick={(e) => go(e, l.id)}
            className={l.hideable ? "nav__hideable" : undefined}
          >
            {l.label}
          </a>
        ))}
        <a className="nav__version nav__hideable" href={V4_URL}>
          V4 <span aria-hidden="true">↗</span>
        </a>
        <a
          ref={ctaRef}
          href="#contact"
          onClick={(e) => go(e, "#contact")}
          className="nav__cta"
        >
          Contact
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 10L10 3M10 3H4.5M10 3V8.5"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </nav>
  );
}
