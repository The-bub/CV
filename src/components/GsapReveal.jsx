import { useEffect, useRef } from "react";
import { gsap, registerGsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsapSetup";

export default function GsapReveal({ as: Tag = "span", className, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;

    registerGsap();
    gsap.set(el, { yPercent: 100, opacity: 0 });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(el, { yPercent: 0, opacity: 1, duration: 0.9, ease: "power4.out" });
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <Tag className={className ? `gsap-reveal ${className}` : "gsap-reveal"} ref={ref}>
      {children}
    </Tag>
  );
}
