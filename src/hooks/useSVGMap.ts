import { latLng, latLngBounds } from "leaflet";

import mapSvg from "src/assets/images/world-map-mercator.svg?raw";

const parser = new DOMParser();

/**
 * Extracts the SVG attributes from the map SVG.
 * @returns
 */
export function useMapSvg() {
  const svg = parser.parseFromString(mapSvg, "image/svg+xml");

  const paths = Array.from(svg.querySelectorAll("path"));

  const topLeftCorner = latLng(-83.115, -180.4);
  const bottomRightCorner = latLng(83.115, 180.4);
  const bounds = latLngBounds(topLeftCorner, bottomRightCorner);

  return {
    width: svg.documentElement.getAttribute("width") || "250",
    height: svg.documentElement.getAttribute("height") || "250",
    viewBox: svg.documentElement.getAttribute("viewBox") || "0 0 250 250",
    stroke: svg.documentElement.getAttribute("stroke") || "#fff",
    fill: svg.documentElement.getAttribute("fill") || "#7c7c7c",
    strokeLinecap: svg.documentElement.getAttribute("stroke-linecap") || "round",
    strokeLinejoin: svg.documentElement.getAttribute("stroke-linejoin") || "round",
    strokeWidth: svg.documentElement.getAttribute("stroke-width") || "0.01",
    paths,
    bounds,
  };
}
