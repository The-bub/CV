// The field's autonomous focal drift — shared.
//
// Field.jsx renders these numbers as a bloom in the background; Hero.jsx reads
// the same numbers to light its title glyph by glyph. One source of truth is the
// whole point: the light on the type and the light in the field can never
// disagree, because there is only one light.
//
// Nothing here consults the pointer. The drift is the site's own weather.

import { isReduced } from "./motion";

// Randomised once per load, so no two visits drift the same way.
const seed = Math.random() * 100;

// The vertical phase is the one number that is NOT random. Measured against the
// real glyph boxes, the horizontal phase barely matters — the signature spans
// x 0.07..0.69, so the drift almost always overlaps some letter — while the
// vertical phase decides whether the light ever arrives at the title's height at
// all. Left random, roughly a third of loads left the type unlit for the first
// minute, which is the whole visit: the hero's effect became a coin toss on
// reload. Locking it to 5.7 rad puts the light on the signature as it resolves
// and keeps it coming back about every 45s, without touching the drift speed.
// Everything else stays random, so where the light enters and how it travels is
// still different every time.
const Y_PHASE = 5.7;

// Mutually incommensurate frequencies — the path is quasi-periodic, so it
// wanders instead of visibly looping. Both stay inside 0.08..0.92 of the
// viewport, which keeps the bloom off the extreme edges.
export const focusX = (t) =>
  0.5 + 0.28 * Math.sin(t * 0.107 + seed) + 0.13 * Math.sin(t * 0.263 + seed * 1.7);
export const focusY = (t) =>
  0.5 + 0.24 * Math.cos(t * 0.079 + Y_PHASE) + 0.12 * Math.sin(t * 0.191 + seed * 2.3);
// Intensity breathes, so the bloom reads as weather rather than a headlight.
export const focusForce = (t) => 0.5 + 0.2 * Math.sin(t * 0.137 + seed * 0.9);
/** Ceiling of focusForce — consumers that need a 0..1 scale divide by this. */
export const FORCE_MAX = 0.7;

// One clock for every consumer, advanced by one shared rAF. Whoever needs the
// drift subscribes; the clock stops when the last of them leaves, and holds
// still under reduced motion so freezing calms the field and the title together
// instead of letting them fall out of step.
let clock = 0;
let raf = null;
let last = 0;
let count = 0;

// The OS preference is not consulted for the site's one-shot intro (too many
// Windows machines report `reduce` unasked, which used to blank it). It IS
// consulted here, because this clock drives the only two perpetual animations on
// the page — the field's drift and the signature's light — and perpetual motion
// with no way to stop it is a WCAG 2.2.2 Level A failure. Frozen, the field holds
// a still frame and the type holds its current lighting: the composition is
// intact, it simply stops moving.
const osReduce =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
const holdStill = () => isReduced() || !!osReduce?.matches;

const tick = (now) => {
  raf = requestAnimationFrame(tick);
  const dt = Math.min((now - last) / 1000, 0.05); // clamp after tab idle
  last = now;
  if (!holdStill()) clock += dt;
};

/** Start the shared clock. Returns an unsubscribe function. */
export function subscribeDrift() {
  if (++count === 1) {
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  let live = true;
  return () => {
    if (!live) return; // double-unsubscribe must not orphan the rAF
    live = false;
    if (--count === 0) {
      cancelAnimationFrame(raf);
      raf = null;
    }
  };
}

/** Seconds of allowed motion since the first subscriber. */
export const driftClock = () => clock;

// Is the field actually on screen? Without WebGL the canvas is hidden, and the
// hero's per-glyph light would go on raking the signature from a source nobody
// can see — which reads as a broken text-shadow, not as an idea. Field reports
// in; consumers of the light check before subscribing.
let fieldLive = false;
const fieldListeners = new Set();

export function setFieldLive(v) {
  if (fieldLive === v) return;
  fieldLive = v;
  fieldListeners.forEach((fn) => fn(v));
}
export const isFieldLive = () => fieldLive;
/** Subscribe to field availability. Returns an unsubscribe function. */
export function onFieldLive(fn) {
  fieldListeners.add(fn);
  return () => fieldListeners.delete(fn);
}
