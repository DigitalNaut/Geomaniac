import type { LatLngExpression } from "leaflet";
import { useEffect } from "react";

import { mapDefaults } from "src/components/map/LeafletMap";
import { useMapContext } from "src/contexts/MapContext";
import { useUserSettingsContext } from "src/contexts/UserSettingsContext";

export function useMapViewport() {
  const { map } = useMapContext();
  const { userSettings } = useUserSettingsContext();

  useEffect(() => {
    if (!map) return;
    map.setMaxBounds(map.getBounds());
  }, [map]);

  function flyTo(
    destination: LatLngExpression | null,
    { zoom = 4, animate = true, duration = userSettings.reducedMotion ? 0.1 : 0.25 } = {},
  ) {
    if (!destination || !map) return;
    map.flyTo(destination, zoom, {
      animate,
      duration,
    });
  }

  function resetView() {
    if (!map) return;
    map.setView(mapDefaults.center || [0, 0], mapDefaults.zoom || 2);
  }

  return { flyTo, resetView };
}
