import { faAngleLeft, faBookAtlas, faGlobe, faKeyboard, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Map } from "leaflet";
import type { Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Marker, ZoomControl } from "react-leaflet";

import { ActivityButton } from "src/components/activity/ActivityButton";
import ContinentSelectionOverlay from "src/components/activity/ContinentSelectionOverlay";
import CountriesListPanel from "src/components/activity/CountriesListPanel";
import FloatingHeader from "src/components/activity/FloatingHeader";
import GuessHistoryPanel from "src/components/activity/GuessHistoryPanel";
import InstructionOverlay from "src/components/activity/InstructionOverlay";
import QuizFloatingPanel from "src/components/activity/QuizFloatingPanel";
import ReviewFloatingPanel, {
  UnsplashImagesFloatingPanel,
  WikipediaFloatingPanel,
} from "src/components/activity/ReviewFloatingPanel";
import Button from "src/components/common/Button";
import ErrorBanner from "src/components/common/ErrorBanner";
import MainView from "src/components/layout/MainView";
import type { ActiveSvgMapLists, SvgMapColorTheme } from "src/components/map/CountrySvgMap";
import { CountrySvgMap } from "src/components/map/CountrySvgMap";
import { LeafletMapFrame } from "src/components/map/LeafletMapFrame";
import { MapControl } from "src/components/map/MapControl";
import { markerIcon } from "src/components/map/MarkerIcon";
import { useActivityCoordinatorContext } from "src/context/ActivityCoordinator/hook";
import { useMapContext } from "src/context/Map/hook";
import { useMapActivityContext } from "src/context/MapActivity/hook";
import { useHeaderController } from "src/context/useHeaderController";
import { useError } from "src/hooks/common/useError";
import { useGuessRecord } from "src/hooks/useGuessRecord";
import { useMapViewport } from "src/hooks/useMapViewport";
import { countriesByContinent, countryCatalog } from "src/store/CountryStore/slice";
import type { ActivityMode, ActivityType } from "src/types/map-activity";
import { getLabelCoordinates } from "src/utils/features";
import { cn } from "src/utils/styles";

import NerdMascot from "src/assets/images/mascot-nerd.min.svg";

const mapGradientTheme = {
  noActivity: "from-sky-700 to-sky-800 blur-xs",
  activity: "from-slate-900 to-slate-900 blur-none",
} as const;

const mapActivityTheme: Record<ActivityMode | "default", SvgMapColorTheme> = {
  review: {
    country: {
      activeStyle: "fill-slate-500/95 stroke-slate-400 hover:fill-slate-500 hover:stroke-slate-300",
      highlightStyle: "fill-lime-500 stroke-lime-200",
      visitedStyle: "fill-lime-700 stroke-lime-200 hover:fill-lime-600 hover:stroke-lime-500",
      inactiveStyle: "fill-slate-800 stroke-none",
    },
  },
  quiz: {
    country: {
      activeStyle: "fill-slate-500/95 stroke-slate-400 hover:fill-slate-500 hover:stroke-slate-300",
      highlightStyle: "fill-lime-500 stroke-lime-200",
      visitedStyle: "fill-lime-700 stroke-lime-200",
      inactiveStyle: "fill-slate-800 stroke-none",
    },
  },
  default: {
    country: {
      activeStyle: "fill-sky-700 stroke-none",
      highlightStyle: "",
      visitedStyle: "",
      inactiveStyle: "fill-sky-700 stroke-none",
    },
  },
} as const;

const labelVariants: Variants = {
  initial: {
    height: 0,
    opacity: 0,
  },
  animate: {
    height: "auto",
    opacity: 1,
  },
  exit: {
    height: 0,
    opacity: 0,
    transitionEnd: { display: "none" },
  },
};

