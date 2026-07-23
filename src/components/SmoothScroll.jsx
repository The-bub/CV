import { useLayoutEffect, useRef } from "react";
import {
  registerGsap,
  ScrollSmoother,
  prefersReducedMotion,
  setSmoother,
} from "../lib/gsapSetup";

export default function SmoothScroll({ children }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  useLayoutEffect(() => {
    registerGsap();

    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReducedMotion() || coarsePointer) {
      return undefined;
    }

    const wrapper = wrapperRef.current;
    const smoother = ScrollSmoother.create({
      wrapper,
      content: contentRef.current,
      smooth: 1.15,
      smoothTouch: 0,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    wrapper.classList.add("smooth-active");
    setSmoother(smoother);

    return () => {
      setSmoother(null);
      smoother.kill();
      wrapper.classList.remove("smooth-active");
    };
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
