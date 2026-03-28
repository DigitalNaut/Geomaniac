import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

import { cn } from "src/utils/styles";

const activityButtonStyles = {
  review: "hover:bg-linear-to-br hover:text-lime-700 hover:text-shadow-lime-400/15",
  quiz: "hover:bg-linear-to-br hover:text-yellow-700 hover:text-shadow-yellow-400/15",
  base: "bg-white/85 hover:bg-white text-slate-800 outline outline-slate-200/0 hover:outline-slate-200/15 backdrop-blur-md hover:text-shadow-lg",
};

export function ActivityButton({
  type,
  icon,
  label,
  summary,
  onClick,
}: {
  type: keyof typeof activityButtonStyles;
  icon: ReactNode;
  label: ReactNode;
  summary?: ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      role="button"
      className={cn(
        "group flex w-full cursor-pointer items-center justify-center gap-6 py-10 pl-10 transition-colors duration-100",
        activityButtonStyles.base,
        activityButtonStyles[type],
      )}
      onClick={onClick}
    >
      <div className="flex gap-8">
        <span className="text-4xl">{icon}</span>
        <div className="flex flex-col items-start gap-1">
          <span className="text-xl">{label}</span>
          <span className="italic opacity-80">{summary}</span>
        </div>
      </div>
      <FontAwesomeIcon
        icon={faChevronRight}
        className="px-5 text-3xl text-white/10 group-hover:animate-pulse group-hover:text-black/15"
      />
    </button>
  );
}
