import { useMemo } from "react";
import { SVGOverlay } from "react-leaflet";
import {} from "tailwind-merge";
import { type LeafletMouseEventHandlerFn } from "leaflet";

import { useMapContext } from "src/contexts/MapContext";
import { useMapSvg } from "src/hooks/useSVGMap";
import { useCountryFiltersContext } from "src/contexts/CountryFiltersContext";

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

        return (
          <path
            key={index}
            data-a3={path.id}
            d={path.getAttribute("d") || ""}
            style={{
              strokeOpacity: colorFilter ? 0.5 : 0.15,
              stroke: "unset",
              fill: colorFilter ? "#94a3b8" : "#64748b",
              strokeWidth: 3 / zoom ** 2,
            }}
          />
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
