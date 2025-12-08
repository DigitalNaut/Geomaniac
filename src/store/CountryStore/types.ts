import type countryData from "src/assets/data/features/country-features.json";
import type continentData from "src/assets/data/features/continent-features.json";

type ContinentFeatures = typeof continentData;
export type ContinentData = ContinentFeatures[number];
export type ContinentCatalog = Record<string, ContinentData>;
type CountryFeatures = typeof countryData;
export type CountryData = CountryFeatures[number];
export type CountryCatalog = Record<string, CountryData>;
export type CountriesByContinent = Record<string, string[]>;
