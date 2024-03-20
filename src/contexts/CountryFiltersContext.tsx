import { type PropsWithChildren, createContext, useContext, useMemo, useState } from "react";

import { type CountryDataList } from "src/hooks/useCountryStore";
import continents from "src/assets/data/continents.json";
import allCountriesMetadata from "src/assets/data/country-metadata.json";

const countryDataByContinent = allCountriesMetadata.reduce(
  (groups, country) => {
    const { cont: continent } = country;

    groups[continent] ??= [];
    groups[continent].push(country);

    return groups;
  },
  {} as Record<string, CountryDataList>,
);

const initialContinentFilters = Object.fromEntries(continents.map((continent) => [continent, true]));

export type CountryFilters = typeof initialContinentFilters;

function useFilteredCountryData() {
  const [continentFilters, setContinentFilters] = useState(initialContinentFilters);

  const filteredCountryData = useMemo(
    () =>
      allCountriesMetadata.filter((country) => {
        const { cont: continent } = country || {};
        return continent && continentFilters[continent];
      }),
    [continentFilters],
  );

  const toggleContinentFilter = (continent: string, toggle: boolean) => {
    setContinentFilters((currentFilters) => ({
      ...currentFilters,
      [continent]: toggle,
    }));
  };

  const isCountryInFilters = (a3: string) => {
    const country = allCountriesMetadata.find((country) => country.a3 === a3);
    if (!country) return false;

    const { cont: continent } = country;
    return continent && continentFilters[continent];
  };

  return {
    toggleContinentFilter,
    continentFilters,
    countryDataByContinent,
    filteredCountryData,
    isCountryInFilters,
  };
}

const filteredCountryDataContext = createContext<ReturnType<typeof useFilteredCountryData> | null>(null);

export default function CountryFiltersProvider({ children }: PropsWithChildren) {
  const filteredCountryData = useFilteredCountryData();

  return (
    <filteredCountryDataContext.Provider value={filteredCountryData}>{children}</filteredCountryDataContext.Provider>
  );
}

export function useCountryFiltersContext() {
  const context = useContext(filteredCountryDataContext);
  if (!context) throw new Error("useCountryFiltersContext must be used within a CountryFiltersProvider");

  return context;
}