function MapLabel({
  country,
  isCurrentCountry,
  mapPixelPosition: { top, left },
  onClick,
  projectFn,
}: {
  country: string;
  isCurrentCountry: boolean;
  onClick: () => void;
  mapPixelPosition: {
    top: number;
    left: number;
  };
  projectFn: Map["project"];
}) {
  const countryData = useMemo(() => countryCatalog[country], [country]);
  const position = useMemo(() => projectFn?.(getLabelCoordinates(countryData)), [countryData, projectFn]);
  const sovereignt = useMemo(() => (countryData.ADM0_DIF ? countryData.SOVEREIGNT : null), [countryData]);

  if (!position) return null;

  return (
    <div
      className={cn(
        "absolute z-1000 -translate-x-1/2 -translate-y-1/2 cursor-pointer overflow-hidden rounded-lg text-center text-xs text-white/30 [transition:opacity_0.25s_ease-in-out,_color_0.25s_ease-in-out,_background-color_0.25s_ease-out,_translate_0.25s_ease-in-out] hover:z-1500 hover:bg-slate-200/80 hover:text-base hover:text-slate-700 hover:opacity-100",
        {
          "z-1100 translate-y-[-64px] bg-white p-0 text-base text-slate-900 drop-shadow-md hover:bg-white/30 hover:opacity-25":
            isCurrentCountry,
        },
      )}
      key={country}
      style={{
        transform: `translate(${position.x - left}px, ${position.y - top}px)`,
      }}
      onClick={onClick}
    >
      <AnimatePresence>
        {isCurrentCountry && (
          <>
            <motion.div
              className="bg-slate-700 px-1 text-xs text-white"
              key="country-name"
              variants={labelVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              {countryData.SUBREGION}
            </motion.div>
            {sovereignt && (
              <motion.div
                className="bg-slate-500 px-1 text-xs text-white"
                key="sovereignt-name"
                variants={labelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                {sovereignt}
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <div className={cn("px-1", { "px-1.5": isCurrentCountry })}>{countryData.GEOUNIT}</div>
    </div>
  );
}

function ActivityMap({
  setError,
  onFinishActivity,
}: {
  setError: (error: Error) => void;
  onFinishActivity: () => void;
}) {
  const { map } = useMapContext();
  const { resetViewport } = useMapViewport();
  const {
    currentActivityState,
    handleMapClick,
    visitedCountries: visitedList,
    guessTally,
    giveHint,
    inputRef,
    nextCountry,
    submitAnswer,
    setContinent,
    reset,
  } = useActivityCoordinatorContext();

  const { currentContinent, currentCountry } = currentActivityState ?? {};

  const storedCountryCoordinates = useMemo(
    () => (currentCountry ? getLabelCoordinates(currentCountry) : null),
    [currentCountry],
  );

  const finishActivity = useCallback(() => {
    onFinishActivity();
    resetViewport();
  }, [onFinishActivity, resetViewport]);

  const resetActivity = useCallback(() => {
    resetViewport();
    reset();
  }, [resetViewport, reset]);

  useHeaderController(finishActivity);

  const { activity } = useMapActivityContext();

  const colorTheme = useMemo(() => mapActivityTheme[activity?.activity || "default"], [activity]);

  const mapLists = useMemo<ActiveSvgMapLists>(() => {
    // Active list is all countries in the current continent
    const activeList = !currentContinent ? [] : countriesByContinent[currentContinent].slice();
    // Highlight list is the current country unless Pointing
    const highlightList = activity?.kind === "pointing" ? [] : !currentCountry ? [] : [currentCountry.GU_A3];

    return {
      activeList,
      highlightList,
      visitedList,
    };
  }, [activity?.kind, currentContinent, currentCountry, visitedList]);

  const [mapPixelPosition, setMapPixelPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const updateSvgLabelPositions = useCallback(() => {
    if (!map) return;

    const minBounds = map.getPixelBounds().min;
    if (!minBounds) return;

    setMapPixelPosition({
      top: minBounds.y,
      left: minBounds.x,
    });
  }, [map]);

  useEffect(
    function manageSvgLabelPositions() {
      if (map) {
        map.addEventListener("move", updateSvgLabelPositions);
        map.addEventListener("zoomanim", updateSvgLabelPositions);
      }

      return () => {
        if (map) {
          map.removeEventListener("move", updateSvgLabelPositions);
          map.removeEventListener("zoomanim", updateSvgLabelPositions);
        }
      };
    },
    [map, updateSvgLabelPositions],
  );

  return (
    <div
      className={cn("size-full bg-linear-to-br", activity ? mapGradientTheme.activity : mapGradientTheme.noActivity)}
    >
      <LeafletMapFrame showControls={activity?.activity === "review"}>
        {activity && (
          <>
            <ZoomControl position="topright" />
            <MapControl className="flex gap-2 text-base" position="topleft">
              <Button onClick={finishActivity} title="Finish activity">
                <Button.Icon icon={faAngleLeft} />
                Menu
              </Button>
              <Button title="Reset activity" onClick={resetActivity}>
                <Button.Icon icon={faGlobe} />
                Change continent
              </Button>
            </MapControl>

            {storedCountryCoordinates &&
              (activity.activity !== "quiz" || activity.kind === "typing" ? (
                <Marker position={storedCountryCoordinates} icon={markerIcon} />
              ) : null)}
          </>
        )}

        <CountrySvgMap lists={mapLists} onClick={handleMapClick} colorTheme={colorTheme} />

        {activity?.activity === "review" &&
          map &&
          visitedList.map((country) => (
            <MapLabel
              key={country}
              mapPixelPosition={mapPixelPosition}
              onClick={() => handleMapClick(country)}
              country={country}
              isCurrentCountry={country === currentCountry?.GU_A3}
              projectFn={(...rest) => map.project(...rest)}
            />
          ))}
      </LeafletMapFrame>

      {activity && (
        <AnimatePresence>
          {!currentCountry && <ContinentSelectionOverlay key="regions-toggle-overlay" onClick={setContinent} />}

          {currentCountry && activity.activity === "quiz" && (
            <QuizFloatingPanel
              key="quiz-floating-panel"
              mode={activity.kind}
              giveHint={giveHint}
              inputRef={inputRef}
              skipCountry={nextCountry}
              submitAnswer={submitAnswer}
              userGuessTally={guessTally}
            />
          )}

          {currentCountry && activity.activity === "review" && (
            <>
              <ReviewFloatingPanel
                key="review-floating-panel"
                showNextCountry={nextCountry}
                disabled={!currentCountry}
              />
              <WikipediaFloatingPanel key="wikipedia-floating-panel" onError={setError} />
              <UnsplashImagesFloatingPanel key="unsplash-floating-panel" onError={setError} />
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

const activities: Record<string, ActivityType> = {
  "review-countries": { activity: "review", kind: "countries" },
  "quiz-typing": { activity: "quiz", kind: "typing" },
  "quiz-pointing": { activity: "quiz", kind: "pointing" },
};

// Main activity layout view
export default function ActivityMapLayout() {
  const { guessHistory } = useGuessRecord();
  const { error, setError, dismissError } = useError();
  const { activity, navigateToActivity } = useMapActivityContext();

  const isActivitySelected = !!activity?.activity;

  return (
    <>
      {error && (
        <ErrorBanner error={error}>
          <ErrorBanner.Button dismissError={dismissError} />
        </ErrorBanner>
      )}
      <MainView className="relative overflow-auto">
        <AnimatePresence>
          {!isActivitySelected && (
            <InstructionOverlay key="instruction-overlay">
              <section className="flex w-full max-w-(--breakpoint-sm) min-w-max flex-col items-center gap-8 p-6">
                <h1 className="text-2xl">Learn Geography</h1>
                <div className="flex flex-col shadow-lg">
                  <ActivityButton
                    type="review"
                    icon={<FontAwesomeIcon icon={faBookAtlas} />}
                    label="Review the map"
                    summary="Learn country names by region"
                    onClick={() => {
                      navigateToActivity(activities["review-countries"]);
                    }}
                  />
                </div>

                <h2 className="text-xl">And test your knowledge</h2>
                <div className="flex flex-col shadow-lg">
                  <ActivityButton
                    type="quiz"
                    icon={<FontAwesomeIcon icon={faMousePointer} />}
                    label="Point & click"
                    summary="Point out the country on the map"
                    onClick={() => {
                      navigateToActivity(activities["quiz-pointing"]);
                    }}
                  />
                  <ActivityButton
                    type="quiz"
                    icon={<FontAwesomeIcon icon={faKeyboard} />}
                    label="Typing quiz"
                    summary="Type in the name of the country"
                    onClick={() => {
                      navigateToActivity(activities["quiz-typing"]);
                    }}
                  />
                </div>
              </section>
            </InstructionOverlay>
          )}

          {isActivitySelected && (
            <FloatingHeader key="floating-header" imageSrc={NerdMascot}>
              {activity?.activity === "quiz" && <span>Guess the country!</span>}
              {activity?.activity === "review" && <span>Reviewing countries</span>}
            </FloatingHeader>
          )}
        </AnimatePresence>

        <div className="relative m-2 flex-1 overflow-hidden rounded-lg shadow-inner">
          <ActivityMap onFinishActivity={() => navigateToActivity(null)} setError={setError} />
        </div>

        {activity?.activity && (
          <motion.div className="flex h-1/5 w-max flex-col gap-6 overflow-y-auto sm:h-auto sm:w-[30ch]">
            <CountriesListPanel isAbridged={activity.activity === "quiz"} />
            {activity.activity === "quiz" && <GuessHistoryPanel guessHistory={guessHistory} />}
          </motion.div>
        )}
      </MainView>
    </>
  );
}
