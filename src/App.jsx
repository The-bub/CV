import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import GrainOverlay from "./components/GrainOverlay";
import Cursor from "./components/Cursor";
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
import PaletteSwitcher from "./components/PaletteSwitcher";

// Three.js is heavy and purely decorative — stream it in behind the loader.
const Field = lazy(() => import("./components/Field"));

function App() {
  const [ready, setReady] = useState(false);
  const revealRef = useRef(0);

  useEffect(() => {
    document.body.classList.add("is-loading");
  }, []);

  useEffect(() => {
    if (ready) document.body.classList.remove("is-loading");
  }, [ready]);

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
      <Cursor />
      <Loader onComplete={handleComplete} revealRef={revealRef} />

      <Nav />
      <PaletteSwitcher />
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
