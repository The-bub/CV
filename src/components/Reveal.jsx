import { motion, useReducedMotion } from "motion/react";

export default function Reveal({ as: Tag = "div", className, children, ...rest }) {
  const MotionTag = motion[Tag];
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <MotionTag
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.3 }}
        {...rest}
      >
        {children}
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
