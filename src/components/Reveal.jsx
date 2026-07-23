import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";

/**
 * Reveals its content on scroll. Without `stagger` it animates the wrapper;
 * with `stagger` it animates direct children (or `selector` matches).
 */
export default function Reveal({
  as: Tag = "div",
  children,
  className,
  stagger = 0,
  selector,
  y = 32,
  duration = 1,
  delay = 0,
  start = "top 85%",
  ...rest
}) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const targets =
      stagger > 0
        ? selector
          ? el.querySelectorAll(selector)
          : el.children
        : el;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        stagger: stagger || 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, selector, y, duration, delay, start]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
