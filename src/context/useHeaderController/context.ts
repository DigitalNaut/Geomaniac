import { createContext, use } from "react";

import type { HeaderControllerContextType } from "./types";

export const UserSettingsContext = createContext<HeaderControllerContextType | null>(null);

export function useHeaderControllerContext() {
  const context = use(UserSettingsContext);
  if (!context) throw new Error("useHeaderControllerContext must be used within a HeaderControllerProvider");

  return context;
}
