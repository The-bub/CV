import { useEffect, useRef } from "react";
import * as THREE from "three";
import { registerGsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsapSetup";
import { INSTRUMENT_VERTEX, INSTRUMENT_FRAGMENT } from "./shaders";
import { HeroSceneFallback } from "./HeroSceneFallback";

function readColor(styles, name, fallback) {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

export default function InstrumentField() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const probe = document.createElement("canvas");
    const hasWebGL2 = !!probe.getContext("webgl2");
    if (prefersReducedMotion() || !hasWebGL2) return undefined;

    registerGsap();

    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const segments = isMobile ? 60 : 130;
    const maxDPR = isMobile ? 1.5 : 2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 20);
    camera.position.set(0, 1.3, 3.15);
    camera.lookAt(0, -0.15, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    container.classList.add("hero__scene--live");

    const geometry = new THREE.PlaneGeometry(6.4, 6.4, segments, segments);

    const styles = getComputedStyle(document.documentElement);
    const uniforms = {
      uTime: { value: 0 },
      uLineColor: { value: new THREE.Color(readColor(styles, "--text", "#161513")) },
      uFogColor: { value: new THREE.Color(readColor(styles, "--scene-fog", "#f3f1ec")) },
      uSignalColor: { value: new THREE.Color(readColor(styles, "--accent", "#96381f")) },
      uMarker: { value: new THREE.Vector2(0.78, 0.6) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: INSTRUMENT_VERTEX,
      fragmentShader: INSTRUMENT_FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
    });
    material.extensions = { derivatives: true };

    const mesh = new THREE.Mesh(geometry, material);
    const baseRotationX = -1.2;
    mesh.rotation.x = baseRotationX;
    mesh.position.y = -0.85;
    mesh.position.z = -0.4;
    scene.add(mesh);

    const pointer = { x: 0, y: 0 };
    const pointerTarget = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDPR));
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    let hidden = document.hidden;
    const onVisibility = () => {
      hidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const startTime = performance.now();
    let rafId = requestAnimationFrame(tick);
    function tick() {
      rafId = requestAnimationFrame(tick);
      if (hidden) return;
      const t = (performance.now() - startTime) / 1000;
      uniforms.uTime.value = t;

      pointer.x += (pointerTarget.x - pointer.x) * 0.02;
      pointer.y += (pointerTarget.y - pointer.y) * 0.02;
      mesh.rotation.x = baseRotationX + pointer.y * 0.055 + Math.sin(t * 0.08) * 0.015;
      mesh.rotation.z = pointer.x * -0.045 + Math.sin(t * 0.06) * 0.01;

      renderer.render(scene, camera);
    }

    const onThemeChange = () => {
      const s = getComputedStyle(document.documentElement);
      uniforms.uLineColor.value.set(readColor(s, "--text", "#161513"));
      uniforms.uFogColor.value.set(readColor(s, "--scene-fog", "#f3f1ec"));
      uniforms.uSignalColor.value.set(readColor(s, "--accent", "#96381f"));
    };
    const themeObserver = new MutationObserver(onThemeChange);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let scrollTrigger;
    const heroEl = container.closest(".hero");
    if (heroEl) {
      scrollTrigger = ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          container.style.opacity = String(1 - self.progress * 0.9);
          container.style.transform = `scale(${1 + self.progress * 0.06})`;
        },
      });
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      scrollTrigger?.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.classList.remove("hero__scene--live");
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="hero__scene" ref={containerRef}>
      <HeroSceneFallback />
    </div>
  );
}
