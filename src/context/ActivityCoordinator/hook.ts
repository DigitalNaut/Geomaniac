import type { RefObject } from "react";
import { createContext, useContext } from "react";

import type { ActivityState } from "src/store/CountryStore/slice";
import type { CountryData } from "src/store/CountryStore/types";

type ActivityCoordinatorContextType = {
  inputRef: RefObject<HTMLInputElement | null>;
  giveHint: () => void;
  handleMapClick: (a3?: string) => void;
  setContinent: (continent: string) => void;
  visitedCountries: string[];
  unvisitedCountries: string[];
  currentActivityState: ActivityState | null;
  setCurrentCountry: (a3: string) => void;
  guessTally: number;
  nextCountry: () => CountryData | null;
  submitAnswer: () => CountryData | null;
  reset: () => void;
};

export const ActivityCoordinatorContext = createContext<ActivityCoordinatorContextType | null>(null);

export function useActivityCoordinatorContext() {
  const context = useContext(ActivityCoordinatorContext);

  if (!context) {
    throw new Error("'useActivityCoordinatorContext' must be used within a 'ActivityCoordinatorProvider'");
  }

  return context;
}
