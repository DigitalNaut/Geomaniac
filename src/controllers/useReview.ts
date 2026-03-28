import { useEffect } from "react";
import { useSearchParams } from "react-router";

import {
  addVisitedCountry,
  changeCurrentCountry,
  countryCatalog,
  popNextCountry,
  resetActivity,
  restartCountryQueue,
  selectCurrentCountryData,
} from "src/store/CountryStore/slice";
import type { CountryData } from "src/store/CountryStore/types";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import type { IActivity } from "./types";

const activityType = "review";

function useSearchParamsHandler() {
  const [searchParams, setURLSearchParams] = useSearchParams();

  const liftToSearchParams = (key: string, value: string) => {
    setURLSearchParams((prev) => {
      prev.set(key, value);
      return prev;
    });
  };

  const deleteFromSearchParams = (param: string) => {
    setURLSearchParams((prev) => {
      prev.delete(param);
      return prev;
    });
  };

  return { searchParams, liftToSearchParams, deleteFromSearchParams };
}

export function useReview(): IActivity & {
  setCurrentCountry: (a3: string) => CountryData | null;
} {
  const dispatch = useAppDispatch();
  const { searchParams, liftToSearchParams, deleteFromSearchParams } = useSearchParamsHandler();

  const currentCountrySelector = selectCurrentCountryData(activityType);
  const currentCountry = useAppSelector(currentCountrySelector);

  const nextCountry = () => {
    const countryCode = dispatch(popNextCountry(activityType));

    if (countryCode) {
      liftToSearchParams("country", countryCode.GU_A3);
      dispatch(addVisitedCountry({ countryCode: countryCode.GU_A3, activityType }));
    } else {
      deleteFromSearchParams("country");
    }

    return countryCode;
  };

  const setCurrentCountry = (countryA3: string) => {
    const countryData = dispatch(changeCurrentCountry({ countryCode: countryA3, activityType }));

    if (!countryData) return null;

    const countryInUrl = searchParams.get("country");

    if (countryInUrl !== countryData.GU_A3) {
      liftToSearchParams("country", countryData.GU_A3);
    }

    return countryData;
  };

  const reset = () => {
    deleteFromSearchParams("country");
    dispatch(resetActivity(activityType));
  };

  const start = () => {
    const countryInUrl = searchParams.get("country");

    if (currentCountry) {
      if (!countryInUrl) {
        liftToSearchParams("country", currentCountry.GU_A3);
      }
      return currentCountry;
    }

    if (!countryInUrl) {
      return nextCountry();
    }

    if (countryInUrl.length === 0) {
      return nextCountry();
    }

    if (!(countryInUrl in countryCatalog)) {
      return nextCountry();
    }

    return setCurrentCountry(countryInUrl);
  };

  const resume = () => {
    if (currentCountry) {
      liftToSearchParams("country", currentCountry.GU_A3);
    }
  };

  const restart = () => {
    deleteFromSearchParams("country");
    dispatch(restartCountryQueue(activityType));
    return nextCountry();
  };

  useEffect(function setCountryFromUrlOnPageLoad() {
    start();
  }, []);

  return {
    nextCountry,
    setCurrentCountry,
    start,
    reset,
    restart,
    resume,
  };
}
