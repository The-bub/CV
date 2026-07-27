import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
  Vector3,
} from "three";
import { vertexShader, fragmentShader } from "../lib/fieldShader";
import { isReduced, onMotionChange } from "../lib/motion";
import {
  focusX,
  focusY,
  focusForce,
  driftClock,
  subscribeDrift,
  setFieldLive,
} from "../lib/drift";

// Field colours are read from the active palette's CSS custom properties so the
// background follows the theme (vermillon / sapin / platine).
const FIELD_VARS = {
  INK_DEEP: "--ink",
  INK_WARM: "--ink-3",
  SHADOW: "--field-shadow",
  SIGNAL: "--signal",
  EMBER: "--ember",
};

// Parse "#rrggbb" / "#rgb" into raw sRGB 0..1 (no colour-management shift).
function hexToRgb(hex) {
  let h = hex.replace("#", "").trim();
  if (h.length === 3)
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/**
 * Full-screen generative background. `revealRef` is a ref holding a 0..1
 * number the loader animates (0 = turbulent, 1 = settled). Kept out of React
 * state on purpose so nothing re-renders per frame.
 */
export default function Field({ revealRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Animated by default on every machine; the visitor can freeze it from the
    // "Animations" control at any moment (see lib/motion.js).
    let reduced = isReduced();

    let renderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      // No WebGL — the CSS background under the canvas is the graceful fallback,
      // and the hero must be told there is no light source before it starts
      // lighting its title from one.
      canvas.style.display = "none";
      setFieldLive(false);
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
      uFocus: { value: new Vector2(0.5, 0.5) },
      uFocusForce: { value: 0 },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
      uFlow: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
      INK_DEEP: { value: new Vector3() },
      INK_WARM: { value: new Vector3() },
      SHADOW: { value: new Vector3() },
      SIGNAL: { value: new Vector3() },
      EMBER: { value: new Vector3() },
    };

    // Pull palette colours from CSS and refresh whenever the theme changes.
    const root = document.documentElement;
    const syncPalette = () => {
      const cs = getComputedStyle(root);
      for (const [key, cssVar] of Object.entries(FIELD_VARS)) {
        const v = cs.getPropertyValue(cssVar).trim();
        if (v) uniforms[key].value.fromArray(hexToRgb(v));
      }
    };
    syncPalette();
    const paletteObserver = new MutationObserver(syncPalette);
    paletteObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-palette"],
    });

    const material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    material.extensions = { derivatives: true };

    const mesh = new Mesh(new PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * dpr, h * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    // The focal point wanders on its own — see lib/drift.js, which the hero
    // reads from too so its title is lit by this exact light.
    const unsubscribeDrift = subscribeDrift();
    setFieldLive(true);

    const scrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };

    let raf;
    let running = true;
    const start = performance.now();
    let lastNow = start;
    let scrollSmooth = 0;
    let flow = 0;
    const smoothstep = (a, b, x) => {
      const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
      return t * t * (3 - 2 * t);
    };

    const render = (now) => {
      raf = requestAnimationFrame(render);
      if (!running) return;

      const dt = Math.min((now - lastNow) / 1000, 0.05); // clamp after tab idle
      lastNow = now;
      uniforms.uTime.value = (now - start) / 1000;

      const dc = driftClock();
      uniforms.uFocus.value.set(focusX(dc), focusY(dc));
      uniforms.uFocusForce.value = reduced ? 0 : focusForce(dc);

      uniforms.uReveal.value = revealRef ? revealRef.current : 1;

      scrollSmooth += (scrollProgress() - scrollSmooth) * 0.1;
      uniforms.uScroll.value = scrollSmooth;

      // Flow advances only near the hero — the field freezes as you scroll on,
      // and entirely when the visitor has asked for reduced motion.
      if (!reduced) {
        flow += dt * 0.011 * (1 - smoothstep(0.02, 0.12, scrollSmooth));
        uniforms.uFlow.value = flow;
      }

      renderer.render(scene, camera);

      // Reduced motion: draw a single settled frame, then idle.
      if (reduced && uniforms.uReveal.value >= 0.999) running = false;
    };
    raf = requestAnimationFrame(render);

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Live response to the "Animations" control: wake the loop for one frame so
    // it can either settle to a still image or resume flowing.
    const offMotion = onMotionChange((r) => {
      reduced = r;
      uniforms.uReduced.value = r ? 1 : 0;
      running = !document.hidden;
      lastNow = performance.now();
    });

    return () => {
      cancelAnimationFrame(raf);
      setFieldLive(false);
      unsubscribeDrift();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      offMotion();
      paletteObserver.disconnect();
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [revealRef]);

  return <canvas ref={canvasRef} className="field-canvas" aria-hidden="true" />;
}
