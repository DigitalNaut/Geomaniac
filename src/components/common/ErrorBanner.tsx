import { type PropsWithChildren } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

type ErrorBannerProps = PropsWithChildren<{
  error: Error;
}>;

function ErrorBanner({ error, children }: ErrorBannerProps) {
  return (
    <div className="flex w-full flex-0 justify-center bg-red-800 p-2 text-white">
      <div className="flex gap-6">
        {error.message}
        {children}
      </div>
    </div>
  );
}

type ButtonProps = {
  dismissError: () => void;
};

ErrorBanner.Button = function Button({ dismissError }: ButtonProps) {
  return (
    <button role="button" title="Dismiss" onClick={dismissError}>
      <FontAwesomeIcon icon={faTimes} />
    </button>
  );
};

export default ErrorBanner;
