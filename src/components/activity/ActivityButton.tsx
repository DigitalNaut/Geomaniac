import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ReactNode } from "react";

import { cn } from "src/utils/styles";

const activityButtonStyles = {
  review: "hover:bg-linear-to-br hover:from-lime-700/90 hover:to-lime-800/90 hover:text-white",
  quiz: "hover:bg-linear-to-br hover:from-yellow-700/90 hover:to-yellow-800/90 hover:text-white",
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
        "group flex w-full max-w-full min-w-max cursor-pointer items-center justify-center gap-6 bg-white/65 p-10 text-slate-800 outline outline-slate-200/0 backdrop-blur-md first:rounded-t-2xl last:rounded-b-2xl hover:outline-slate-200/15",
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
      <FontAwesomeIcon icon={faChevronRight} className="text-3xl text-white/10 group-hover:text-white/30" />
    </button>
  );
}
