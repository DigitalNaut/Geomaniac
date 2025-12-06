import { useEffect } from "react";
import { useSearchParams } from "react-router";

import {
  addVisitedCountry,
  changeCurrentCountry,
  countryCatalog,
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

  const liftToSearchParams = (key: string, value: string) => {
    setURLSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };

  const isVisitedCountry = (targetA3: string) => currentActivity.visitedCountries.includes(targetA3);

  const nextCountry = () => {
    const countryData = dispatch(getNextCountry(activityType));

    if (countryData) {
      liftToSearchParams("country", countryData.GU_A3);
      dispatch(addVisitedCountry({ countryA3: countryData.GU_A3, activityType }));
    }

    return countryData;
  };

  const setCurrentCountry = (countryA3: string) => {
    const countryData = dispatch(changeCurrentCountry({ countryA3, activityType }));

    if (!countryData) return null;

    const countryInUrl = searchParams.get("country");

    if (countryInUrl !== countryData.GU_A3) {
      liftToSearchParams("country", countryData.GU_A3);
    }

    return countryData;
  };

  const visitedCountries = !currentActivity.currentCountry
    ? []
    : [
        ...currentActivity.visitedCountries.filter((country) => isVisitedCountry(country)),
        currentActivity.currentCountry.GU_A3,
      ];

  const deleteFromSearchParams = (param: string) => {
    setURLSearchParams((prev) => {
      prev.delete(param);
      return prev;
    });
  };

  const reset = () => {
    deleteFromSearchParams("country");
    dispatch(resetActivityAction(activityType));
  };

  const start = () => {
    const countryInUrl = searchParams.get("country");

    if (currentActivity.currentCountry) {
      if (!countryInUrl) {
        liftToSearchParams("country", currentActivity.currentCountry.GU_A3);
      }
      return currentActivity.currentCountry;
    }

    if (!countryInUrl) {
      return nextCountry();
    }

    if (countryInUrl.length === 0) {
      deleteFromSearchParams("country");
      return nextCountry();
    }

    if (!(countryInUrl in countryCatalog)) {
      deleteFromSearchParams("country");
      return nextCountry();
    }

    return setCurrentCountry(countryInUrl);
  };

  const finish = () => {
    deleteFromSearchParams("country");
  };

  const resume = () => {
    if (currentActivity.currentCountry) liftToSearchParams("country", currentActivity.currentCountry.GU_A3);
  };

  useEffect(function setCountryFromUrlOnPageLoad() {
    start();
  }, []);

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
