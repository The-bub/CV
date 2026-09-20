import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  HemisphereLight,
  DirectionalLight,
  Box3,
  Vector3,
  ACESFilmicToneMapping,
} from "three";
import { buildSextant } from "../lib/sextantModel";
import { isReduced, onMotionChange } from "../lib/motion";

/**
 * The instrument, beside the portrait. A self-contained Three.js scene — its
 * own tiny canvas, kept out of the full-screen Field's context — that turns a
 * navigational sextant slowly on the spot: reading a position out of noise,
 * measured rather than guessed.
 *
 * Decorative only, so it defers to the visitor's wishes and the browser's
 * budget: it freezes to a single framed still under reduced motion, stops when
 * the tab is hidden, and stops when scrolled out of the hero (an
 * IntersectionObserver) so it never competes with the Field for the GPU once
 * it is off screen.
 */
export default function Sextant() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let reduced = isReduced();

    let renderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true, // float over the field, no panel of its own
      });
    } catch {
      // No WebGL — hide the canvas and leave the portrait to carry the hero.
      canvas.style.display = "none";
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.01, 100);

    // Neutral studio, matched to the object's own maquette: a soft sky/ground
    // wash, a warm key from high right, a cool fill from low left. No
    // environment map, so the brass reads by its lighting rather than a
    // reflection of nothing.
    scene.add(new HemisphereLight(0xffffff, 0xcdd4cb, 1.05));
    const key = new DirectionalLight(0xfff3e2, 2.15);
    key.position.set(3.5, 6, 4.5);
    scene.add(key);
    const fill = new DirectionalLight(0xdfeef0, 0.55);
    fill.position.set(-5, 2.5, -3.5);
    scene.add(fill);
    const rim = new DirectionalLight(0x9fd8c2, 0.4);
    rim.position.set(-2, 1.5, -5);
    scene.add(rim);

    const object = buildSextant();
    scene.add(object);

    // Frame the camera to the object's bounds, tilted a touch above the
    // horizon so the graduated limb and the telescope both read.
    // Contain-fit: frame the instrument to whichever axis binds for the current
    // canvas shape, so it FILLS the stage instead of floating in it. Height is
    // measured from the box; the horizontal extent uses the x/z diagonal, which
    // is the widest the silhouette ever gets as the object turns on Y — so the
    // arc and telescope never clip mid-rotation whatever the aspect ratio.
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3());
    const target = box.getCenter(new Vector3());
    const halfW = 0.5 * Math.hypot(size.x, size.z);
    const halfH = 0.5 * size.y;
    // Near-frontal, a touch above the horizon: centres the mass in the column
    // (the old right-ward lean opened a dead gap between the text and the
    // instrument) while still reading the graduated limb and the telescope.
    const dir = new Vector3(0.06, 0.1, 1).normalize();
    // Comfortable headroom on every axis. halfW is already the widest the
    // silhouette gets as the object turns on Y, but the pointer-parallax tilt
    // (rotation.x) nudges the top and bottom past a pure side view, so a tight
    // fit clipped an edge at some viewport ratios and rotation angles — read as
    // the object being "cut" on arrival. 18% keeps the whole instrument inside
    // the frame through the full turn and the lean.
    const MARGIN = 1.18;

    const frame = () => {
      const fovV = (camera.fov * Math.PI) / 360;
      const fovH = Math.atan(Math.tan(fovV) * camera.aspect);
      const dist = Math.max(halfH / Math.tan(fovV), halfW / Math.tan(fovH)) * MARGIN;
      camera.position.copy(target).addScaledVector(dir, dist);
      camera.lookAt(target);
    };

    let framed = false;
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // Skip degenerate sizes: the instrument mounts (lazily) while the loader
      // still has the page locked, so the first measurement can be 0 or the
      // pre-layout min-height. Framing against that is what flashed a mis-scaled,
      // clipped object at the start. A ResizeObserver re-frames the moment the
      // real box lands, so the object only ever appears correctly sized.
      if (w < 2 || h < 2) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      frame();
      framed = true;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pointer parallax: a slight, eased lean toward the cursor while it is over
    // the hero. Kept tiny — this is a nudge that acknowledges the visitor, not
    // a control they have to operate.
    let pointerX = 0;
    let pointerY = 0;
    const onPointer = (e) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduced) window.addEventListener("pointermove", onPointer);

    let raf;
    let running = true;
    let onScreen = true;
    let last = performance.now();
    let spin = -0.35; // start with the limb angled toward the viewer
    let leanX = 0;
    let leanY = 0;

    const render = (now) => {
      raf = requestAnimationFrame(render);
      if (!running || !onScreen) return;
      // Hold the very first paints until the instrument has been framed against
      // its real box — never show it mis-scaled while the layout settles.
      if (!framed) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!reduced) {
        spin += dt * 0.22; // ~28s per revolution — a slow, deliberate turn
        leanX += (pointerX * 0.12 - leanX) * 0.05;
        leanY += (-pointerY * 0.08 - leanY) * 0.05;
      }
      object.rotation.y = spin + leanX;
      object.rotation.x = leanY;

      renderer.render(scene, camera);

      if (reduced) running = false; // one settled frame, then idle
    };
    raf = requestAnimationFrame(render);

    // Stop the loop when the hero leaves the screen, so a scrolled-away
    // instrument stops paying for the GPU it no longer earns.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !reduced) {
          running = true;
          last = performance.now();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      running = !document.hidden && !reduced;
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const offMotion = onMotionChange((r) => {
      reduced = r;
      running = !document.hidden;
      last = performance.now();
      if (r) window.removeEventListener("pointermove", onPointer);
      else window.addEventListener("pointermove", onPointer);
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      offMotion();
      object.traverse((o) => {
        if (o.isMesh) {
          o.geometry.dispose();
          const m = o.material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else m.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero__object" aria-hidden="true">
      <canvas ref={canvasRef} className="hero__object-canvas" />
    </div>
  );
}
