import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { scrollTo } from "../lib/scroll";
import {
  focusX,
  focusY,
  focusForce,
  FORCE_MAX,
  driftClock,
  subscribeDrift,
  isFieldLive,
  onFieldLive,
} from "../lib/drift";
import portrait from "../assets/eliot-bedel-2026-v2.jpg";

const CV_URL = "/eliot-bedel-cv.pdf";

const STATS = [
  { k: "9", v: "ans IT & cybersécurité" },
  { k: "3", v: "ans en sécurité offensive" },
  { k: "2×", v: "2ᵉ place en CTF" },
];

// The signature. Split per glyph so each letter can arrive out of registration
// and be lit individually as the field's light passes behind it — every glyph is
// its own measuring point. `thin` marks the Fraunces italic segment.
//
// It carries the argument, not the job title: "Ingénieur cybersécurité" is the
// category the visitor already read on the LinkedIn headline they arrived from,
// and it is interchangeable with tens of thousands of profiles. The 360° claim
// is the hinge — offensive and governance as one span — and it is the site's own
// vocabulary (see the §01 stat). The title itself moves to the role line below.
const TITLE_LINES = [
  [{ text: "Vision 360°" }],
  [{ text: "du risque cyber", thin: true }],
];
const TITLE_TEXT = "Vision 360° du risque cyber";

// Deterministic per-glyph jitter. Not Math.random: the offsets must survive a
// re-render, or a second render would reshuffle a running animation.
const jitter = (i, k) => {
  const n = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return n - Math.floor(n);
};

/** Flatten the lines into positioned glyph descriptors, numbered across the whole title. */
function buildGlyphs() {
  let n = 0;
  return TITLE_LINES.map((segments) =>
    segments.map((seg) => ({
      thin: seg.thin,
      chars: [...seg.text].map((ch) => ({ ch, i: n++ })),
    })),
  );
}

// Spaces stay plain text nodes rather than glyph spans: an inline-block holding
// only a space collapses to zero width, and an &nbsp; would put U+00A0 into the
// text layer, so copy-paste and find-in-page would miss a typed space.
const isSpace = (ch) => ch === " ";

