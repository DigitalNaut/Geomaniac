import { useQuiz } from "src/controllers/useQuiz";
import {
  addVisitedCountry,
  popNextCountry,
  resetActivity,
  selectCurrentCountryData,
} from "src/store/CountryStore/slice";
import type { CountryData } from "src/store/CountryStore/types";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import type { IActivity } from "./types";

import allFeaturesData from "src/assets/data/features/country-features.json";

const activityType = "quiz";

export function useQuizClick(): IActivity & {
  giveHint: () => void;
  submitClick: (a3: string) => CountryData | null;
  userGuessTally: number;
} {
  const { submitAnswer, userGuessTally, resetTally } = useQuiz();
  const currentCountry = useAppSelector(selectCurrentCountryData("quiz"));

  const dispatch = useAppDispatch();

  const giveHint = () => {
    if (currentCountry) {
      // TODO: Add a better way to provide hints
    }
  };

  const submitClick = (a3: string) => {
    const unitName = allFeaturesData.find((data) => data.GU_A3 === a3)?.GEOUNIT;
    if (!unitName) return null;

    const isCorrect = submitAnswer(unitName);

    if (!isCorrect) return null;

    // TODO: Styling based on score needs to be reimplemented
    // const style = qualifyScore(userGuessTally);

    dispatch(addVisitedCountry({ countryCode: a3, activityType }));
    return dispatch(popNextCountry(activityType));
  };

  const nextCountry = () => {
    resetTally();
    return dispatch(popNextCountry(activityType));
  };

  const start = () => nextCountry();

  const reset = () => {
    resetTally();
    dispatch(resetActivity(activityType));
  };

  const resume = () => void 0;

  const restart = () => {
    resetTally();
    dispatch(resetActivity(activityType));
    return nextCountry();
  };

  return {
    giveHint,
    submitClick,
    userGuessTally,
    nextCountry,
    start,
    reset,
    resume,
    restart,
  };
}
