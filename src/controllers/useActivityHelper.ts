import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import {
  type CountryData,
  type NullableCountryData,
  getCountryCoordinates,
  useCountryStore,
} from "src/hooks/useCountryStore";
import { useMapViewport } from "src/hooks/useMapViewport";
import { useMapActivityContext } from "src/contexts/MapActivityContext";

/**
 * This hook helps by providing a way to automatically focus the UI when the activity changes and there are countries to show.
 * @param activityMode Whether to activate the hook or not.
 */
export default function useActivityHelper(setError: (error: Error) => void) {
  const { flyTo, resetView } = useMapViewport();
  const [searchParams, setURLSearchParams] = useSearchParams();
  const { activity, isRandomReviewMode } = useMapActivityContext();
  const {
    storedCountry,
    setCountryDataNext,
    setCountryDataRandom,
    setCountryDataByCode,
    filteredCountryData,
    resetStore,
  } = useCountryStore();

  /**
   * Focuses the UI on the next country by
   * 1. Getting the next country data
   * 2. Setting the URL search params
   * 3. Flying to the country
   */
  const focusUI = useCallback(
    (nextCountry?: CountryData) => {
      const countryData = nextCountry ?? storedCountry.data;
      if (!countryData) return;

      const destination = getCountryCoordinates(countryData);
      setURLSearchParams((prev) => {
        if (activity?.mode === "review") prev.set("country", countryData.a3);
        else prev.delete("country");
        return prev;
      });
      flyTo(destination);
    },
    [activity?.mode, flyTo, setURLSearchParams, storedCountry.data],
  );

  const resetUI = useCallback(() => {
    setURLSearchParams((prev) => {
      prev.delete("country");
      return prev;
    });
  }, [setURLSearchParams]);

  const showNextCountry = () => {
    try {
      const nextCountry =
        activity?.mode === "quiz" || isRandomReviewMode ? setCountryDataRandom() : setCountryDataNext();
      if (nextCountry) focusUI(nextCountry);
      return nextCountry;
    } catch (error) {
      if (error instanceof Error) setError(error);
      else setError(new Error("An unknown error occurred."));
    }
    return null;
  };

  const handleMapClick = (a3?: string) => {
    if (activity && activity.mode === "quiz" && activity.kind === "typing") {
      focusUI();
      return;
    }

    if (!a3) return;

    setURLSearchParams((prev) => {
      prev.set("country", a3);
      return prev;
    });
  };

  useEffect(() => {
    if (!activity) return;

    const countryParam = searchParams.get("country");

    if (!storedCountry.data) {
      if (filteredCountryData.length === 0) {
        resetView();
        return;
      }

      let countryData: NullableCountryData = null;

      if (activity.mode === "review") {
        if (countryParam) countryData = setCountryDataByCode(countryParam);
        else countryData = isRandomReviewMode ? setCountryDataRandom() : setCountryDataNext();
      } else if (activity.mode === "quiz") countryData = setCountryDataRandom();

      if (countryData) focusUI(countryData);
      else resetUI();
    } else {
      if (filteredCountryData.length === 0 || !filteredCountryData.includes(storedCountry.data)) {
        resetStore();
        resetUI();
      } else if (countryParam && countryParam !== storedCountry.data.a3) {
        const countryData = setCountryDataByCode(countryParam);
        if (countryData) focusUI(countryData);
      }
    }
  }, [
    activity,
    filteredCountryData,
    focusUI,
    isRandomReviewMode,
    resetStore,
    resetUI,
    resetView,
    searchParams,
    setCountryDataByCode,
    setCountryDataNext,
    setCountryDataRandom,
    storedCountry.data,
  ]);

  return {
    showNextCountry,
    handleMapClick,
  };
}
