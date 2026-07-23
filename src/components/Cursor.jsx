import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsapSetup";

const IDLE_SIZE = 32;
const TARGET_PAD = 6;

export default function Cursor({
  targetSelector = ".cursor-target",
  spinDuration = 2.2,
  hoverDuration = 0.2,
}) {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const bracketRef = useRef(null);
  const spinTween = useRef(null);
  const locked = useRef(false);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;

    const cursor = cursorRef.current;
    const bracket = bracketRef.current;
    if (!cursor || !bracket) return undefined;

    gsap.set(cursor, { opacity: 0, x: 0, y: 0 });
    gsap.set(bracket, { xPercent: -50, yPercent: -50, width: IDLE_SIZE, height: IDLE_SIZE, rotation: 0 });

    const startSpin = () => {
      spinTween.current?.kill();
      spinTween.current = gsap.to(bracket, {
        rotation: "+=360",
        duration: spinDuration,
        repeat: -1,
        ease: "none",
      });
    };
    startSpin();

    const onEnter = () => gsap.to(cursor, { opacity: 1, duration: 0.2 });
    const onLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.2 });

    const onMove = (e) => {
      if (locked.current) return;
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.15, ease: "power3.out" });
    };

    const onTargetEnter = (target) => {
      locked.current = true;
      spinTween.current?.pause();
      const rect = target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      gsap.to(cursor, { x: centerX, y: centerY, duration: hoverDuration, ease: "power3.out" });
      gsap.to(bracket, {
        width: rect.width + TARGET_PAD * 2,
        height: rect.height + TARGET_PAD * 2,
        rotation: 0,
        duration: hoverDuration,
        ease: "power3.out",
      });
      cursor.classList.add("cursor--target");
    };

    const onTargetLeave = () => {
      locked.current = false;
      gsap.to(bracket, { width: IDLE_SIZE, height: IDLE_SIZE, duration: hoverDuration, ease: "power3.out" });
      cursor.classList.remove("cursor--target");
      startSpin();
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest?.(targetSelector);
      if (target) onTargetEnter(target);
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest?.(targetSelector);
      if (target && (!e.relatedTarget || !target.contains(e.relatedTarget))) onTargetLeave();
    };

    document.addEventListener("mouseenter", onEnter);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.documentElement.classList.add("has-custom-cursor");

    return () => {
      spinTween.current?.kill();
      gsap.killTweensOf([cursor, bracket]);
      document.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [targetSelector, spinDuration, hoverDuration]);

  return (
    <div ref={cursorRef} className="cursor" aria-hidden="true">
      <span ref={dotRef} className="cursor__dot" />
      <div ref={bracketRef} className="cursor__bracket">
        <span className="cursor__corner cursor__corner--0" />
        <span className="cursor__corner cursor__corner--1" />
        <span className="cursor__corner cursor__corner--2" />
        <span className="cursor__corner cursor__corner--3" />
      </div>
    </div>
  );
}
