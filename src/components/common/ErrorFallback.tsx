import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ErrorFallbackProps = {
  error: Error;
  resetErrorBoundary: () => void;
};

export default function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex h-screen flex-1 items-center justify-center bg-slate-900 p-6 text-white">
      <div
        role="alert"
        className="flex h-fit w-full max-w-full flex-col flex-wrap gap-2 overflow-auto rounded-lg bg-slate-800 p-4 shadow-md sm:w-2/3 md:w-1/2"
      >
        <h2 className="text-lg font-bold">Something went wrong:</h2>
        <div className="flex w-full gap-2 rounded-md bg-slate-900 p-2">
          <span>
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </span>
          <code>{error.message}</code>
        </div>
        <pre className="max-h-[75vh] max-w-full shrink overflow-auto text-clip">{error.stack}</pre>
        <button
          className="rounded-md bg-red-500 p-2 font-semibold hover:bg-red-400"
          role="button"
          onClick={resetErrorBoundary}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
