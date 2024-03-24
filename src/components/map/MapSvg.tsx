import { useMemo } from "react";
import { SVGOverlay } from "react-leaflet";
import { type LeafletMouseEventHandlerFn } from "leaflet";

import { useMapContext } from "src/contexts/MapContext";
import { useSvgAttributes } from "src/hooks/useSVGAttributes";
import { useCountryFiltersContext } from "src/contexts/CountryFiltersContext";
import mapSvg from "src/assets/images/world-map-mercator.svg?raw";

// TODO: Refactor
// Style presets for the map
// Geounit presets
const lighterBlueGray = "#94a3b8";
const darkerBlueGray = "#64748b";
const halfOpaque = 0.5;
const seeThrough = 0.15;

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

  const { paths, bounds, width, height, viewBox } = useSvgAttributes(mapSvg, ["width", "height", "viewBox"], {
    topLeftCorner: [-83.05, -180.6],
    bottomRightCorner: [83.09, 180.6],
  });

  const [highlightPath, otherPaths] = useMemo(() => {
    const index = paths.findIndex((item) => item.id === highlightAlpha3);
    if (index === -1) return [null, paths];

    const otherPaths = paths.toSpliced(index, 1);

    return [paths[index], otherPaths];
  }, [highlightAlpha3, paths]);

  const click: LeafletMouseEventHandlerFn = ({ originalEvent }) => {
    const target = originalEvent.target as HTMLElement | null;
    const a3 = target?.getAttribute("data-a3"); // data-a3 is set in the SVGOverlay below

    if (a3) onClick?.(a3);
  };

  const adjustForZoom = (value: number) => value / zoom ** 2;

  return (
    <SVGOverlay
      bounds={bounds}
      attributes={{
        width,
        height,
        fill: "white",
        stroke: "white",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: "0.01",
        viewBox,
      }}
      opacity={1}
      interactive
      zIndex={1000}
      className="transition-colors duration-500 ease-in-out"
      eventHandlers={{ click }}
    >
      {otherPaths.map((path, index) => {
        const colorFilter = disableColorFilter || isCountryInFilters(path.id);

        return (
          <path
            key={index}
            data-a3={path.id}
            d={path.getAttribute("d") || ""}
            style={{
              strokeOpacity: colorFilter ? halfOpaque : seeThrough,
              fill: colorFilter ? lighterBlueGray : darkerBlueGray,
              strokeWidth: adjustForZoom(3),
            }}
          />
        );
      })}

      {highlightPath && (
        <>
          <defs>
            <line id="line" stroke="yellow" strokeWidth="1px" y2="32" />
            <pattern
              id="pattern"
              width="8"
              height="32"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45 50 50)"
            >
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="1"
                  to="9"
                  dur="1s"
                  repeatCount="indefinite"
                />
                <use xlinkHref="#line" />
                <use xlinkHref="#line" x="-8" />
              </g>
            </pattern>
          </defs>
          <path
            data-a3={highlightAlpha3}
            d={highlightPath.getAttribute("d") || ""}
            className="border-dashed fill-yellow-400 stroke-yellow-400"
            style={{
              strokeWidth: adjustForZoom(2),
            }}
          />
        </>
      )}
    </SVGOverlay>
  );
}
