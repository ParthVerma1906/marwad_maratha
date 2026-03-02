import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
}

const MobileSectionTransition = ({ children, direction = "up", delay = 0 }: Props) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.08 });

  const initial = {
    opacity: 0,
    y: direction === "up" ? 30 : 0,
    x: direction === "left" ? -24 : direction === "right" ? 24 : 0,
  };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className="max-[480px]:will-change-transform md:!transform-none md:!opacity-100"
    >
      {children}
    </motion.div>
  );
};

export default MobileSectionTransition;
