import { useEffect, useRef } from "react";
import {
  WebGLRenderer,
  Scene,
  OrthographicCamera,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Vector2,
} from "three";
import { vertexShader, fragmentShader } from "../lib/fieldShader";

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

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer;
    try {
      renderer = new WebGLRenderer({
        canvas,
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
      });
    } catch {
      // No WebGL — the CSS background under the canvas is the graceful fallback.
      canvas.style.display = "none";
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(dpr);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new Vector2(1, 1) },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uMouseForce: { value: 0 },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
    };

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

    // Pointer (smoothed target + decaying force)
    const target = new Vector2(0.5, 0.5);
    const smooth = new Vector2(0.5, 0.5);
    let force = 0;
    const onPointer = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;
      target.set(x, y);
      force = 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const scrollProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(window.scrollY / max, 1) : 0;
    };

    let raf;
    let running = true;
    const start = performance.now();
    let scrollSmooth = 0;

    const render = (now) => {
      raf = requestAnimationFrame(render);
      if (!running) return;

      uniforms.uTime.value = (now - start) / 1000;

      smooth.lerp(target, 0.08);
      uniforms.uMouse.value.copy(smooth);
      force *= 0.94;
      uniforms.uMouseForce.value = force;

      uniforms.uReveal.value = revealRef ? revealRef.current : 1;

      scrollSmooth += (scrollProgress() - scrollSmooth) * 0.1;
      uniforms.uScroll.value = scrollSmooth;

      renderer.render(scene, camera);

      // Reduced motion: draw a single settled frame, then idle.
      if (reduced && uniforms.uReveal.value >= 0.999) running = false;
    };
    raf = requestAnimationFrame(render);

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [revealRef]);

  return <canvas ref={canvasRef} className="field-canvas" aria-hidden="true" />;
}
