import { useState } from "react";
import { Marker, ZoomControl, Popup } from "react-leaflet";

import { BackControl, MapClick } from "src/components/map";
import { LeafletMap, markerIcon } from "src/components/map/LeafletMap";
import { useCountryQuiz } from "src/controllers/useCountryQuiz";
import { useCountryReview } from "src/controllers/useCountryReview";
import { useError } from "src/hooks/useError";
import { useCountryStore } from "src/hooks/useCountryStore";
import { useMapViewport } from "src/hooks/useMapViewport";
import { SvgMap } from "src/components/map/MapSvg";
import { ActivityButton } from "src/components/activity/ActivityButton";
import { useUserGuessRecordContext } from "src/contexts/GuessRecordContext";
import useActivityHelper, { type ActivityMode } from "src/controllers/useActivityHelper";
import ErrorBanner from "src/components/common/ErrorBanner";
import GuessHistoryPanel from "src/components/activity/GuessHistoryPanel";
import QuizFloatingPanel from "src/components/activity/QuizFloatingPanel";
import ReviewFloatingPanel from "src/components/activity/ReviewFloatingPanel";
import FloatingHeader from "src/components/activity/FloatingHeader";
import InstructionOverlay from "src/components/activity/InstructionOverlay";
import MainView from "src/components/layout/MainView";
import CountriesListPanel from "src/components/activity/CountriesListPanel";
import RegionsDisabledOverlay from "src/components/activity/RegionsToggle";
import CountryFiltersProvider from "src/contexts/CountryFiltersContext";

import NerdMascot from "src/assets/images/mascot-nerd.min.svg";

function MapActivity({
  setError,
  activityMode,
  setActivityMode,
}: {
  setError: (error: Error) => void;
  activityMode?: ActivityMode;
  setActivityMode: (mode?: ActivityMode) => void;
}) {
  const { storedCountry, resetStore, filteredCountryData } = useCountryStore();

  const {
    handleMapClick: handleMapClickReview,
    showNextCountry,
    isRandomReviewMode,
    setRandomReviewMode,
  } = useCountryReview(setError);
  const {
    handleMapClick: handleMapClickQuiz,
    answerInputRef,
    submitAnswer,
    userGuessTally,
    giveHint,
    skipCountry,
  } = useCountryQuiz(setError);

  useActivityHelper(activityMode, isRandomReviewMode);

  const { resetView } = useMapViewport();
  const finishActivity = () => {
    setActivityMode();
    resetStore();
    resetView();
  };

  return (
    <>
      <LeafletMap>
        {activityMode && (
          <>
            <ZoomControl position="topright" />
            <BackControl position="topleft" label="Finish" onClick={finishActivity} />
            {activityMode === "quiz" && <MapClick callback={handleMapClickQuiz} />}
            {storedCountry.coordinates && (
              <>
                <Marker position={storedCountry.coordinates} icon={markerIcon} />
                {activityMode === "review" && (
                  <Popup
                    position={storedCountry.coordinates}
                    keepInView
                    closeButton
                    autoClose={false}
                    closeOnClick={false}
                    closeOnEscapeKey={false}
                    autoPan={false}
                  >
                    <h3 className="text-xl">{storedCountry.data?.name}</h3>
                  </Popup>
                )}
              </>
            )}
          </>
        )}

        <SvgMap
          highlightAlpha3={storedCountry.data?.a3}
          onClick={handleMapClickReview}
          enableOnClick={activityMode === "review"}
          disableColorFilter={!activityMode}
        />
      </LeafletMap>

      <QuizFloatingPanel
        shouldShow={activityMode === "quiz" && filteredCountryData.length > 0}
        activity={{
          answerInputRef,
          submitAnswer,
          userGuessTally,
          giveHint,
          skipCountry,
        }}
      />

      <ReviewFloatingPanel
        shouldShow={activityMode === "review"}
        activity={{
          showNextCountry,
          isRandomReviewMode,
          setRandomReviewMode,
        }}
        disabled={filteredCountryData.length === 0}
        onError={setError}
      />

      {activityMode && <RegionsDisabledOverlay shouldShow={filteredCountryData.length === 0} />}
    </>
  );
}

export default function MapActivityLayout() {
  const { guessHistory } = useUserGuessRecordContext();
  const { error, setError, dismissError } = useError();
  const [activityMode, setActivityMode] = useState<ActivityMode>();

  return (
    <CountryFiltersProvider>
      {error && <ErrorBanner error={error} dismissError={dismissError} />}

      <MainView>
        <div className="relative h-full w-full overflow-hidden rounded-lg shadow-inner">
          <MapActivity activityMode={activityMode} setActivityMode={setActivityMode} setError={setError} />

          <FloatingHeader shouldShow={!!activityMode} imageSrc={NerdMascot}>
            {activityMode === "quiz" && "Guess the country!"}
            {activityMode === "review" && "Reviewing countries"}
          </FloatingHeader>

          <InstructionOverlay shouldShow={!activityMode}>
            <ActivityButton
              className="bg-gradient-to-br from-blue-600 to-blue-700"
              label="🗺 Review"
              onClick={() => setActivityMode("review")}
            >
              Learn about the cultures, geography, and history of countries from around the world.
            </ActivityButton>
            <ActivityButton
              className="bg-gradient-to-br from-yellow-600 to-yellow-700"
              label="🏆 Quiz"
              onClick={() => setActivityMode("quiz")}
            >
              Test your knowledge of countries around the world. Can you guess them all?
            </ActivityButton>
          </InstructionOverlay>
        </div>

        {activityMode && (
          <div className="flex h-1/5 w-max flex-col gap-6 sm:h-auto sm:w-[30ch]">
            <CountriesListPanel abridged={activityMode === "quiz"} />
            {activityMode === "quiz" && <GuessHistoryPanel guessHistory={guessHistory} />}
          </div>
        )}
      </MainView>
    </CountryFiltersProvider>
  );
}