export default function Hero({ ready }) {
  const rootRef = useRef(null);
  const titleRef = useRef(null);
  const lines = useMemo(buildGlyphs, []);

  // ---- Arrival: the title resolves out of misregistration -------------------
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const el = rootRef.current;
    if (!el) return;

    const glyphs = el.querySelectorAll(".hero__g");
    const ins = el.querySelectorAll("[data-in]");

    // Animating filter on 22 glyphs at once is the expensive half of the
    // resolve, and on a phone the glyphs are small enough that the blur barely
    // reads — so small screens get the same choreography without it rather than
    // a janky version of it.
    const blurAffordable = window.matchMedia("(min-width: 640px)").matches;

    // Pre-state, not a resting state: the CSS default is the finished
    // composition, so a failed script leaves the hero readable and aligned.
    const scatter = {
      yPercent: (i) => 60 + jitter(i, 1) * 70,
      xPercent: (i) => (jitter(i, 2) - 0.5) * 44,
      rotate: (i) => (jitter(i, 3) - 0.5) * 13,
      opacity: 0,
      willChange: blurAffordable ? "transform, filter" : "transform",
    };
    if (blurAffordable) {
      scatter.filter = (i) => `blur(${4 + jitter(i, 4) * 7}px)`;
    }

    if (!ready) {
      gsap.set(glyphs, scatter);
      gsap.set(ins, { opacity: 0, y: 24 });
      return;
    }

    const tl = gsap.timeline({ delay: 0.12 });
    tl.to(glyphs, {
      yPercent: 0,
      xPercent: 0,
      rotate: 0,
      ...(blurAffordable ? { filter: "blur(0px)" } : null),
      opacity: 1,
      duration: 1.15,
      ease: "expo.out",
      stagger: { each: 0.021, from: "random" },
      // Blur is the expensive half of this; drop the hint the moment it lands
      // so 23 glyphs are not left promoted to their own layers for the session.
      onComplete: () => gsap.set(glyphs, { clearProps: "filter,willChange" }),
    });
    // Absolute position, not relative to the glyph tween: chained off the end of
    // the resolve, the CV button waited on 22 letters it has nothing to do with
    // and landed ~6.1s after load. It now rides alongside them.
    tl.to(
      ins,
      { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07 },
      0.15,
    );
    return () => tl.kill();
  }, [ready]);

  // ---- Ambient: the field's light rakes the type ----------------------------
  // Each glyph brightens by its distance to the drifting focal point. No pointer
  // input anywhere: this is the background's own light, arriving in the
  // foreground — which is exactly why it must not run when the field is not
  // there to be its source. The Field is lazy, so this waits for it to report in
  // rather than sampling once and giving up.
  const [fieldLive, setFieldLiveState] = useState(isFieldLive);
  useEffect(() => onFieldLive(setFieldLiveState), []);

  useEffect(() => {
    if (!ready || !fieldLive || prefersReducedMotion()) return;
    const el = rootRef.current;
    const title = titleRef.current;
    if (!el || !title) return;

    const glyphs = [...el.querySelectorAll(".hero__g")];
    // Measured once per resize, not per frame: reading a rect in a rAF that
    // also writes styles is the classic layout-thrash trap.
    let boxes = [];
    let vw = 1;
    let vh = 1;
    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      const t = title.getBoundingClientRect();
      boxes = glyphs.map((g) => {
        const r = g.getBoundingClientRect();
        return {
          // Centre of the glyph, in viewport fractions.
          cx: (r.left + r.width / 2) / vw,
          cy: (r.top + r.height / 2) / vh,
        };
      });
      return t;
    };
    measure();
    window.addEventListener("resize", measure);

    const stop = subscribeDrift();
    // Falloff in x is wider than in y: the light travels along the line like a
    // beam rather than washing the block, but it has to stay broad enough that
    // neighbouring glyphs differ instead of one letter flaring alone. Measured:
    // at these radii the lit/unlit spread across the signature peaks around
    // 0.6, so the rake is legible.
    const RX = 0.32;
    const RY = 0.22;
    const lit = new Array(glyphs.length).fill(-1);
    let raf = requestAnimationFrame(function loop() {
      raf = requestAnimationFrame(loop);
      const t = driftClock();
      const fx = focusX(t);
      const fy = 1 - focusY(t); // field uv is y-up; the DOM is y-down
      // Normalised so the crest of a pass reaches a full 1.0 on the type; the
      // raw value would cap the signature at two-thirds lit.
      const lightForce = focusForce(t) / FORCE_MAX;

      for (let i = 0; i < glyphs.length; i++) {
        const b = boxes[i];
        if (!b) continue;
        const dx = (b.cx - fx) / RX;
        const dy = (b.cy - fy) / RY;
        const d = dx * dx + dy * dy;
        // Quantised to 24 steps: below that the paint is invisible and we would
        // just be handing the compositor 23 no-op writes every frame.
        const v = Math.round(Math.exp(-d) * lightForce * 24);
        if (v !== lit[i]) {
          lit[i] = v;
          glyphs[i].style.setProperty("--lit", v / 24);
        }
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      stop();
      window.removeEventListener("resize", measure);
      glyphs.forEach((g) => g.style.removeProperty("--lit"));
    };
  }, [ready, fieldLive]);

  return (
    <section className="hero" id="accueil" ref={rootRef}>
      <div className="hero__wrap">
        {/* "Eliot Bedel" is already the nav wordmark 30px above, and "Portfolio"
            competes with the CV noun used in <title>, OG and JSON-LD. */}
        <div className="hero__topline" data-in>
          <span className="meta">Curriculum vitæ · 2026</span>
          <span className="meta">Nantes, France · Disponible</span>
        </div>

        {/* The glyph spans would be announced letter by letter by some screen
            readers, so the accessible name is set once on the heading and the
            decorative split is hidden from the tree. */}
        <h1 className="hero__title" aria-label={TITLE_TEXT} ref={titleRef}>
          {lines.map((segments, li) => (
            <span className="line" key={li} aria-hidden="true">
              {segments.map((seg, si) => (
                <span className={seg.thin ? "thin" : undefined} key={si}>
                  {seg.chars.map(({ ch, i }) =>
                    isSpace(ch) ? (
                      " "
                    ) : (
                      <span className="hero__g" key={i}>
                        {ch}
                      </span>
                    ),
                  )}
                </span>
              ))}
              {/* Keeps the two lines separated in textContent, so copy-paste and
                  find-in-page get "Une vision 360° du risque cyber" rather than
                  the joined string. Collapses at the end of a block line. */}
              {li === 0 ? " " : null}
            </span>
          ))}
        </h1>

        <p className="hero__role" data-in>
          Ingénieur cybersécurité
          <span className="hero__role__span">
            {" · de l'offensive à la gouvernance"}
          </span>
        </p>

        <div className="hero__lower">
          <div className="hero__intro">
            {/* The closing clause moved up to the role line; kept here it would
                repeat verbatim 40px below itself. */}
            <p className="hero__lead" data-in>
              J'extrais le <span className="serif">signal</span> du bruit. Je
              traduis la complexité technique en risques métier actionnables.
            </p>

            <div className="hero__foot">
              <dl className="hero__stats" data-in>
                {STATS.map((s) => (
                  <div className="hstat" key={s.k}>
                    <dt>{s.k}</dt>
                    <dd>{s.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="hero__actions" data-in>
                <a className="btn btn--solid" href={CV_URL} download>
                  Télécharger le CV
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
                    <path
                      d="M6.5 1.5V9M6.5 9L3.5 6M6.5 9L9.5 6M2 11h9"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
                <span className="meta">PDF · optimisé ATS</span>
              </div>
            </div>
          </div>

          {/* No caption: it repeated the "Nantes" already in the topline, and it
              was the half of the mobile overlap that carried no information. */}
          <figure className="hero__portrait" data-in>
            <img
              src={portrait}
              alt="Portrait d'Eliot Bedel"
              width="1448"
              height="1086"
            />
          </figure>
        </div>

        <button
          className="hero__scroll"
          data-in
          onClick={() => scrollTo("#approche")}
          aria-label="Défiler vers l'approche"
        >
          <span className="line-y" />
          <span className="meta">Défiler</span>
        </button>
      </div>
    </section>
  );
}
