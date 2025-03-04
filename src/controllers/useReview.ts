import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";

import {
  addVisitedCountry,
  changeCurrentCountry,
  getNextCountry,
  resetActivity as resetActivityAction,
} from "src/store/CountryStore/slice";
import type { CountryData } from "src/store/CountryStore/types";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import type { IActivity } from "./types";

const activityType = "review";

export function useReview(): IActivity & {
  visitedCountries: string[];
  setCurrentCountry: (a3: string) => CountryData | null;
  reset: () => void;
} {
  const [searchParams, setURLSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const activityState = useAppSelector((state) => state.countryStore);
  const currentActivity = activityState[activityType];

  const liftToSearchParams = useCallback(
    (key: string, value: string) => {
      setURLSearchParams((prev) => {
        prev.set(key, value);
        return prev;
      });
    },
    [setURLSearchParams],
  );

  const isCountryInFilters = useCallback(
    (targetA3: string) => currentActivity.visitedCountries.includes(targetA3),
    [currentActivity.visitedCountries],
  );

  const nextCountry = useCallback(() => {
    const countryData = dispatch(getNextCountry(activityType));

    if (countryData) {
      liftToSearchParams("country", countryData.GU_A3);
      dispatch(addVisitedCountry({ countryA3: countryData.GU_A3, activityType }));
    }

    return countryData;
  }, [dispatch, liftToSearchParams]);

  const setCurrentCountry = useCallback(
    (countryA3: string) => {
      const countryData = dispatch(changeCurrentCountry({ countryA3, activityType }));

      if (!countryData) return null;

      liftToSearchParams("country", countryData.GU_A3);
      return countryData;
    },
    [dispatch, liftToSearchParams],
  );

  const visitedCountries = useMemo(() => {
    if (!currentActivity.currentCountry) return [];

    const filteredVisitedCountries = currentActivity.visitedCountries.filter((country) => isCountryInFilters(country));

    return [...filteredVisitedCountries, currentActivity.currentCountry.GU_A3];
  }, [currentActivity.currentCountry, currentActivity.visitedCountries, isCountryInFilters]);

  const deleteFromSearchParams = useCallback(
    (param: string) => {
      setURLSearchParams((prev) => {
        prev.delete(param);
        return prev;
      });
    },
    [setURLSearchParams],
  );

  const reset = useCallback(() => {
    dispatch(resetActivityAction(activityType));
    deleteFromSearchParams("country");
  }, [deleteFromSearchParams, dispatch]);

  const start = useCallback(() => {
    if (currentActivity.currentCountry) {
      return currentActivity.currentCountry;
    }

    const countryInUrl = searchParams.get("country");

    if (!countryInUrl) {
      return nextCountry();
    }

    if (countryInUrl.length === 0) {
      deleteFromSearchParams("country");

      return nextCountry();
    }

    if (isCountryInFilters(countryInUrl)) {
      return nextCountry();
    }

    return setCurrentCountry(countryInUrl);
  }, [
    currentActivity.currentCountry,
    searchParams,
    isCountryInFilters,
    setCurrentCountry,
    nextCountry,
    deleteFromSearchParams,
  ]);

  const finish = useCallback(() => {
    deleteFromSearchParams("country");
  }, [deleteFromSearchParams]);

  const resume = useCallback(() => {
    if (currentActivity.currentCountry) liftToSearchParams("country", currentActivity.currentCountry.GU_A3);
  }, [currentActivity.currentCountry, liftToSearchParams]);

  useEffect(
    function setCountryFromUrl() {
      const countryInUrl = searchParams.get("country");
      if (countryInUrl) start();
    },
    [searchParams, start],
  );

  return {
    nextCountry,
    setCurrentCountry,
    start,
    finish,
    visitedCountries,
    reset,
    resume,
  };
}
