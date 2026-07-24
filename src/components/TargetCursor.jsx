import { useEffect, useRef } from "react";
import gsap from "gsap";

const IDLE_SIZE = 34;
const TARGET_PAD = 6;

export default function TargetCursor({
  containerRef,
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  cursorColor = "#f5f5f7",
  cursorColorOnTarget = "#ffffff",
}) {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const bracketRef = useRef(null);
  const spinTween = useRef(null);
  const locked = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const bracket = bracketRef.current;
    if (!container || !cursor || !bracket) return undefined;

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

    const onEnterContainer = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
      if (hideDefaultCursor) container.style.cursor = "none";
    };

    const onLeaveContainer = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
      if (hideDefaultCursor) container.style.cursor = "";
    };

    const onMove = (e) => {
      if (locked.current) return;
      const rect = container.getBoundingClientRect();
      gsap.to(cursor, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        duration: 0.15,
        ease: "power3.out",
      });
    };

    const onTargetEnter = (target) => {
      locked.current = true;
      spinTween.current?.pause();
      const rect = container.getBoundingClientRect();
      const tRect = target.getBoundingClientRect();
      const centerX = tRect.left - rect.left + tRect.width / 2;
      const centerY = tRect.top - rect.top + tRect.height / 2;

      gsap.to(cursor, { x: centerX, y: centerY, duration: hoverDuration, ease: "power3.out" });
      gsap.to(bracket, {
        width: tRect.width + TARGET_PAD * 2,
        height: tRect.height + TARGET_PAD * 2,
        rotation: 0,
        duration: hoverDuration,
        ease: "power3.out",
      });
      if (cursorColorOnTarget) {
        gsap.to(dot, { backgroundColor: cursorColorOnTarget, duration: hoverDuration });
      }
    };

    const onTargetLeave = () => {
      locked.current = false;
      gsap.to(bracket, { width: IDLE_SIZE, height: IDLE_SIZE, duration: hoverDuration, ease: "power3.out" });
      if (cursorColorOnTarget) {
        gsap.to(dot, { backgroundColor: cursorColor, duration: hoverDuration });
      }
      startSpin();
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest(targetSelector);
      if (target && container.contains(target)) onTargetEnter(target);
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest(targetSelector);
      if (target && (!e.relatedTarget || !target.contains(e.relatedTarget))) onTargetLeave();
    };

    container.addEventListener("mouseenter", onEnterContainer);
    container.addEventListener("mouseleave", onLeaveContainer);
    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      spinTween.current?.kill();
      gsap.killTweensOf([cursor, bracket, dot]);
      container.removeEventListener("mouseenter", onEnterContainer);
      container.removeEventListener("mouseleave", onLeaveContainer);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      if (hideDefaultCursor) container.style.cursor = "";
    };
  }, [containerRef, targetSelector, spinDuration, hideDefaultCursor, hoverDuration, cursorColor, cursorColorOnTarget]);

  return (
    <div ref={cursorRef} className="target-cursor" aria-hidden="true">
      <span ref={dotRef} className="target-cursor__dot" style={{ backgroundColor: cursorColor }} />
      <div ref={bracketRef} className="target-cursor__bracket">
        <span className="target-cursor__corner target-cursor__corner--0" style={{ borderColor: cursorColor }} />
        <span className="target-cursor__corner target-cursor__corner--1" style={{ borderColor: cursorColor }} />
        <span className="target-cursor__corner target-cursor__corner--2" style={{ borderColor: cursorColor }} />
        <span className="target-cursor__corner target-cursor__corner--3" style={{ borderColor: cursorColor }} />
      </div>
    </div>
  );
}
