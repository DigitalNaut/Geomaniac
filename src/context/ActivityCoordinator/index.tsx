import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo } from "react";

import { useActivityTracker, useMapActivityContext } from "src/context/MapActivity/hook";
import { useQuizClick } from "src/controllers/useQuizClick";
import { useQuizInput } from "src/controllers/useQuizInput";
import { useReview } from "src/controllers/useReview";
import { useMapViewport } from "src/hooks/useMapViewport";
import {
  continentBoundsCatalog,
  countriesByContinent,
  countryCatalog,
  createNewQueue,
  selectCurrentContinent,
  selectCurrentCountryData,
} from "src/store/CountryStore/slice";
import type { CountryData } from "src/store/CountryStore/types";
import { useAppDispatch, useAppSelector } from "src/store/hooks";
import type { ActivityType } from "src/types/map-activity";
import { getLabelCoordinates } from "src/utils/features";
import { ActivityCoordinatorContext } from "./hook";
import type { StrategyFactory } from "./types";

type ActivityKindStrategy<R = void> = StrategyFactory<ActivityType, "kind", () => R>;

/**
 * Manages the activity flow between reviews and quizzes.
 */
export function ActivityCoordinatorProvider({ children }: PropsWithChildren) {
  const { panTo, panInside, fitTo, resetViewport } = useMapViewport();
  const { activity } = useMapActivityContext();
  const countryStore = useAppSelector((state) => state.countryStore);
  const dispatch = useAppDispatch();

  const clickQuiz = useQuizClick();
  const inputQuiz = useQuizInput();
  const review = useReview();

  const currentActivityState = useMemo(
    () => (activity?.activity ? countryStore[activity.activity] : null),
    [activity, countryStore],
  );

  const visitedCountries = useMemo<string[]>(() => {
    if (!currentActivityState) return [];

    return currentActivityState.visitedCountries;
  }, [currentActivityState]);

  const currentContinentSelector = useMemo(() => selectCurrentContinent(activity?.activity), [activity?.activity]);
  const currentContinent = useAppSelector(currentContinentSelector);

  const currentCountryDataSelector = useMemo(() => selectCurrentCountryData(activity?.activity), [activity?.activity]);
  const currentCountryData = useAppSelector(currentCountryDataSelector);

  const unvisitedCountries = useMemo<string[]>(() => {
    if (!currentActivityState) return [];
    if (!currentContinent) return [];

    const all = new Set(countriesByContinent[currentContinent]);
    const visited = new Set(currentActivityState.visitedCountries);
    const unvisited = all.difference(visited).values();

    return Array.from(unvisited);
  }, [currentActivityState, currentContinent]);

  const guessTally = useMemo(() => {
    if (!activity) return 0;

    switch (activity.kind) {
      case "pointing":
        return clickQuiz.userGuessTally;
      case "typing":
        return inputQuiz.userGuessTally;
      case "countries":
        return 0;
      default:
        return 0;
    }
  }, [activity, clickQuiz, inputQuiz]);

  /**
   * Focuses the Leaflet map viewport on the given country.
   */
  const focusViewportCountry = useCallback(
    (country: CountryData | null, delayMs = 0, animate = true) => {
      if (!country) return;

      const destination = getLabelCoordinates(country);

      panTo(destination, { delayMs, animate });
    },
    [panTo],
  );

  /**
   * Focuses the Leaflet map viewport on the given continent.
   * @param a3
   * @returns
   */
  const focusViewportContinent = useCallback(
    (continent?: string | null, fitToView = true) => {
      if (!continent || continent.length === 0) return;

      const continentBounds = continentBoundsCatalog[continent];

      if (fitToView) {
        fitTo(continentBounds);
      } else {
        panInside(continentBounds);
      }
    },
    [fitTo, panInside],
  );

  const handleMapClick = (a3?: string) => {
    if (!activity || !a3) return;
    if (countryCatalog[a3]?.CONTINENT !== currentContinent) return;

    switch (activity.kind) {
      case "countries":
        focusViewportCountry(review.setCurrentCountry(a3), 100, false);
        break;
      case "typing":
        focusViewportCountry(currentCountryData);
        break;
      case "pointing":
        focusViewportContinent(clickQuiz.submitClick(a3)?.CONTINENT);
        break;
    }
  };

  const setContinent = (continent: string) => {
    if (!activity) return;

    const country = dispatch(
      createNewQueue({
        activityType: activity.activity,
        continent,
        shuffle: false,
        blacklistedCountries: [],
      }),
    );

    switch (activity.kind) {
      case "countries": {
        review.start();
        break;
      }
      case "typing": {
        inputQuiz.start();
        break;
      }
      case "pointing": {
        clickQuiz.start();
        break;
      }
    }

    if (country) {
      focusViewportContinent(country?.CONTINENT, true);
    }
  };

  const giveHint = () => {
    if (!activity || activity.activity === "review") return;

    switch (activity.kind) {
      case "typing":
        inputQuiz.giveHint();
        break;

      case "pointing":
        clickQuiz.giveHint();
        break;
    }
  };

  const nextCountry = () => {
    if (!activity) return null;

    switch (activity.kind) {
      case "countries": {
        const country = review.nextCountry();
        focusViewportCountry(country);
        return country;
      }
      case "typing": {
        const country = inputQuiz.nextCountry();
        focusViewportContinent(country?.CONTINENT);
        return country;
      }
      case "pointing": {
        const country = clickQuiz.nextCountry();
        focusViewportContinent(country?.CONTINENT);
        return country;
      }
      default:
        return null;
    }
  };

  const setCurrentCountry = (countryA3: string) => {
    if (!activity) return;

    const strategies: ActivityKindStrategy<CountryData | null> = {
      countries: () => {
        const countryData = review.setCurrentCountry(countryA3);
        focusViewportCountry(countryData);
        return countryData;
      },
      typing: () => null,
      pointing: () => null,
    };

    strategies[activity.kind]?.();
  };

  const submitAnswer = () => {
    if (!activity) return null;

    if (activity.kind === "typing") {
      const nextCountry = inputQuiz.submitInput();
      focusViewportCountry(nextCountry);
      return nextCountry;
    }

    return null;
  };

  const reset = useCallback(() => {
    if (!activity) return;

    switch (activity.kind) {
      case "countries":
        review.reset();
        break;
      case "typing":
        inputQuiz.reset();
        break;
      case "pointing":
        clickQuiz.reset();
        break;
    }
  }, [activity, clickQuiz, inputQuiz, review]);

  useActivityTracker((prevActivity, currentActivity) => {
    const isNewActivity = prevActivity === null && currentActivity !== null;
    if (isNewActivity) {
      switch (currentActivity.kind) {
        case "countries":
          review.start();
          break;
        case "typing":
          inputQuiz.start();
          break;
        case "pointing":
          clickQuiz.start();
          break;
      }

      focusViewportContinent(currentContinent);
    }
  });

  useEffect(
    function resetViewportWhenNoActivity() {
      if (activity || currentActivityState?.queue.length) return;

      resetViewport();
    },
    [activity, currentActivityState, resetViewport],
  );

  return (
    <ActivityCoordinatorContext
      value={{
        inputRef: inputQuiz.inputRef,
        giveHint,
        handleMapClick,
        visitedCountries,
        unvisitedCountries,
        reset,
        currentActivityState,
        guessTally,
        nextCountry,
        setCurrentCountry,
        setContinent,
        submitAnswer,
      }}
    >
      {children}
    </ActivityCoordinatorContext>
  );
}
