import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";

let registered = false;

export function registerGsap() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
  registered = true;
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function prefersFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

let smootherInstance = null;

export function setSmoother(instance) {
  smootherInstance = instance;
}

export function getSmoother() {
  return smootherInstance;
}

export function scrollToHash(e, href) {
  const smoother = getSmoother();
  if (!smoother) return;
  e.preventDefault();
  smoother.scrollTo(href, true, "top top");
}

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };
