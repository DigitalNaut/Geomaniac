import type { LatLngTuple } from "leaflet";

import type featuresData from "src/assets/data/features-data.json";
import { useCountryStoreContext } from "src/contexts/CountryStoreContext";
import { useCountryFiltersContext } from "src/contexts/CountryFiltersContext";

export type CountryDataList = typeof featuresData;
export type CountryData = CountryDataList[number];
export type NullableCountryData = CountryData | null;

function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function normalizeName(text?: string) {
  return text
    ?.trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function getCountryCoordinates(country: CountryData): LatLngTuple {
  return [country.LABEL_Y, country.LABEL_X];
}

export function useCountryStore() {
  const { storedCountry, setStoredCountry } = useCountryStoreContext();
  const { continentFilters, toggleContinentFilter, countryDataByContinent, filteredCountryData } =
    useCountryFiltersContext();

  function setCountryDataNext(): NullableCountryData {
    if (!filteredCountryData.length) return null;

    const countryIndex = filteredCountryData.findIndex((country) => country?.GU_A3 === storedCountry?.GU_A3);
    const country = filteredCountryData[(countryIndex + 1) % filteredCountryData.length];

    if (!country) return null;

    setStoredCountry(country);

    return country;
  }

  function setCountryDataRandom(): NullableCountryData {
    if (!filteredCountryData.length) return null;

    const countryIndex = randomIndex(filteredCountryData.length);
    const country = filteredCountryData[countryIndex];

    if (!country) return null;

    setStoredCountry(country);

    return country;
  }

  function setCountryDataByCode(a3?: string): NullableCountryData {
    if (!filteredCountryData.length || !a3) return null;

    const country = filteredCountryData.find((country) => country.GU_A3 === a3);

    if (!country) return null;

    setStoredCountry(country);

    return country;
  }

  const compareStoredCountry = (countryName: string) => {
    const correctAnswer = storedCountry?.GEOUNIT || "";
    const inputMatchesAnswer = normalizeName(countryName) === normalizeName(correctAnswer);

    return inputMatchesAnswer;
  };

  const resetStore = () => setStoredCountry(null);

  return {
    storedCountry: {
      data: storedCountry,
      coordinates: storedCountry ? getCountryCoordinates(storedCountry) : null,
    },
    setCountryDataNext,
    setCountryDataRandom,
    setCountryDataByCode,
    compareStoredCountry,
    resetStore,
    toggleContinentFilter,
    continentFilters,
    countryDataByContinent,
    filteredCountryData,
  };
}
