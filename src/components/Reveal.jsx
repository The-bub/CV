import { motion, useReducedMotion } from "motion/react";

export default function Reveal({ as: Tag = "div", className, children, ...rest }) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[Tag];

  if (shouldReduceMotion) {
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
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
