import type { RefObject } from "react";
import { createContext, use } from "react";

import type { CountryData } from "src/store/CountryStore/types";

type ActivityCoordinatorContextType = {
  inputRef: RefObject<HTMLInputElement | null>;
  giveHint: () => void;
  handleMapClick: (a3?: string) => void;
  setContinent: (continent: string) => void;
  visitedCountries: string[];
  unvisitedCountries: string[];
  setCurrentCountry: (a3: string) => void;
  guessTally: number;
  nextCountry: () => void;
  submitAnswer: () => CountryData | null;
  reset: () => void;
  restart: () => void;
};

export const ActivityCoordinatorContext = createContext<ActivityCoordinatorContextType | null>(null);

export function useActivityCoordinatorContext() {
  const context = use(ActivityCoordinatorContext);

  if (!context) {
    throw new Error("'useActivityCoordinatorContext' must be used within a 'ActivityCoordinatorProvider'");
  }

  return context;
}
