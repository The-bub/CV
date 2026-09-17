import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  HemisphereLight,
  DirectionalLight,
  Box3,
  Sphere,
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
    const box = new Box3().setFromObject(object);
    const sphere = box.getBoundingSphere(new Sphere());
    // Framed tight so the instrument fills its stage — it is the hero object
    // now, not a thumbnail. A hair of headroom keeps the arc and pedestal off
    // the canvas edges as it turns.
    const dist =
      (sphere.radius / Math.tan((camera.fov * Math.PI) / 360)) * 1.06;
    const target = sphere.center;
    const dir = new Vector3(0.16, 0.14, 1).normalize();
    camera.position.copy(target).addScaledVector(dir, dist);
    camera.lookAt(target);

    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

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
      window.removeEventListener("resize", resize);
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
