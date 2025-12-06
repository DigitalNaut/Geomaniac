import type { LeafletEventHandlerFnMap } from "leaflet";
import { latLngBounds } from "leaflet";
import type { ComponentProps, PropsWithChildren } from "react";
import type { SVGOverlayProps } from "react-leaflet";
import { SVGOverlay } from "react-leaflet";
import { twMerge } from "tailwind-merge";

/**
 * Preset SVG attributes for the map
 */
const defaultSvgAttributes: SVGOverlayProps["attributes"] = {
  fill: "white",
  stroke: "white",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "0.01",
} as const;

const defaultBounds = {
  north: 85,
  south: -85,
  west: -180,
  east: 180,
} as const;

/**
 * Leaflet component to render an SVG map
 */
export default function SvgMap({
  className,
  children,
  eventHandlers,
  attributes,
  boundsAdjustment = { top: 0, bottom: 0, left: 0, right: 0 },
  ...rest
}: PropsWithChildren<
  {
    svg: string;
    className?: string;
    eventHandlers?: LeafletEventHandlerFnMap;
    attributes?: Record<string, string>;
    boundsAdjustment?: {
      top: number;
      bottom: number;
      left: number;
      right: number;
    };
  } & Omit<ComponentProps<typeof SVGOverlay>, "bounds">
>) {
  const bounds = latLngBounds([
    [defaultBounds.south - boundsAdjustment.bottom, defaultBounds.west - boundsAdjustment.left],
    [defaultBounds.north + boundsAdjustment.top, defaultBounds.east + boundsAdjustment.right],
  ]);

  return (
    <SVGOverlay
      interactive
      bounds={bounds}
      attributes={{
        ...defaultSvgAttributes,
        ...attributes,
      }}
      zIndex={1000}
      className={twMerge("transition-colors duration-500 ease-in-out", className)}
      eventHandlers={eventHandlers}
      {...rest}
    >
      {children}
    </SVGOverlay>
  );
}
