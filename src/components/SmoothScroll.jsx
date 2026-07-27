import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { setLenis } from "../lib/scroll";
import { onMotionChange } from "../lib/motion";

/**
 * Sets up Lenis smooth scrolling and syncs it with GSAP ScrollTrigger.
 * `paused` keeps scroll locked while the loader is on screen. Reducing motion
 * tears Lenis down entirely so the browser's own scrolling takes over — hijacked
 * inertia is one of the things people asking for less motion want gone.
 */
export default function SmoothScroll({ paused, children }) {
  const lenisRef = useRef(null);
  const tickerRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const attach = () => {
      if (lenisRef.current || prefersReducedMotion()) return;

      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });
      lenisRef.current = lenis;
      setLenis(lenis);
      if (pausedRef.current) lenis.stop();

      lenis.on("scroll", ScrollTrigger.update);

      const ticker = (time) => lenis.raf(time * 1000);
      tickerRef.current = ticker;
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);
    };

    const detach = () => {
      if (!lenisRef.current) return;
      gsap.ticker.remove(tickerRef.current);
      lenisRef.current.destroy();
      lenisRef.current = null;
      tickerRef.current = null;
      setLenis(null);
      ScrollTrigger.refresh();
    };

    attach();
    const offMotion = onMotionChange((reduced) =>
      reduced ? detach() : attach(),
    );

    return () => {
      offMotion();
      detach();
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
