import { skills } from "../data";
import Reveal from "./Reveal";

export default function Skills() {
  return (
    <section className="section" id="expertise">
      <div className="wrap">
        <div className="sec-head">
          <h2>
            Expertise<span className="signal">.</span>
          </h2>
          <span className="sec-index">§03 — Compétences</span>
        </div>

        <Reveal className="skills__grid" stagger={0.06} selector=".skill" y={30}>
          {skills.map((s, i) => (
            <div className="skill" key={s.category}>
              <div className="skill__head">
                <span className="skill__idx">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="skill__cat">{s.category}</h3>
              </div>
              <ul className="skill__items">
                {s.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
