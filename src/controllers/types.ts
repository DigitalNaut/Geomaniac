import type { CountryData } from "src/store/CountryStore/types";

export type IActivity = {
  nextCountry: () => CountryData | null;
  start: () => CountryData | null;
  restart: () => CountryData | null;
  reset: () => void;
  resume: () => void;
};
