import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { cn } from "src/utils/styles";

type SpinnerProps = {
  message?: string;
  className?: string;
  cover?: true;
};

export function Spinner({ message, className, cover }: SpinnerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 text-white",
        { "absolute inset-0 flex size-full h-full items-center justify-center": cover },
        className,
      )}
    >
      <span>Loading {message}...</span>
      <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
    </div>
  );
}
