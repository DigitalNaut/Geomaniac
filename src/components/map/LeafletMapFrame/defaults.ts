import type { ComponentProps } from "react";
import type { MapContainer } from "react-leaflet";

export const mapDefaults: ComponentProps<typeof MapContainer> = {
  center: [0, 0],
  zoom: 2,
  minZoom: 2,
  maxZoom: 7,
  zoomControl: false,
  maxBoundsViscosity: 0.5,
  style: {
    backgroundColor: "transparent",
  },
} as const;
