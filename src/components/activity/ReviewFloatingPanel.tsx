import { useState } from "react";
import { animated } from "@react-spring/web";

import { ActionButton } from "src/components/common/ActionButton";
import { useFloatingPanelSlideInAnimation } from "src/components/activity/QuizFloatingPanel";
import { useMapActivityContext } from "src/contexts/MapActivityContext";
import { CountryWikiInfo } from "src/components/info/CountryWikiInfo";

export default function ReviewFloatingPanel({
  shouldShow,
  showNextCountry,
  disabled,
  onError,
}: {
  shouldShow: boolean;
  showNextCountry: () => void;
  disabled: boolean;
  onError: (error: Error) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const { firstTrail } = useFloatingPanelSlideInAnimation(shouldShow);
  const { isRandomReviewMode, setRandomReviewMode } = useMapActivityContext();

  return (
    <animated.div
      className="pointer-events-none absolute inset-x-0 bottom-8 z-[1000] mx-auto flex size-fit flex-col items-center gap-2 rounded-md"
      style={firstTrail}
    >
      {!disabled && (
        <details
          className="pointer-events-auto rounded-md bg-sky-900/70 p-3 shadow-md backdrop-blur-md hover:bg-sky-900"
          open={showDetails}
          onToggle={(event) => setShowDetails(event.currentTarget.open)}
        >
          <summary className="cursor-pointer">Wikipedia summary</summary>
          {shouldShow && showDetails && <CountryWikiInfo onError={onError} />}
        </details>
      )}
      <div className="pointer-events-auto flex w-fit flex-col items-center overflow-hidden rounded-md bg-slate-900 drop-shadow-lg">
        <animated.div className="flex w-full flex-col items-center overflow-hidden rounded-md">
          <ActionButton disabled={disabled || !shouldShow} onClick={showNextCountry} title="Next country">
            Next country
          </ActionButton>
          <label className="flex gap-2 p-1" htmlFor="randomMode">
            <input
              id="randomMode"
              type="checkbox"
              checked={isRandomReviewMode}
              onChange={(event) => setRandomReviewMode(event.currentTarget.checked)}
            />
            Random mode
          </label>
        </animated.div>
      </div>
    </animated.div>
  );
}
