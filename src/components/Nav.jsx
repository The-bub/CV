import { useEffect, useRef } from "react";
import { scrollTo } from "../lib/scroll";
import { useMagnetic } from "../lib/useMagnetic";

const LINKS = [
  { id: "#approche", label: "Approche", hideable: true },
  { id: "#parcours", label: "Parcours" },
  { id: "#expertise", label: "Expertise" },
  { id: "#certifications", label: "Titres", hideable: true },
];

export default function Nav() {
  const navRef = useRef(null);
  const ctaRef = useMagnetic(0.35);

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
        aria-label="Eliot Bedel — accueil"
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
        <a
          ref={ctaRef}
          href="#contact"
          onClick={(e) => go(e, "#contact")}
          className="btn"
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
