import { createContext, use, useEffect, useRef } from "react";
import { useParams } from "react-router";

import { isValidActivity, type ActivityType } from "src/types/map-activity";

export type MapActivityContextType = {
  activity: ActivityType | null;
  navigateToActivity: (activity: ActivityType | null | undefined) => void;
  isRandomReviewMode: boolean;
  setRandomReviewMode: (isRandomReviewMode: boolean) => void;
};

export const MapActivityContext = createContext<MapActivityContextType | null>(null);

export function useMapActivityContext() {
  const context = use(MapActivityContext);

  if (!context) {
    throw new Error("'useMapActivityContext' must be used within a 'MapActivityProvider'");
  }

  return context;
}

function objectToHash(params: Readonly<Record<string, string | undefined>>) {
  return params ? `/${params.activity}/${params.kind}` : "/";
}

export function useActivityTracker(
  onChange: (prevActivity: ActivityType | null, activity: ActivityType | null) => void,
) {
  const params = useParams();
  const prevActivity = useRef<ActivityType | null>(null);

  useEffect(
    function () {
      const previousActivityHash = prevActivity.current?.activity ? objectToHash(prevActivity.current) : "/";
      const currentActivityHash = params?.activity ? objectToHash(params) : "/";

      if (previousActivityHash !== currentActivityHash) {
        const currentValidActivity = isValidActivity(params) ? params : null;
        const prev = prevActivity.current;
        prevActivity.current = currentValidActivity;
        onChange(prev, currentValidActivity);
      }
    },
    [onChange, params],
  );
}
