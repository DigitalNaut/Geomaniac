import { type PropsWithChildren } from "react";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twJoin, twMerge } from "tailwind-merge";

export function ActivityButton({
  label,
  children,
  onClick,
  className,
}: PropsWithChildren<{
  label?: string;
  onClick: () => void;
  className?: string;
}>) {
  return (
    <button
      role="button"
      className={twJoin(
        "flex shrink max-w-[40ch] w-max items-center justify-center gap-4 rounded-lg p-6 shadow-l",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">{label}</h2>
        {children}
      </div>
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  );
}

export function ActivitySection({ children, className }: PropsWithChildren<{ label?: string; className?: string }>) {
  return (
    <div
      className={twMerge(
        "flex justify-center h-full w-full shrink gap-3 items-center hover:bg-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
}
