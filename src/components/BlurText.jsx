import { motion } from "motion/react";

export default function BlurText({
  text,
  as: Tag = "span",
  className,
  delay = 80,
  startDelay = 0,
  stepDuration = 0.35,
  direction = "top",
}) {
  const words = text.split(" ");
  const MotionTag = motion[Tag];
  const y = direction === "top" ? -20 : 20;

  return (
    <MotionTag className={className}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{ display: "inline-block", willChange: "filter, transform, opacity" }}
          initial={{ opacity: 0, filter: "blur(10px)", y }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: stepDuration, delay: startDelay / 1000 + (i * delay) / 1000 }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}
