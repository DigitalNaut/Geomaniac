import type { ChangeEventHandler } from "react";
import { useState } from "react";
import { animated } from "@react-spring/web";

import { ActionButton } from "src/components/common/ActionButton";
import { useFloatingPanelSlideInAnimation } from "src/components/activity/QuizFloatingPanel/hooks";
import { useMapActivity } from "src/hooks/useMapActivity";
import { CountryWikiInfo } from "src/components/info/CountryWikiInfo";
import { InlineButton } from "./InlineButton";

export function WikipediaFloatingPanel({
  disabled,
  shouldShow,
  onError,
}: {
  disabled: boolean;
  shouldShow: boolean;
  onError: (error: Error) => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (disabled) return null;

  return (
    <animated.div className="pointer-events-none absolute left-4 top-16 z-[1000] my-auto flex size-fit flex-col items-center gap-2 rounded-md">
      <details
        className="pointer-events-auto rounded-md bg-sky-900/70 p-3 pr-0 shadow-md backdrop-blur-md hover:bg-sky-900"
        open={showDetails}
        onToggle={(event) => setShowDetails(event.currentTarget.open)}
      >
        <summary className="cursor-pointer pr-3">Wikipedia summary</summary>
        {shouldShow && showDetails && <CountryWikiInfo onError={onError} />}
      </details>
    </animated.div>
  );
}

export default function ReviewFloatingPanel({
  shouldShow,
  showNextCountry,
  disabled,
  onReset,
}: {
  shouldShow: boolean;
  showNextCountry: () => void;
  disabled: boolean;
  onReset: () => void;
}) {
  const { firstTrail } = useFloatingPanelSlideInAnimation(shouldShow);
  const { isRandomReviewMode, setRandomReviewMode } = useMapActivity();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => setRandomReviewMode(event.currentTarget.checked);

  return (
    <animated.div
      className="pointer-events-none absolute inset-x-0 bottom-8 z-[1000] mx-auto flex size-fit flex-col items-center gap-2 rounded-md"
      style={firstTrail}
    >
      <div className="pointer-events-auto flex w-fit flex-col items-center overflow-hidden rounded-md bg-slate-900 drop-shadow-lg">
        <animated.div className="flex w-full flex-col items-center overflow-hidden rounded-md">
          <ActionButton
            className="w-full"
            disabled={disabled || !shouldShow}
            onClick={showNextCountry}
            title="Next country"
          >
            Next country
          </ActionButton>
          <div className="flex justify-between gap-2 p-1">
            <label className="flex items-center gap-2 p-1" htmlFor="randomMode">
              <input id="randomMode" type="checkbox" checked={isRandomReviewMode} onChange={onChange} />
              Random mode
            </label>
            <InlineButton onClick={onReset}>Reset</InlineButton>
          </div>
        </animated.div>
      </div>
    </animated.div>
  );
}
