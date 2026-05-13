import { faAngleLeft, faBookAtlas, faKeyboard, faMousePointer } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Map } from "leaflet";
import type { Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
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
import {
  countriesByContinent,
  countryCatalog,
  selectCurrentContinent,
  selectCurrentCountryData,
} from "src/store/CountryStore/slice";
import type { CountryData } from "src/store/CountryStore/types";
import type { ActivityMode, ActivityType } from "src/types/map-activity";
import { getLabelCoordinates } from "src/utils/features";
import { cn } from "src/utils/styles";

import NerdMascot from "src/assets/images/mascot-nerd.min.svg";
import { useAppSelector } from "src/store/hooks";

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
  },
};

function CountryLabel({
  mapOffset,
  countryCode,
  state: { isCurrentCountry, geounitHovered, adminHovered, regionHovered, sovereigntHovered },
  actions: { onClick, changeHovered, projectFn },
}: {
  mapOffset: {
    top: number;
    left: number;
  };
  countryCode: string;
  state: {
    isCurrentCountry: boolean;
    geounitHovered?: string;
    regionHovered?: string;
    adminHovered?: string;
    sovereigntHovered?: string;
  };
  actions: {
    onClick: () => void;
    changeHovered: (a3: string | undefined) => void;
    projectFn: Map["project"];
  };
}) {
  const countryData = countryCatalog[countryCode];

  if (!countryData) return null;

  const position = projectFn(getLabelCoordinates(countryData));
  const sovereignt = countryData.SOVEREIGNT === countryData.GEOUNIT ? null : countryData.SOVEREIGNT;
  const admin =
    countryData.ADMIN === sovereignt || countryData.ADMIN === countryData.GEOUNIT ? null : countryData.ADMIN;

  if (!position) return null;

  return (
    <div
      className={cn(
        "absolute z-402 -translate-1/2 cursor-pointer overflow-hidden rounded-sm text-center text-xs text-white/0 transition duration-0 [transition:opacity_250ms_ease-in-out_10ms,color_250ms_ease-in-out_10ms,background-color_250ms_ease-out_10ms,translate_250ms_ease-in-out_10ms] hover:bg-slate-200/80 hover:text-slate-700 hover:opacity-100",
        {
          "text-slate-200/80 drop-shadow-md": regionHovered === countryData.SUBREGION,
          "bg-lime-600 text-slate-200": sovereigntHovered === sovereignt,
          "bg-sky-500 text-slate-200": adminHovered === countryData.ADMIN,
          "z-401 bg-slate-200/80 text-slate-700 opacity-100": geounitHovered === countryCode,
          "z-400 -translate-y-14 bg-slate-200 p-0 text-slate-900 outline-1 outline-lime-700 drop-shadow-md hover:bg-slate-300 hover:opacity-25":
            isCurrentCountry,
        },
      )}
      title={`Sovereignt: ${countryData.SOVEREIGNT}\nAdmin: ${countryData.ADMIN}\nGeounit: ${countryData.GEOUNIT}`}
      key={countryCode}
      style={{
        transform: `translate(${position.x - mapOffset.left}px, ${position.y - mapOffset.top}px)`,
      }}
      onClick={onClick}
      onMouseEnter={() => changeHovered(countryCode)}
      onMouseLeave={() => changeHovered(undefined)}
    >
      <AnimatePresence>
        {isCurrentCountry && (
          <motion.div
            key="country-name"
            variants={labelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            <div className="bg-lime-700 px-1 text-xs text-slate-200">{countryData.SUBREGION}</div>
            <div className="bg-lime-600 p-0.5 px-1 text-xs text-slate-200">{sovereignt}</div>
            <div className="bg-sky-500 p-0.5 px-1 text-xs text-slate-200">{admin}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("px-1", { "px-1.5": isCurrentCountry })}>{countryData.GEOUNIT}</div>
    </div>
  );
}

type MapPixelPosition = { top: number; left: number };

function getMinBoundPositions(map: Map | undefined) {
  if (!map) return null;

  const bounds = map.getPixelBounds().min;
  if (!bounds) return null;

  return {
    top: bounds.y,
    left: bounds.x,
  };
}

function useMapPixelPosition() {
  const { map } = useMapContext();
  const [mapPixelBounds, setMapPixelBounds] = useState<MapPixelPosition | null>(() => null);

  useEffect(
    function manageSvgLabelPositions() {
      const resetSvgLabelPositions = () => {
        setMapPixelBounds(null);
      };

      const updateSvgLabelPositions = () => {
        setMapPixelBounds(getMinBoundPositions(map));
      };

      if (map) {
        map.on("movestart", resetSvgLabelPositions);
        map.on("zoomstart", resetSvgLabelPositions);
        map.on("moveend", updateSvgLabelPositions);
        map.on("zoomend", updateSvgLabelPositions);

        updateSvgLabelPositions();
      }

      return () => {
        if (map) {
          map.off("movestart", resetSvgLabelPositions);
          map.off("zoomstart", resetSvgLabelPositions);
          map.off("moveend", updateSvgLabelPositions);
          map.off("zoomend", updateSvgLabelPositions);
        }
      };
    },
    [map],
  );

  return mapPixelBounds;
}

function useHoveredCountry() {
  const [hovered, setHovered] = useState<CountryData | undefined>(undefined);

  const changeHovered = (a3: string | undefined) => a3 && a3 !== hovered?.GU_A3 && setHovered(countryCatalog[a3]);
  const resetHovered = (a3: string) => (a3 === hovered?.GU_A3 ? setHovered(undefined) : null);

  return { hovered, changeHovered, resetHovered };
}

function useResizeObserver(target: Element | undefined, callback: ResizeObserverCallback) {
  useEffect(() => {
    if (!target) return undefined;

    const observer = new ResizeObserver(callback);
    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [target, callback]);
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
    handleMapClick,
    visitedCountries,
    guessTally,
    giveHint,
    inputRef,
    nextCountry,
    submitAnswer,
    setContinent,
    reset,
    restart,
  } = useActivityCoordinatorContext();

  const { activity } = useMapActivityContext();

  const currentContinentSelector = selectCurrentContinent(activity?.activity);
  const currentContinent = useAppSelector(currentContinentSelector);

  const currentCountrySelector = selectCurrentCountryData(activity?.activity);
  const currentCountry = useAppSelector(currentCountrySelector);

  const storedCountryCoordinates = currentCountry ? getLabelCoordinates(currentCountry) : null;

  const finishActivity = () => {
    onFinishActivity();
    resetViewport();
  };

  const resetActivity = () => {
    resetViewport();
    reset();
  };

  useHeaderController(finishActivity);

  const colorTheme = mapActivityTheme[activity?.activity || "default"];

  const mapLists: ActiveSvgMapLists = {
    // Active list is all countries in the current continent
    activeList: !currentContinent ? [] : (countriesByContinent[currentContinent]?.slice() ?? []),
    // Highlight list is the current country unless Pointing
    highlightList: activity?.kind === "pointing" ? [] : !currentCountry ? [] : [currentCountry.GU_A3],
    visitedList: visitedCountries,
  };

  const mapOffset = useMapPixelPosition();

  const { hovered, changeHovered, resetHovered } = useHoveredCountry();

  useResizeObserver(map?.getContainer(), () => map?.invalidateSize());

  return (
    <div
      className={cn("size-full bg-linear-to-br", activity ? mapGradientTheme.activity : mapGradientTheme.noActivity)}
    >
      <LeafletMapFrame showControls={activity?.activity === "review"}>
        {activity && (
          <>
            <ZoomControl position="topright" />
            <MapControl className="flex flex-col gap-2 text-base" position="topleft">
              <Button onClick={finishActivity} title="Finish activity" className="rounded-l-sm rounded-r-full">
                <Button.Icon icon={faAngleLeft} />
                <span className="w-full justify-start text-left">Menu</span>
              </Button>
              <Button title="Reset activity" onClick={resetActivity} className="rounded-l-sm rounded-r-full">
                <Button.Icon icon={faAngleLeft} />
                <span className="w-full justify-start text-left">Change continent</span>
              </Button>
            </MapControl>

            {storedCountryCoordinates &&
              (activity.activity !== "quiz" || activity.kind === "typing" ? (
                <Marker position={storedCountryCoordinates} icon={markerIcon} />
              ) : null)}
          </>
        )}

        <CountrySvgMap
          lists={mapLists}
          onClick={handleMapClick}
          colorTheme={colorTheme}
          onMouseEnter={changeHovered}
          onMouseLeave={resetHovered}
        />

        {activity?.activity === "review" &&
          map &&
          mapOffset &&
          visitedCountries.map((country) => (
            <CountryLabel
              key={country}
              mapOffset={mapOffset}
              countryCode={country}
              state={{
                isCurrentCountry: currentCountry?.GU_A3 === country,
                geounitHovered: hovered?.GU_A3,
                adminHovered: currentCountry?.ADMIN,
                regionHovered: currentCountry?.SUBREGION,
                sovereigntHovered: currentCountry?.SOVEREIGNT,
              }}
              actions={{
                onClick: () => handleMapClick(country),
                projectFn: (point, zoom) => map.project(point, zoom),
                changeHovered,
              }}
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
                restart={restart}
                disabled={!currentCountry}
              />
              <WikipediaFloatingPanel key="wikipedia-floating-panel" onError={setError} />
              <UnsplashImagesFloatingPanel key="unsplash-floating-panel" />
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
              <section className="flex w-full max-w-(--breakpoint-sm) min-w-max flex-col items-center overflow-hidden rounded-lg p-6 first:rounded-t-2xl last:rounded-b-2xl">
                <h1 className="w-full p-4 text-center text-4xl uppercase">Learn Geography</h1>
                <div className="flex w-full flex-col shadow-lg">
                  <ActivityButton
                    type="review"
                    icon={<FontAwesomeIcon icon={faBookAtlas} />}
                    label="Review the map"
                    summary="Learn country names by region"
                    onClick={() => void navigateToActivity(activities["review-countries"])}
                  />
                </div>

                <h2 className="w-full p-4 text-center text-xl uppercase">And test yourself</h2>
                <div className="flex w-full flex-col gap-2 shadow-lg">
                  <ActivityButton
                    type="quiz"
                    icon={<FontAwesomeIcon icon={faMousePointer} />}
                    label="Point & click"
                    summary="Point out the country on the map"
                    onClick={() => void navigateToActivity(activities["quiz-pointing"])}
                  />
                  <ActivityButton
                    type="quiz"
                    className="w-full"
                    icon={<FontAwesomeIcon icon={faKeyboard} />}
                    label="Typing quiz"
                    summary="Type in the name of the country"
                    onClick={() => void navigateToActivity(activities["quiz-typing"])}
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
          <motion.div className="flex h-1/5 w-max max-w-1/4 flex-col gap-6 overflow-y-auto sm:h-auto">
            <CountriesListPanel isAbridged={activity.activity === "quiz"} />
            {activity.activity === "quiz" && <GuessHistoryPanel guessHistory={guessHistory} />}
          </motion.div>
        )}
      </MainView>
    </>
  );
}
