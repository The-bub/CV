import { education, hobbies } from "../data";
import Reveal from "./Reveal";

export default function Education() {
  const ctf = hobbies.ctf.map((s) => {
    const [event, rank] = s.split(" : ");
    return { event, rank };
  });
  const interests = [hobbies.tech, ...hobbies.other];

  return (
    <section className="section" id="formation">
      <div className="wrap">
        <div className="sec-head">
          <h2>
            Formation &amp; distinctions<span className="signal">.</span>
          </h2>
          <span className="sec-index">§05 · Repères</span>
        </div>

        <div className="split">
          <Reveal className="edu" stagger={0.08} selector=".edu__row" y={26}>
            <div className="block-label" style={{ gridColumn: "1 / -1" }}>
              Diplômes
            </div>
            {education.map((e, i) => (
              <div className="edu__row" key={i}>
                <div className="edu__period">{e.period}</div>
                <div>
                  <h3 className="edu__title">{e.title}</h3>
                  <div className="edu__school">{e.school}</div>
                  {e.detail && <div className="edu__detail">{e.detail}</div>}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="dist" y={26}>
            <div className="dist__block">
              <div className="block-label">Sur les podiums · CTF</div>
              <div className="dist__awards">
                {ctf.map((c) => (
                  <div className="dist__award" key={c.event}>
                    <b>{c.rank}</b>
                    <span>{c.event}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="dist__block">
              <div className="block-label">Centres d'intérêt</div>
              <div className="dist__list">
                {interests.map((it) => (
                  <span key={it}>{it}</span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
