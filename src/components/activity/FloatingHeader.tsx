import type { Variants } from "motion/react";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";

const headerVariants: Variants = {
  hidden: { opacity: 0, translateY: -50 },
  visible: { opacity: 1, translateY: 0 },
};

export default function FloatingHeader({
  imageSrc,
  children,
}: PropsWithChildren<{
  imageSrc?: string;
}>) {
  return (
    <motion.div
      className="absolute inset-x-0 top-4 z-1000 mx-auto flex w-fit min-w-min items-center gap-2 sm:min-w-max"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <h1 className="flex gap-2 rounded-xl bg-slate-800 px-4 py-2 text-center text-lg shadow-md md:text-2xl">
        {imageSrc && <img src={imageSrc} width={42} height={42} />}
        {children}
      </h1>
    </motion.div>
  );
}
