import { useEffect } from "react";

import { useHeaderControllerContext } from "./context";
import type { Callback } from "./types";

export function useHeaderController(callback?: Callback) {
  const { clickCallbackRef } = useHeaderControllerContext();

  useEffect(() => {
    if (!callback) return undefined;

    clickCallbackRef.current = callback;
    return () => {
      clickCallbackRef.current = undefined;
    };
  }, [callback, clickCallbackRef]);

  return { clickCallback: clickCallbackRef };
}
