import type { PropsWithChildren } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import type { ActivityType } from "src/types/map-activity";
import { isValidActivity } from "src/types/map-activity";
import { MapActivityContext } from "./hook";

/**
 * Sets or removes search params with the given items.
 *
 * Setting a value of undefined removes the param.
 * @param searchParams
 * @param items
 * @returns
 */
function modifySearchParams(searchParams: URLSearchParams, items: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(items)) {
    if (value && value !== "false") {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
  }

  return searchParams;
}

export function MapActivityProvider({ children }: PropsWithChildren) {
  const params = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const setRandomReviewMode = (isRandomReviewMode: boolean) => {
    if (params.activity !== "review") return;

    setSearchParams(modifySearchParams(searchParams, { random: String(isRandomReviewMode) }), {
      replace: true,
    });
  };

  const isRandomReviewMode = searchParams.get("random") === "true";
  const activity = isValidActivity(params) ? params : null;

  const navigateToActivity: MapActivityContextType["navigateToActivity"] = (newActivity) => {
    navigate(newActivity ? `/${newActivity.activity}/${newActivity.kind}` : "/");
  };

  return (
    <MapActivityContext
      value={{
        activity,
        navigateToActivity,
        isRandomReviewMode,
        setRandomReviewMode,
      }}
    >
      {children}
    </MapActivityContext>
  );
}
