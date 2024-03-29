import { useMemo } from "react";
import { SVGOverlay } from "react-leaflet";
import { type LatLngBoundsExpression, latLng, latLngBounds } from "leaflet";

import { useMapContext } from "src/contexts/MapContext";
import mapSvg from "src/assets/images/world-map-mercator.svg?raw";
import { useCountryFiltersContext } from "src/contexts/CountryFiltersContext";

const viewBoxParser = /viewBox="(.+?)"/g;
const attributesParser = /<path d="(.+?)" A3="(.+?)" ADMIN="(.+?)"\/>/g;
const widthParser = /width="(.+?)"/g;
const heightParser = /height="(.+?)"/g;
const strokeParser = /stroke="(.+?)"/g;
const fillParser = /fill="(.+?)"/g;
const strokeLinecapParser = /stroke-linecap="(.+?)"/g;
const strokeLinejoinParser = /stroke-linejoin="(.+?)"/g;
const strokeWidthParser = /stroke-width="(.+?)"/g;

const width = widthParser.exec(mapSvg)?.[1] || "250";
const height = heightParser.exec(mapSvg)?.[1] || "250";
const viewBox = viewBoxParser.exec(mapSvg)?.[1] || "0 0 250 250";
const stroke = strokeParser.exec(mapSvg)?.[1] || "#fff";
const fill = fillParser.exec(mapSvg)?.[1] || "#7c7c7c";
const strokeLinecap = strokeLinecapParser.exec(mapSvg)?.[1] || "round";
const strokeLinejoin = strokeLinejoinParser.exec(mapSvg)?.[1] || "round";
const strokeWidth = strokeWidthParser.exec(mapSvg)?.[1] || "0.01";

const svgPaths = [...mapSvg.matchAll(attributesParser)].map(([, path, a3, admin]) => ({ path, a3, admin }));

const topLeftCorner = latLng(-84.267, -180.5);
const bottomRightCorner = latLng(93, 172.1);
const maxBounds = latLngBounds(topLeftCorner, bottomRightCorner);

const bounds: LatLngBoundsExpression = maxBounds;
/**
 * Renders the map SVG as an overlay on the map.
 * @param props
 * @returns
 */
export function SvgMap({
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

  const [highlightPath, otherPaths] = useMemo(() => {
    const index = svgPaths.findIndex((item) => item.a3 === highlightAlpha3);
    if (index === -1) return [undefined, svgPaths];

    const otherPaths = svgPaths.filter((_, i) => i !== index);
    return [svgPaths[index].path, otherPaths];
  }, [highlightAlpha3]);

  const onClickHandler = ({ originalEvent }: { originalEvent: MouseEvent }) => {
    const target = originalEvent.target as SVGPathElement | null;
    const a3 = target?.getAttribute("data-a3"); // data-a3 is set in the SVGOverlay below
    if (onClick && a3) onClick(a3);
  };

  return (
    <SVGOverlay
      bounds={bounds}
      attributes={{
        xmlns: "http://www.w3.org/2000/svg",
        width,
        height,
        fill,
        stroke,
        strokeLinecap,
        strokeLinejoin,
        strokeWidth,
        viewBox,
      }}
      opacity={1}
      interactive
      zIndex={1000}
      className="transition-colors duration-500 ease-in-out"
      eventHandlers={{
        click: onClickHandler,
      }}
    >
      {otherPaths.map(({ a3, path }, index) => {
        const colorFilter = disableColorFilter || isCountryInFilters(a3);

        return (
          <path
            key={index}
            data-a3={a3}
            d={path}
            style={{
              strokeOpacity: colorFilter ? 0.5 : 0.15,
              stroke: "unset",
              fill: colorFilter ? "#94a3b8" : "#64748b",
              strokeWidth: 1 / zoom ** 2,
            }}
          />
        );
      })}
      {/* SVG path for the highlight country must be rendered last to be on top of the other countries */}
      {highlightPath && (
        <path
          data-a3={highlightAlpha3}
          d={highlightPath}
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
