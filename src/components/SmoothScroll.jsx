import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { setLenis } from "../lib/scroll";

/**
 * Sets up Lenis smooth scrolling and syncs it with GSAP ScrollTrigger.
 * `paused` keeps scroll locked while the loader is on screen.
 */
export default function SmoothScroll({ paused, children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // native scroll, respect the setting

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    setLenis(lenis);
    if (paused) lenis.stop();

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [paused]);

  return children;
}
