import { experiences } from "../data";
import Reveal from "./Reveal";

export default function Experience() {
  return (
    <section className="section" id="parcours">
      <div className="wrap">
        <div className="sec-head">
          <h2>
            Parcours<span className="signal">.</span>
          </h2>
          <span className="sec-index">§02 · Expérience</span>
        </div>

        <Reveal className="xp__list" stagger={0.08} selector=".xp" y={40}>
          {experiences.map((xp, i) => (
            <article className="xp" key={`${xp.role}-${i}`}>
              <div className="xp__period">{xp.period}</div>
              <div>
                <h3 className="xp__role">{xp.role}</h3>
                <span className="xp__company">{xp.company}</span>
              </div>
              <ul className="xp__items">
                {xp.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
              <span className="xp__num">
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(experiences.length).padStart(2, "0")}
              </span>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
