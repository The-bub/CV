import { certifications } from "../data";
import Reveal from "./Reveal";

export default function Certifications() {
  return (
    <section className="section" id="certifications">
      <div className="wrap">
        <div className="sec-head">
          <h2>
            Certifications<span className="signal">.</span>
          </h2>
          <span className="sec-index">§04 — Titres</span>
        </div>

        <Reveal className="certs" stagger={0.08} selector=".cert" y={30}>
          {certifications.map((c) => (
            <article className="cert" key={c.name}>
              <div className="cert__top">
                <div>
                  <div className="cert__name">{c.name}</div>
                  <div className="cert__org">{c.org}</div>
                </div>
                {c.status && <span className="cert__status">{c.status}</span>}
              </div>
              <div className="cert__full">{c.fullName}</div>
              <p className="cert__detail">{c.detail}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
