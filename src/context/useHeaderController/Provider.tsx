import type { PropsWithChildren } from "react";
import { useRef } from "react";

import { UserSettingsContext } from "./context";
import type { Callback } from "./types";

export function HeaderControllerProvider({ children }: PropsWithChildren) {
  const clickCallbackRef = useRef<Callback>(undefined);

  return (
    <UserSettingsContext
      value={{
        clickCallbackRef,
      }}
    >
      {children}
    </UserSettingsContext>
  );
}
