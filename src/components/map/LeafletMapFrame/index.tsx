import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { MapContainer, useMapEvents } from "react-leaflet";
import { twMerge } from "tailwind-merge";

import { useMapContext } from "src/context/Map/hook";
import { mapDefaults } from "./defaults";
import { TileLayersControl } from "./TileLayersControl";

import "leaflet/dist/leaflet.css";

// * On Styling layers: https://leafletjs.com/examples/choropleth/
// * On Markers: https://codesandbox.io/s/react-leaflet-v3-x-geojson-with-typescript-not-rendering-geojson-points-v28ly?file=/src/Map.tsx

function MapEvents() {
  const { setMap, setZoom } = useMapContext();
  const map = useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
  });

  useEffect(() => {
    setMap(map);
  }, [map, setMap]);

  return null;
}

export function LeafletMapFrame({
  children,
  className,
  showControls,
}: PropsWithChildren<{
  showControls?: boolean;
  className?: string;
}>) {
  return (
    <MapContainer className={twMerge("size-full", className)} {...mapDefaults}>
      <MapEvents />
      {children}
      {showControls && <TileLayersControl checked="None" position="topright" />}
    </MapContainer>
  );
}
