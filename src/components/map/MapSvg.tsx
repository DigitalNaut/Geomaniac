import { Fragment, useMemo } from "react";
import { CircleMarker, SVGOverlay, Tooltip } from "react-leaflet";
import { twMerge } from "tailwind-merge";
import { type LeafletMouseEventHandlerFn, latLng, latLngBounds } from "leaflet";

import { useMapContext } from "src/contexts/MapContext";
import mapSvg from "src/assets/images/world-map-mercator.svg?raw";
import { useCountryFiltersContext } from "src/contexts/CountryFiltersContext";

const parser = new DOMParser();

/**
 * Extracts the SVG attributes from the map SVG.
 * @returns
 */
function useMapSvg() {
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

/**
 * Renders the map SVG as an overlay on the map.
 * @param props
 * @returns
 */
export default function SvgMap({
  highlightAlpha3,
  onClick,
  disableColorFilter,
}: {
  highlightAlpha3?: string;
  onClick?: (a3: string) => void;
  disableColorFilter: boolean;
}) {
  const { zoom } = useMapContext();
  const { isCountryInFilters } = useCountryFiltersContext();
  const { width, height, viewBox, stroke, fill, strokeLinecap, strokeLinejoin, strokeWidth, paths, bounds } =
    useMapSvg();

  const [highlightPath, otherPaths] = useMemo(() => {
    const index = paths.findIndex((item) => item.id === highlightAlpha3);
    if (index === -1) return [null, paths];

    const otherPaths = paths.toSpliced(index, 1);

    return [paths[index], otherPaths];
  }, [highlightAlpha3, paths]);

  const click: LeafletMouseEventHandlerFn = ({ originalEvent }) => {
    const target = originalEvent.target as HTMLElement | null;
    const a3 = target?.getAttribute("data-a3"); // data-a3 is set in the SVGOverlay below

    console.log("click", a3, target?.id, target);

    if (a3) onClick?.(a3);
  };

  return (
    <SVGOverlay
      bounds={bounds}
      attributes={{ width, height, fill, stroke, strokeLinecap, strokeLinejoin, strokeWidth, viewBox }}
      opacity={1}
      interactive
      zIndex={1000}
      className="transition-colors duration-500 ease-in-out"
      eventHandlers={{ click }}
    >
      {otherPaths.map((path, index) => {
        const colorFilter = disableColorFilter || isCountryInFilters(path.id);
        const sovereingt = path.getAttribute("data-sovereignt") || "0";
        const lat = parseFloat(path.getAttribute("data-label_y") || "0");
        const lon = parseFloat(path.getAttribute("data-label_x") || "0");
        const sovA3 = path.getAttribute("data-sov_a3") || "";
        const admin = path.getAttribute("data-admin") || "";
        const adminA3 = path.getAttribute("data-adm0_a3") || "";
        const unitA3 = path.getAttribute("data-gu_a3") || "";
        const unit = path.getAttribute("data-geounit") || "";

        const isTerritory = sovA3 !== adminA3;
        const isUnit = adminA3 !== unitA3;

        return (
          <Fragment key={index}>
            <path
              data-a3={path.id}
              d={path.getAttribute("d") || ""}
              style={{
                strokeOpacity: colorFilter ? 0.5 : 0.15,
                stroke: "unset",
                fill: colorFilter ? "#94a3b8" : "#64748b",
                strokeWidth: 3 / zoom ** 2,
              }}
            />
            <CircleMarker center={[lat, lon]} stroke={false} fill={false} className="z-[-50000]">
              <Tooltip
                permanent
                interactive
                className={twMerge(
                  "rounded-md px-2 py-1 text-white shadow-none z-[-5000] flex flex-col items-center [&>*]:pointer-events-none",
                  isUnit ? "bg-blue-900" : isTerritory ? "bg-red-900" : "bg-slate-900/40",
                )}
                direction="center"
                eventHandlers={{ click: () => onClick?.(path.id) }}
              >
                <span className="text-sm">
                  {unit} ({unitA3})
                </span>
                {isUnit && (
                  <span className="text-[11px]">
                    {admin} ({adminA3})
                  </span>
                )}
                {isTerritory && (
                  <span className="text-[11px]">
                    {sovereingt} ({sovA3})
                  </span>
                )}
              </Tooltip>
            </CircleMarker>
          </Fragment>
        );
      })}

      {highlightPath && (
        <path
          data-a3={highlightAlpha3}
          d={highlightPath.getAttribute("d") || ""}
          style={{
            stroke: "#fcd34d",
            fill: "#fcd34d",
            strokeWidth: 2 / zoom ** 2,
          }}
        />
      )}
    </SVGOverlay>
  );
}
