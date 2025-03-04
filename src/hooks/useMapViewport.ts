import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { useCallback, useEffect } from "react";

import { useMapContext } from "src/context/Map/hook";
import { useSettings } from "./useSettings";

type Options = {
  padding: number;
};

/**
 * Manages the map viewport.
 *
 * Provides methods to move the map to a location using behavior from `Leaflet`.
 *
 * @param Object Same options as `useMapViewport`
 * @param number The amount of padding to add to the adjusted bounds.
 */
export function useMapViewport({ options }: { options?: Options } = {}) {
  const { useReducedMotion } = useSettings();
  const { map } = useMapContext();
  const padding = options?.padding ?? 0.5;

  useEffect(() => {
    if (!map || !padding) return;

    const paddedBounds = map.getBounds().pad(padding);

    map.setMaxBounds(paddedBounds);
  }, [map, padding]);

  const panTo = useCallback(
    async function panTo(
      destination: LatLngExpression | null,
      { animate = true, duration = useReducedMotion ? 0.05 : 0.25, delayMs = 0 } = {},
    ) {
      if (!map || !destination) return;

      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }

      map.panTo(destination, {
        animate,
        duration,
      });
    },
    [map, useReducedMotion],
  );

  const fitTo = useCallback(
    function fitTo(bounds: LatLngBoundsExpression, { animate = true, duration = useReducedMotion ? 0.05 : 0.25 } = {}) {
      if (!map) return;

      map.fitBounds(bounds, { animate, duration });
    },
    [map, useReducedMotion],
  );

  const panInside = useCallback(
    function panInside(
      bounds: LatLngBoundsExpression,
      { animate = true, duration = useReducedMotion ? 0.05 : 0.25 } = {},
    ) {
      if (!map) return;

      map.panInsideBounds(bounds, { animate, duration });
    },
    [map, useReducedMotion],
  );

  function resetViewport() {
    if (!map) return;
    map.fitWorld();
  }

  return { panTo, panInside, fitTo, resetViewport };
}
