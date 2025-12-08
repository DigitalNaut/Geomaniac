import { createContext, useContext } from "react";

import type { HeaderControllerContextType } from "./types";

export const UserSettingsContext = createContext<HeaderControllerContextType | null>(null);

export function useHeaderControllerContext() {
  const context = useContext(UserSettingsContext);
  if (!context) throw new Error("useHeaderControllerContext must be used within a HeaderControllerProvider");

  return context;
}
