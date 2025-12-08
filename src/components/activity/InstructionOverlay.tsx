import type { Variants } from "motion/react";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";

const overlayVariants: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};

export default function InstructionOverlay({ children }: PropsWithChildren) {
  return (
    <motion.div
      className="absolute inset-0 z-1000 flex flex-col items-center justify-center rounded-lg bg-gray-900/5"
      key="instruction-overlay"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {children}
    </motion.div>
  );
}
