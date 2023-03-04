import type { Feature } from "geojson";
import type { LatLngTuple } from "leaflet";
import { useState } from "react";

import type { CountryData } from "src/controllers/MapController";
import {
  getCountryGeometry,
  getCountryData,
} from "src/controllers/MapController";
import { useMapContext } from "src/contexts/MapContext";

function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

function getCountryCoordinates(country: CountryData) {
  if (!country) return null;
  return [country.latitude, country.longitude] as LatLngTuple;
}

/**
 * Normalizes a name by removing diacritics and trimming whitespace.
 */
export function normalizeName(text?: string) {
  return text
    ?.trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export function useCountryGuess() {
  const { countryAnswer, setCountryAnswer } = useMapContext();
  const [countryFeature, setCountryFeature] = useState<Feature>();

  function getRandomCountryData(): CountryData {
    const { country, countryIndex } = getCountryData(randomIndex);

    if (!country) throw new Error(`No country found for index ${countryIndex}`);

    const feature = getCountryGeometry(country.alpha3);

    if (feature) setCountryFeature(feature);
    else throw new Error(`No feature found for ${country.name}`);

    setCountryAnswer(country);

    return country;
  }

  const checkAnswer = (userInput: string) => {
    const correctAnswer = countryAnswer?.name || "";
    const inputMatchesAnswer =
      normalizeName(userInput) === normalizeName(correctAnswer);

    return inputMatchesAnswer;
  };

  return {
    countryCorrectAnswer: {
      data: countryAnswer,
      feature: countryFeature,
      coordinates: getCountryCoordinates(countryAnswer),
    },
    getRandomCountryData,
    checkAnswer,
  };
}
