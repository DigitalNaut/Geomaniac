import type { Variants } from "motion/react";
import { motion } from "motion/react";

import { useSvgAttributes } from "src/hooks/common/useSVGAttributes";

import continentsSvg from "src/assets/images/generated/continents-world-map.svg?raw";

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1 },
};

export default function ContinentSelectionOverlay({ onClick }: { onClick: (id: string) => void }) {
  const { paths, viewBox } = useSvgAttributes(continentsSvg, ["width", "height", "viewBox"]);

  return (
    <motion.div
      className="absolute inset-0 z-1000 flex items-center justify-center bg-slate-900/90"
      variants={overlayVariants}
      initial="hidden"
      animate="shown"
      exit="hidden"
    >
      <section className="flex size-fit max-w-(--breakpoint-sm) flex-col items-center gap-2 rounded-2xl bg-sky-800/25 p-3 shadow-md backdrop-blur-md">
        <h2 className="text-center text-2xl font-bold">Choose a region</h2>
        <span>Select a continent to review:</span>
        <div className="flex flex-col items-center justify-center gap-4 text-center">
            <svg viewBox={viewBox} className="size-full" width="100%" height="auto">
              {paths.map((path) => (
                <path
                  className="fill-sky-700 hover:cursor-pointer hover:fill-sky-500 active:fill-sky-600"
                  key={path.id}
                  onMouseUp={() => onClick(path.id)}
                  d={path.getAttribute("d") ?? ""}
                />
              ))}
            </svg>
        </div>
      </section>
    </motion.div>
  );
}
