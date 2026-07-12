import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Skills from "./components/Skills";
import Contact from "./components/Contact";

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Experience />
        <Education />
        <Skills />
        <Contact />
      </main>
    </>
  );
}

export default App;
