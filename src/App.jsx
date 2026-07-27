import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { ScrollTrigger } from "./lib/gsap";
import { scrollTo } from "./lib/scroll";
import GrainOverlay from "./components/GrainOverlay";
import Loader from "./components/Loader";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Manifesto from "./components/Manifesto";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Certifications from "./components/Certifications";
import Education from "./components/Education";
import Contact from "./components/Contact";

// Three.js is heavy and purely decorative — stream it in behind the loader.
const Field = lazy(() => import("./components/Field"));

function App() {
  const [ready, setReady] = useState(false);
  const revealRef = useRef(0);

  useEffect(() => {
    document.body.classList.add("is-loading");
    // Belt and braces with history.scrollRestoration = "manual" in index.html:
    // the loader hands over from the top of the hero, and both Lenis and
    // ScrollTrigger must take their first measurements at offset 0.
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.body.classList.remove("is-loading");

    // The document was locked at 100vh while the loader played, so ScrollTrigger
    // measured a clamped page. Re-measure now that the real height is in place,
    // then honour a #hash entry (deep links still work despite the manual
    // scroll restoration above).
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      const hash = window.location.hash;
      if (hash.length > 1 && document.querySelector(hash)) scrollTo(hash);
    });
  }, [ready]);

  // Chapter cuts: draw each section's accent rule when it scrolls into view.
  useEffect(() => {
    const sections = document.querySelectorAll("main .section");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <a className="skip-link" href="#accueil">
        Aller au contenu
      </a>

      <Suspense fallback={null}>
        <Field revealRef={revealRef} />
      </Suspense>
      <GrainOverlay />
      <Loader onComplete={handleComplete} revealRef={revealRef} />

      <Nav />
      <SmoothScroll paused={!ready}>
        <main>
          <Hero ready={ready} />
          <Manifesto />
          <Experience />
          <Skills />
          <Certifications />
          <Education />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}

export default App;
