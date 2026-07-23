// Tiny holder so any component can drive the shared Lenis instance
// (nav anchors, "back to top", etc.) without prop-drilling.
let lenis = null;

export const setLenis = (l) => {
  lenis = l;
};

export const scrollTo = (target, opts = {}) => {
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.2, offset: 0, ...opts });
  } else if (typeof target === "string") {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
};
