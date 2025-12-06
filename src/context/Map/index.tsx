import type { PropsWithChildren } from "react";
import { useState } from "react";

import { mapDefaults } from "src/components/map/LeafletMapFrame/defaults";
import type { MapContextType } from "./hook";
import { MapContext } from "./hook";

/**
 * Map Context Provider
 * Holds the map instance
 */
export function MapContextProvider({ children }: PropsWithChildren) {
  const [map, setMap] = useState<MapContextType["map"]>();
  const [zoom, setZoom] = useState<number | undefined>(mapDefaults.zoom);

  return <MapContext value={{ map, setMap, zoom, setZoom }}>{children}</MapContext>;
}
