import { useEffect, useRef, useState } from "react";
import { scrollTo } from "../lib/scroll";
import { useMagnetic } from "../lib/useMagnetic";

const LINKS = [
  { id: "#approche", label: "Approche", hideable: true },
  { id: "#parcours", label: "Parcours" },
  { id: "#expertise", label: "Expertise" },
  { id: "#certifications", label: "Titres", hideable: true },
];

// La V4 est le site principal (racine). Quand la V5 est servie en secondaire
// sous /v5/, ce lien renvoie au site principal à la racine.
const V4_URL = "/";

export default function Nav() {
  const navRef = useRef(null);
  const ctaRef = useMagnetic(0.3);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return;
      navRef.current.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: mark the nav link whose section is crossing the viewport middle.
  // The hero is observed too, without a link of its own: back at the top, no
  // section is current, so the highlight clears instead of staying stuck on
  // whichever link was last passed.
  useEffect(() => {
    const ids = ["accueil", ...LINKS.map((l) => l.id.slice(1))];
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id === "accueil" ? "" : e.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
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
            aria-current={active === l.id.slice(1) ? "true" : undefined}
            className={
              `${l.hideable ? "nav__hideable" : ""}${
                active === l.id.slice(1) ? " is-active" : ""
              }`.trim() || undefined
            }
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
