import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isReduced } from "./motion";

gsap.registerPlugin(ScrollTrigger);

// L'expérience animée reste le défaut sur toutes les machines : le réglage
// système n'est pas consulté, c'est le visiteur qui décide via le bouton
// « Animations » (voir lib/motion.js). Le nom d'origine est conservé pour que
// tous les points d'entrée d'animation passent par la même porte.
export const prefersReducedMotion = () => isReduced();

export { gsap, ScrollTrigger };
