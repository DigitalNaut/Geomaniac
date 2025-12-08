import type { CountryData } from "src/store/CountryStore/types";

export type IActivity = {
  nextCountry: () => CountryData | null;
  start: () => CountryData | null;
  finish: () => void;
  reset: () => void;
  resume: () => void;
};
