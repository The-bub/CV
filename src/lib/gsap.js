import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Passe à `true` pour respecter le réglage "réduire les animations" du système.
// Volontairement `false` : beaucoup de PC (surtout Windows) signalent
// reduce-motion par défaut, ce qui masquait le loader et toutes les animations.
// Le propriétaire veut l'expérience animée complète sur toutes les machines.
const HONOUR_REDUCED_MOTION = false;

export const prefersReducedMotion = () =>
  HONOUR_REDUCED_MOTION &&
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
