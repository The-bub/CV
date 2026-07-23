import { useCallback, useState } from "react";
import Preloader from "./components/Preloader";
import GrainOverlay from "./components/GrainOverlay";
import Cursor from "./components/Cursor";
import SmoothScroll from "./components/SmoothScroll";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Contact from "./components/Contact";

function App() {
  const [ready, setReady] = useState(false);
  const handlePreloaderComplete = useCallback(() => setReady(true), []);

  return (
    <>
      <a className="skip-link" href="#accueil">
        Aller au contenu
      </a>
      <Preloader onComplete={handlePreloaderComplete} />
      <GrainOverlay />
      <Cursor />
      <Nav />
      <SmoothScroll>
        <main>
          <Hero ready={ready} />
          <Experience />
          <Education />
          <Skills />
          <Contact />
        </main>
      </SmoothScroll>
    </>
  );
}

export default App;
