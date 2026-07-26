import { useLayoutEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { onMotionChange } from "../lib/motion";

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

    // Changing the motion preference mid-visit must never leave content
    // stranded at opacity 0 — in either direction. `ctx.revert()` does not undo
    // the `gsap.set()` above, so the inline props are cleared explicitly and the
    // content falls back to its visible CSS state. Reveals are deliberately not
    // re-armed: re-hiding text the visitor has already read to replay an
    // entrance would be worse than simply leaving it on screen.
    const offMotion = onMotionChange(() => {
      ctx.revert();
      gsap.set(targets, { clearProps: "all" });
    });

    return () => {
      offMotion();
      ctx.revert();
    };
  }, [stagger, selector, y, duration, delay, start]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
